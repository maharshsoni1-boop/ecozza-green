import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      const order = await prisma.order.findUnique({
        where: { razorpayOrderId },
        include: { orderItems: true },
      });

      if (order && order.paymentStatus !== "CAPTURED") {
        const trackingNum = `SR-GJ-${Math.floor(100000 + Math.random() * 900000)}`;
        await prisma.order.update({
          where: { id: order.id },
          data: {
            orderStatus: "PAID",
            paymentStatus: "CAPTURED",
            razorpayPaymentId,
            trackingNumber: trackingNum,
            trackingUrl: `https://shiprocket.co/tracking/${trackingNum}`,
          },
        });

        // Decrement stock
        for (const item of order.orderItems) {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
