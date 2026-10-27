"use server";

import prisma from "@/lib/prisma";

export async function trackOrderAction(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) {
    return { success: false, error: "Please enter your Order Number or 10-digit Phone Number." };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: trimmed },
          { customerPhone: trimmed },
          { customerPhone: `+91${trimmed}` },
        ],
      },
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!order) {
      return {
        success: false,
        error: `No order found matching "${trimmed}". Please double check your order number or registered phone number.`,
      };
    }

    return {
      success: true,
      order: {
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
        totalAmount: order.totalAmount,
        shippingAddress: JSON.parse(order.shippingAddress as string),
        items: order.orderItems.map((i) => ({
          id: i.id,
          productName: i.productName,
          variantTitle: i.variantTitle,
          quantity: i.quantity,
          weightKg: i.weightKg,
        })),
      },
    };
  } catch (err) {
    console.error("Order tracking error:", err);
    return { success: false, error: "Failed to retrieve order status. Please try again." };
  }
}
