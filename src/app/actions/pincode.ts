"use server";

import prisma from "@/lib/prisma";

export interface PincodeCheckResult {
  pincode: string;
  isServiceable: boolean;
  city?: string;
  state?: string;
  isCodAvailable: boolean;
  deliveryTatDays: number;
  message: string;
}

export async function checkPincodeServiceability(
  pincode: string
): Promise<PincodeCheckResult> {
  const trimmed = pincode.trim();
  const pinRegex = /^[1-9][0-9]{5}$/;

  if (!pinRegex.test(trimmed)) {
    return {
      pincode: trimmed,
      isServiceable: false,
      isCodAvailable: false,
      deliveryTatDays: 0,
      message: "Please enter a valid 6-digit Indian postal code.",
    };
  }

  try {
    const record = await prisma.pincodeServiceability.findUnique({
      where: { pincode: trimmed },
    });

    if (record) {
      return {
        pincode: record.pincode,
        isServiceable: record.isServiceable,
        city: record.city,
        state: record.state,
        isCodAvailable: record.isCodAvailable,
        deliveryTatDays: record.deliveryTatDays,
        message: record.isServiceable
          ? `Delivering to ${record.city}, ${record.state} in ${record.deliveryTatDays} business days.`
          : `Delivery currently unavailable for PIN ${trimmed}.`,
      };
    }

    // Default pan-India courier estimate for valid 6-digit PIN
    return {
      pincode: trimmed,
      isServiceable: true,
      city: "Standard Zone",
      state: "India",
      isCodAvailable: false, // Default to prepaid for remote unmapped PINs
      deliveryTatDays: 5,
      message: "Pan-India standard courier delivery available (approx. 4-6 business days).",
    };
  } catch (error) {
    console.error("Error checking pincode:", error);
    return {
      pincode: trimmed,
      isServiceable: true,
      isCodAvailable: false,
      deliveryTatDays: 5,
      message: "Standard delivery available via Shiprocket courier network.",
    };
  }
}
