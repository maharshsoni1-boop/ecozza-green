import prisma from "@/lib/prisma";

export interface ShippingRateResult {
  shippingFee: number;
  isFreeShipping: boolean;
  serviceable: boolean;
  isCodAvailable: boolean;
  deliveryTatDays: number;
  carrierName: string;
}

export interface ShippingProvider {
  getShippingRate(pincode: string, weightKg: number, subtotal: number): Promise<ShippingRateResult>;
  createShipment(orderId: string, address: any): Promise<{ trackingNumber: string; carrierName: string; trackingUrl: string }>;
}

export class MockShippingProvider implements ShippingProvider {
  async getShippingRate(
    pincode: string,
    weightKg: number,
    subtotal: number
  ): Promise<ShippingRateResult> {
    const pin = pincode.trim();
    const pinRecord = await prisma.pincodeServiceability.findUnique({
      where: { pincode: pin },
    });

    const isServiceable = pinRecord ? pinRecord.isServiceable : true;
    const isCodAvailable = pinRecord ? pinRecord.isCodAvailable : false;
    const deliveryTatDays = pinRecord ? pinRecord.deliveryTatDays : 4;

    // Check free shipping threshold (default ₹1499)
    const thresholdSetting = await prisma.systemSetting.findUnique({
      where: { key: "free_shipping_threshold" },
    });
    const freeThreshold = thresholdSetting ? parseFloat(thresholdSetting.value) : 1499;

    if (subtotal >= freeThreshold) {
      return {
        shippingFee: 0,
        isFreeShipping: true,
        serviceable: isServiceable,
        isCodAvailable,
        deliveryTatDays,
        carrierName: "Shiprocket Express",
      };
    }

    // Weight based matrix (India freight)
    let fee = 99;
    if (weightKg <= 5) {
      fee = 99;
    } else if (weightKg <= 10) {
      fee = 149;
    } else if (weightKg <= 25) {
      fee = 249;
    } else {
      // For heavy shipments: 249 + 15 per additional kg
      fee = 249 + Math.ceil(weightKg - 25) * 15;
    }

    return {
      shippingFee: fee,
      isFreeShipping: false,
      serviceable: isServiceable,
      isCodAvailable,
      deliveryTatDays,
      carrierName: "Shiprocket Surface",
    };
  }

  async createShipment(
    orderNumber: string,
    _address: any
  ): Promise<{ trackingNumber: string; carrierName: string; trackingUrl: string }> {
    // Generate simulated Shiprocket tracking number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `SR-GJ-${randomSuffix}`;
    return {
      trackingNumber,
      carrierName: "Shiprocket / Blue Dart",
      trackingUrl: `https://shiprocket.co/tracking/${trackingNumber}`,
    };
  }
}

// Singleton provider instance (ready to switch to real Shiprocket provider via env)
export const shippingService: ShippingProvider = new MockShippingProvider();
