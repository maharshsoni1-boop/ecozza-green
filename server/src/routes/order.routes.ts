import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { shippingService } from '../lib/shipping.js'

const router = Router()

// GET /api/orders - List orders (for Admin or user history)
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true,
      },
    })
    res.json({ success: true, data: orders })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders', details: err.message })
  }
})

// GET /api/orders/:id - Get single order with invoice details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        orderItems: true,
      },
    })

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    let parsedShipping = {}
    let parsedBilling = {}
    try {
      parsedShipping = JSON.parse(order.shippingAddress)
    } catch {
      parsedShipping = { raw: order.shippingAddress }
    }
    try {
      parsedBilling = JSON.parse(order.billingAddress)
    } catch {
      parsedBilling = { raw: order.billingAddress }
    }

    res.json({
      success: true,
      data: {
        ...order,
        shippingAddress: parsedShipping,
        billingAddress: parsedBilling,
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch order', details: err.message })
  }
})

// POST /api/orders - Create a new customer order
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      items,
      subtotalAmount,
      taxAmount,
      shippingAmount,
      totalAmount,
      customerEmail,
      customerPhone,
      customerName,
      customerGstin,
      shippingAddress,
      billingAddress,
      paymentMethod = 'RAZORPAY',
    } = req.body

    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'Order must contain items' })
    }

    const orderNumber = `EG-ORD-${Date.now().toString().slice(-6)}`

    // Resolve valid database variant IDs to guarantee foreign key integrity
    const defaultVariant = await prisma.productVariant.findFirst()

    const orderItemsData = await Promise.all(
      items.map(async (item: any) => {
        let validVariantId = item.variantId
        if (validVariantId) {
          const exists = await prisma.productVariant.findUnique({
            where: { id: validVariantId },
          })
          if (!exists) {
            validVariantId = defaultVariant ? defaultVariant.id : validVariantId
          }
        } else {
          validVariantId = defaultVariant ? defaultVariant.id : 'default'
        }

        return {
          variantId: validVariantId,
          productName: item.productName || 'Biochar Conditioner',
          variantTitle: item.variantTitle || 'Standard Pack',
          weightKg: Number(item.weightKg) || 1.0,
          unitPrice: Number(item.unitPrice) || Number(item.price) || 0,
          gstRate: 5.0,
          quantity: Number(item.quantity) || 1,
          totalPrice: (Number(item.unitPrice) || Number(item.price) || 0) * (Number(item.quantity) || 1),
        }
      })
    )

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: customerEmail || 'guest@example.com',
        customerPhone: customerPhone || '9999999999',
        customerName: customerName || 'Valued Customer',
        customerGstin: customerGstin?.trim() || null,
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress || {}),
        billingAddress: typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress || {}),
        subtotalAmount: Number(subtotalAmount) || Number(totalAmount) || 0,
        shippingAmount: Number(shippingAmount) || 0,
        taxAmount: Number(taxAmount) || 0,
        totalAmount: Number(totalAmount) || 0,
        orderStatus: 'PLACED',
        paymentStatus: 'PENDING',
        paymentMethod,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: true,
      },
    })

    res.status(201).json({ success: true, data: order })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to create order', details: err.message })
  }
})

// PATCH /api/orders/:id/status - Update order fulfillment, tracking & carrier (Admin)
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const { orderStatus, paymentStatus, trackingNumber, carrierName, trackingUrl } = req.body

    const data: any = {}
    if (orderStatus) data.orderStatus = orderStatus
    if (paymentStatus) data.paymentStatus = paymentStatus
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber
    if (carrierName !== undefined) data.carrierName = carrierName
    if (trackingUrl !== undefined) data.trackingUrl = trackingUrl

    // If marked SHIPPED and trackingUrl missing, auto-populate Shiprocket link
    if (trackingNumber && !data.trackingUrl) {
      data.trackingUrl = `https://shiprocket.co/tracking/${trackingNumber}`
    }

    const updated = await prisma.order.update({
      where: { id },
      data,
      include: {
        orderItems: true,
      },
    })

    res.json({ success: true, data: updated })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update order status', details: err.message })
  }
})

// POST /api/orders/:id/shiprocket - Create live Shiprocket shipment & generate AWB
router.post('/:id/shiprocket', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    })

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    const shipment = await shippingService.createShipment(order)

    if (!shipment) {
      return res.status(502).json({
        success: false,
        error: 'Shiprocket API was unable to register shipment. Please verify address details and pickup location.',
      })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: 'SHIPPED',
        trackingNumber: shipment.trackingNumber,
        carrierName: shipment.carrierName,
        trackingUrl: shipment.trackingUrl,
      },
      include: { orderItems: true },
    })

    res.json({
      success: true,
      message: `Shipment created with ${shipment.carrierName}. AWB: ${shipment.trackingNumber}`,
      data: updated,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to create Shiprocket shipment', details: err.message })
  }
})

// DELETE /api/orders/:id - Delete order (e.g. test orders)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    await prisma.order.delete({ where: { id } })
    res.json({ success: true, message: 'Order deleted successfully' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to delete order', details: err.message })
  }
})

export default router
