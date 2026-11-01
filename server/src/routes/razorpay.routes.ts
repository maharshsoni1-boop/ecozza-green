import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { createRazorpayOrder, verifyRazorpaySignature } from '../lib/razorpay.js'

const router = Router()

// POST /api/razorpay/create-order
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }

    const rzpOrder = await createRazorpayOrder(order.orderNumber, order.totalAmount)

    // Save razorpay order id on the order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayOrderId: rzpOrder.id,
      },
    })

    res.json({
      success: true,
      data: {
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_ecozza',
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to initiate Razorpay payment', details: err.message })
  }
})

// POST /api/razorpay/verify
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ success: false, error: 'Missing payment confirmation parameters' })
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (!isValid) {
      return res.status(400).json({ success: false, error: 'Payment signature verification failed' })
    }

    const order = await prisma.order.findFirst({
      where: { razorpayOrderId },
    })

    if (!order) {
      return res.status(404).json({ success: false, error: 'Matching order not found' })
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${order.orderNumber.replace(/[^0-9]/g, '').slice(-4)}`

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'PAID',
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || 'simulated_sig',
        invoiceNumber,
      },
    })

    res.json({
      success: true,
      data: {
        orderId: updated.id,
        orderNumber: updated.orderNumber,
        invoiceNumber: updated.invoiceNumber,
        status: updated.orderStatus,
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Payment verification failed', details: err.message })
  }
})

export default router
