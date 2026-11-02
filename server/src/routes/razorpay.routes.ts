import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  fetchRazorpayPaymentDetails,
} from '../lib/razorpay.js'
import { shippingService } from '../lib/shipping.js'

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
      include: {
        orderItems: true,
      },
    })

    if (!order) {
      return res.status(404).json({ success: false, error: 'Matching order not found' })
    }

    // 1. Fetch verified phone & contact from Razorpay payment details
    const paymentDetails = await fetchRazorpayPaymentDetails(razorpayPaymentId)
    let verifiedPhone = order.customerPhone
    let phoneUpdatedFromPayment = false

    if (paymentDetails?.contact) {
      // Clean up phone number (remove country code +91 if present for standard 10 digits)
      const cleanContact = paymentDetails.contact.replace(/\D/g, '').slice(-10)
      if (cleanContact.length === 10) {
        if (cleanContact !== order.customerPhone) {
          phoneUpdatedFromPayment = true
        }
        verifiedPhone = cleanContact
      }
    }

    // Update shippingAddress JSON if it contains phone
    let updatedShippingAddress = order.shippingAddress
    try {
      const parsedAddress = JSON.parse(order.shippingAddress)
      if (parsedAddress && typeof parsedAddress === 'object') {
        parsedAddress.phone = verifiedPhone
        updatedShippingAddress = JSON.stringify(parsedAddress)
      }
    } catch {}

    const invoiceNumber = `INV-${new Date().getFullYear()}-${order.orderNumber.replace(/[^0-9]/g, '').slice(-4)}`

    // 2. Prepare order payload for Shiprocket creation
    const orderForShipment = {
      ...order,
      customerPhone: verifiedPhone,
      customerEmail: paymentDetails?.email || order.customerEmail,
      shippingAddress: updatedShippingAddress,
    }

    // 3. Register shipment in Shiprocket
    let shipmentData: any = null
    try {
      shipmentData = await shippingService.createShipment(orderForShipment)
    } catch (shipErr: any) {
      console.warn('[Shiprocket Initial Dispatch Warning]', shipErr.message)
    }

    const trackingNumber = shipmentData?.trackingNumber || null
    const carrierName = shipmentData?.carrierName || 'Shiprocket Express'
    const trackingUrl = shipmentData?.trackingUrl || (trackingNumber ? `https://shiprocket.co/tracking/${trackingNumber}` : null)
    const orderStatus = trackingNumber ? 'CONFIRMED' : 'PAID'

    // 4. Save payment and shipment in a single atomic database update
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        orderStatus,
        customerPhone: verifiedPhone,
        customerEmail: paymentDetails?.email || order.customerEmail,
        shippingAddress: updatedShippingAddress,
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || 'simulated_sig',
        invoiceNumber,
        trackingNumber,
        carrierName,
        trackingUrl,
      },
      include: {
        orderItems: true,
      },
    })

    // 5. Background retry if initial sync needed extra time
    if (!trackingNumber) {
      setTimeout(async () => {
        try {
          console.log(`[Background Shipment Dispatch] Retrying Shiprocket for order ${updated.orderNumber}...`)
          const bgShipment = await shippingService.createShipment(updated)
          if (bgShipment?.trackingNumber) {
            await prisma.order.update({
              where: { id: updated.id },
              data: {
                trackingNumber: bgShipment.trackingNumber,
                carrierName: bgShipment.carrierName,
                trackingUrl: bgShipment.trackingUrl,
                orderStatus: 'CONFIRMED',
              },
            })
            console.log(`[Background Shipment Dispatch] Success for order ${updated.orderNumber}: ${bgShipment.trackingNumber}`)
          }
        } catch (bgErr: any) {
          console.error(`[Background Shipment Dispatch Error] ${updated.orderNumber}:`, bgErr.message)
        }
      }, 2500)
    }

    res.json({
      success: true,
      data: {
        orderId: updated.id,
        orderNumber: updated.orderNumber,
        invoiceNumber: updated.invoiceNumber,
        customerPhone: updated.customerPhone,
        phoneUpdatedFromPayment,
        status: updated.orderStatus,
        trackingNumber,
        carrierName,
        trackingUrl,
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Payment verification failed', details: err.message })
  }
})

export default router
