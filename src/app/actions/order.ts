"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { shippingService } from "@/lib/shipping";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^[0-9+ ]{10,14}$/, "Valid 10-digit phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Valid 6-digit Indian PIN required"),
});

const checkoutInputSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(/^[0-9+ ]{10,14}$/),
  customerGstin: z.string().optional(),
  companyName: z.string().optional(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  amountInr?: number;
  paymentMethod?: string;
  error?: string;
}

export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  const parsed = checkoutInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  const data = parsed.data;

  // 1. Fetch Variants and verify availability
  const variantIds = data.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  if (variants.length !== data.items.length) {
    return { success: false, error: "Some products in your cart are no longer available." };
  }

  // 2. Calculate Totals
  let subtotalAmount = 0;
  let totalWeightKg = 0;
  const orderItemsData = [];

  for (const item of data.items) {
    const variant = variants.find((v) => v.id === item.variantId)!;

    if (variant.isBulkQuoteOnly) {
      return {
        success: false,
        error: `${variant.product.name} (${variant.title}) is for bulk quote only. Please use the B2B enquiry form.`,
      };
    }

    if (variant.stockQuantity < item.quantity) {
      return {
        success: false,
        error: `Only ${variant.stockQuantity} bags of ${variant.product.name} are available in stock.`,
      };
    }

    const itemTotal = variant.price * item.quantity;
    subtotalAmount += itemTotal;
    totalWeightKg += variant.weightKg * item.quantity;

    orderItemsData.push({
      variantId: variant.id,
      productName: variant.product.name,
      variantTitle: variant.title,
      weightKg: variant.weightKg,
      unitPrice: variant.price,
      gstRate: variant.product.gstRatePercentage,
      quantity: item.quantity,
      totalPrice: itemTotal,
    });
  }

  // 3. Shipping Fee calculation
  const shippingInfo = await shippingService.getShippingRate(
    data.shippingAddress.postalCode,
    totalWeightKg,
    subtotalAmount
  );

  if (!shippingInfo.serviceable) {
    return {
      success: false,
      error: `Sorry, courier delivery is currently not serviceable to pincode ${data.shippingAddress.postalCode}.`,
    };
  }

  if (data.paymentMethod === "COD" && !shippingInfo.isCodAvailable) {
    return {
      success: false,
      error: `Cash on Delivery is unavailable for PIN ${data.shippingAddress.postalCode}. Please choose Razorpay (UPI/Cards).`,
    };
  }

  const shippingAmount = shippingInfo.shippingFee;
  const taxAmount = Math.round((subtotalAmount * 5) / 105); // 5% GST included
  const totalAmount = subtotalAmount + shippingAmount;

  // 4. Generate Numbers
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `EG-ORD-${randomSuffix}`;
  const invoiceNumber = `INV-2026-${randomSuffix}`;

  // 5. Razorpay or COD processing
  let razorpayOrderId: string | null = null;
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_ecozza";

  if (data.paymentMethod === "RAZORPAY") {
    const rzpOrder = await createRazorpayOrder(orderNumber, totalAmount);
    razorpayOrderId = rzpOrder.id;
  }

  const isCod = data.paymentMethod === "COD";

  // 6. Create Order record in DB
  const order = await prisma.order.create({
    data: {
      orderNumber,
      invoiceNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerGstin: data.customerGstin?.trim() || null,
      shippingAddress: JSON.stringify(data.shippingAddress),
      billingAddress: JSON.stringify(data.billingAddress),
      orderStatus: isCod ? "PLACED" : "PLACED",
      paymentStatus: isCod ? "PENDING" : "PENDING",
      paymentMethod: data.paymentMethod,
      razorpayOrderId,
      subtotalAmount,
      shippingAmount,
      taxAmount,
      totalAmount,
      carrierName: shippingInfo.carrierName,
      trackingNumber: isCod ? `SR-GJ-${Math.floor(100000 + Math.random() * 900000)}` : null,
      trackingUrl: isCod ? `https://shiprocket.co/tracking/SR-GJ-${Math.floor(100000 + Math.random() * 900000)}` : null,
      orderItems: {
        create: orderItemsData,
      },
    },
  });

  // If COD, decrement inventory immediately
  if (isCod) {
    for (const item of data.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }
  }

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    razorpayOrderId: razorpayOrderId || undefined,
    razorpayKeyId,
    amountInr: totalAmount,
    paymentMethod: data.paymentMethod,
  };
}

export async function confirmRazorpayPayment(data: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const isValid = verifyRazorpaySignature(
    data.razorpayOrderId,
    data.razorpayPaymentId,
    data.razorpaySignature
  );

  if (!isValid) {
    return { success: false, error: "Invalid payment signature verification failed." };
  }

  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    include: { orderItems: true },
  });

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  // If already paid, return early (idempotent)
  if (order.paymentStatus === "CAPTURED") {
    return { success: true, orderNumber: order.orderNumber };
  }

  const randomTracking = `SR-GJ-${Math.floor(100000 + Math.random() * 900000)}`;

  // Update order to PAID and assign tracking
  await prisma.order.update({
    where: { id: data.orderId },
    data: {
      orderStatus: "PAID",
      paymentStatus: "CAPTURED",
      razorpayPaymentId: data.razorpayPaymentId,
      razorpaySignature: data.razorpaySignature,
      trackingNumber: randomTracking,
      trackingUrl: `https://shiprocket.co/tracking/${randomTracking}`,
    },
  });

  // Decrement variant stock
  for (const item of order.orderItems) {
    await prisma.productVariant.update({
      where: { id: item.variantId },
      data: { stockQuantity: { decrement: item.quantity } },
    });
  }

  return { success: true, orderNumber: order.orderNumber };
}
