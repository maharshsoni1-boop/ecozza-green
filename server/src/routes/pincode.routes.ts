import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { shippingService } from '../lib/shipping.js'

const router = Router()

// GET /api/pincode/:pincode?weightKg=5&subtotal=1000
router.get('/:pincode', async (req: Request, res: Response) => {
  try {
    const pincode = req.params.pincode as string
    const weightKg = parseFloat((req.query.weightKg as string) || '5')
    const subtotal = parseFloat((req.query.subtotal as string) || '0')

    const trimmed = pincode.trim()
    const pinRegex = /^[1-9][0-9]{5}$/

    if (!pinRegex.test(trimmed)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 6-digit Indian postal code.',
      })
    }

    const shippingInfo = await shippingService.getShippingRate(trimmed, weightKg, subtotal)

    const record = await prisma.pincodeServiceability.findUnique({
      where: { pincode: trimmed },
    })

    const city = shippingInfo.city || record?.city || 'Standard Zone'
    const state = shippingInfo.state || record?.state || 'India'

    res.json({
      success: true,
      data: {
        pincode: trimmed,
        city,
        state,
        isServiceable: shippingInfo.serviceable,
        isCodAvailable: shippingInfo.isCodAvailable,
        deliveryTatDays: shippingInfo.deliveryTatDays,
        shippingFee: shippingInfo.shippingFee,
        isFreeShipping: shippingInfo.isFreeShipping,
        carrierName: shippingInfo.carrierName,
        message: `Delivering to ${city} in approx. ${shippingInfo.deliveryTatDays} business days via ${shippingInfo.carrierName}.`,
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to verify pincode', details: err.message })
  }
})

export default router
