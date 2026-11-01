import { prisma } from './prisma.js'

export interface ShippingRateResult {
  shippingFee: number
  isFreeShipping: boolean
  serviceable: boolean
  isCodAvailable: boolean
  deliveryTatDays: number
  carrierName: string
}

export interface ShippingProvider {
  getShippingRate(pincode: string, weightKg: number, subtotal: number): Promise<ShippingRateResult>
  createShipment(orderId: string, address: any): Promise<{ trackingNumber: string; carrierName: string; trackingUrl: string }>
}

export class MockShippingProvider implements ShippingProvider {
  async getShippingRate(
    pincode: string,
    weightKg: number,
    subtotal: number
  ): Promise<ShippingRateResult> {
    const pin = pincode.trim()
    const pinRecord = await prisma.pincodeServiceability.findUnique({
      where: { pincode: pin },
    })

    const isServiceable = pinRecord ? pinRecord.isServiceable : true
    const isCodAvailable = pinRecord ? pinRecord.isCodAvailable : false
    const deliveryTatDays = pinRecord ? pinRecord.deliveryTatDays : 4

    // Check free shipping threshold (default ₹1499)
    const thresholdSetting = await prisma.systemSetting.findUnique({
      where: { key: 'free_shipping_threshold' },
    })
    const freeThreshold = thresholdSetting ? parseFloat(thresholdSetting.value) : 1499

    if (subtotal >= freeThreshold) {
      return {
        shippingFee: 0,
        isFreeShipping: true,
        serviceable: isServiceable,
        isCodAvailable,
        deliveryTatDays,
        carrierName: 'Shiprocket Express',
      }
    }

    // Weight based matrix (India freight)
    let fee = 99
    if (weightKg <= 5) {
      fee = 99
    } else if (weightKg <= 10) {
      fee = 149
    } else if (weightKg <= 25) {
      fee = 249
    } else {
      fee = 249 + Math.ceil(weightKg - 25) * 15
    }

    return {
      shippingFee: fee,
      isFreeShipping: false,
      serviceable: isServiceable,
      isCodAvailable,
      deliveryTatDays,
      carrierName: 'Delhivery Surface Cargo',
    }
  }

  async createShipment(orderId: string, address: any) {
    const trackingNumber = `SR-IND-${Date.now().toString().slice(-8)}`
    return {
      trackingNumber,
      carrierName: 'Shiprocket Cargo Express',
      trackingUrl: `https://shiprocket.co/tracking/${trackingNumber}`,
    }
  }
}

export const shippingService: ShippingProvider = new MockShippingProvider()
