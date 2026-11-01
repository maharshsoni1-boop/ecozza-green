import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /api/orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      take: 50,
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

// POST /api/orders - Create a new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      items,
      subtotalAmount,
      taxAmount,
      totalAmount,
      customerEmail,
      customerPhone,
      customerName,
      shippingAddress,
      billingAddress,
    } = req.body

    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'Order must contain items' })
    }

    const orderNumber = `EG-ORD-${Date.now().toString().slice(-6)}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: customerEmail || 'guest@example.com',
        customerPhone: customerPhone || '9999999999',
        customerName: customerName || 'Valued Customer',
        shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress || {}),
        billingAddress: typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress || {}),
        subtotalAmount: Number(subtotalAmount) || Number(totalAmount) || 0,
        taxAmount: Number(taxAmount) || 0,
        totalAmount: Number(totalAmount) || 0,
        orderStatus: 'PLACED',
        paymentStatus: 'PENDING',
        orderItems: {
          create: items.map((item: any) => ({
            variantId: item.variantId,
            productName: item.productName || 'Eco-product',
            variantTitle: item.variantTitle || 'Standard',
            weightKg: Number(item.weightKg) || 1.0,
            unitPrice: Number(item.unitPrice) || Number(item.price) || 0,
            gstRate: 5.0,
            quantity: Number(item.quantity) || 1,
            totalPrice: (Number(item.unitPrice) || Number(item.price) || 0) * (Number(item.quantity) || 1),
          })),
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

export default router
