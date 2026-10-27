"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: string,
  trackingNumber?: string,
  carrierName?: string
) {
  try {
    const data: any = { orderStatus: newStatus };
    if (trackingNumber) {
      data.trackingNumber = trackingNumber.trim();
      data.trackingUrl = `https://shiprocket.co/tracking/${trackingNumber.trim()}`;
    }
    if (carrierName) {
      data.carrierName = carrierName.trim();
    }

    if (newStatus === "DELIVERED") {
      data.paymentStatus = "CAPTURED";
    }

    await prisma.order.update({
      where: { id: orderId },
      data,
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/track-order");
    return { success: true };
  } catch (err: any) {
    console.error("Order status update failed:", err);
    return { success: false, error: err.message || "Failed to update order status." };
  }
}
