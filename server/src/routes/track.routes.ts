import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /api/track/:identifier - Order number or phone
router.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const identifier = (req.params.identifier as string).trim()
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Please provide an order number or phone number' })
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: identifier },
          { customerPhone: identifier },
          { customerPhone: `+91${identifier}` },
        ],
      },
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `No order found matching "${identifier}". Please check your order ID or registered phone.`,
      })
    }

    let parsedAddress = {}
    try {
      parsedAddress = JSON.parse(order.shippingAddress)
    } catch {
      parsedAddress = { raw: order.shippingAddress }
    }

    res.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        trackingNumber: order.trackingNumber,
        carrierName: order.carrierName,
        trackingUrl: order.trackingUrl,
        invoiceNumber: order.invoiceNumber,
        subtotalAmount: order.subtotalAmount,
        taxAmount: order.taxAmount,
        totalAmount: order.totalAmount,
        shippingAddress: parsedAddress,
        items: order.orderItems.map((item) => ({
          id: item.id,
          productName: item.productName,
          variantTitle: item.variantTitle,
          weightKg: item.weightKg,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to retrieve tracking details', details: err.message })
  }
})

export default router
