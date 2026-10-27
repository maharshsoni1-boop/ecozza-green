import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  Printer,
  ArrowRight,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface OrderConfirmationProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddr = JSON.parse(order.shippingAddress as string);
  const totalWeight = order.orderItems.reduce((acc, item) => acc + item.weightKg * item.quantity, 0);

  const isIntraState = (shippingAddr.state || "").toLowerCase() === "gujarat";
  const cgstAmount = isIntraState ? (order.taxAmount / 2).toFixed(2) : "0.00";
  const sgstAmount = isIntraState ? (order.taxAmount / 2).toFixed(2) : "0.00";
  const igstAmount = !isIntraState ? order.taxAmount.toFixed(2) : "0.00";

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Celebration Header Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5E0D6] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="badge-carbon mb-2">Order Confirmed</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121614] font-heading">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-[#58635B] mt-1.5">
              Order Number: <strong className="text-[#121614]">{order.orderNumber}</strong> • Invoice:{" "}
              <strong className="text-[#121614]">{order.invoiceNumber}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/invoice/${order.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEBE1] border border-[#E5E0D6] text-xs font-bold text-[#121614] transition-colors"
            >
              <Printer className="w-4 h-4 text-[#2E6B47]" />
              <span>Print GST Tax Invoice</span>
            </Link>

            <Link
              href={`/track-order?orderNumber=${order.orderNumber}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Track Consignment</span>
            </Link>

            <a
              href={`https://wa.me/919876543210?text=Hello%20Ecozza%20Green%2C%20I%20have%20an%20inquiry%20regarding%20my%20order%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E6B47] text-white text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Updates</span>
            </a>
          </div>
        </div>

        {/* Order Status & Tracking Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0D6] space-y-6">
          <h2 className="text-base font-bold font-heading text-[#121614]">
            Fulfillment & Courier Status
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className={`p-4 rounded-2xl border ${order.orderStatus ? "bg-[#E9F4EE] border-[#2E6B47]/30 text-[#1E3A2B]" : "bg-[#FAF8F5] border-[#E5E0D6] text-[#8C978F]"}`}>
              <div className="text-xs font-bold">1. Placed</div>
              <div className="text-[10px] mt-0.5">Order Received</div>
            </div>
            <div className={`p-4 rounded-2xl border ${order.paymentStatus === "CAPTURED" || order.paymentMethod === "COD" ? "bg-[#E9F4EE] border-[#2E6B47]/30 text-[#1E3A2B]" : "bg-[#FAF8F5] border-[#E5E0D6] text-[#8C978F]"}`}>
              <div className="text-xs font-bold">2. Payment</div>
              <div className="text-[10px] mt-0.5">{order.paymentMethod === "COD" ? "COD Confirmed" : "Paid via Razorpay"}</div>
            </div>
            <div className={`p-4 rounded-2xl border ${order.orderStatus === "PACKED" || order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED" ? "bg-[#E9F4EE] border-[#2E6B47]/30 text-[#1E3A2B]" : "bg-[#FAF8F5] border-[#E5E0D6] text-[#8C978F]"}`}>
              <div className="text-xs font-bold">3. Packed</div>
              <div className="text-[10px] mt-0.5">Bagged at Facility</div>
            </div>
            <div className={`p-4 rounded-2xl border ${order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED" ? "bg-[#E9F4EE] border-[#2E6B47]/30 text-[#1E3A2B]" : "bg-[#FAF8F5] border-[#E5E0D6] text-[#8C978F]"}`}>
              <div className="text-xs font-bold">4. Dispatched</div>
              <div className="text-[10px] mt-0.5">{order.carrierName || "Shiprocket"}</div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFEBE1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[#58635B]">Carrier Tracking AWB: </span>
                <strong className="text-[#121614]">{order.trackingNumber}</strong>
                <span className="text-[#8C978F] ml-2">({order.carrierName})</span>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#2E6B47] hover:underline"
                >
                  View Courier Status &rarr;
                </a>
              )}
            </div>
          )}
        </div>

        {/* Consignment Items & GST Tax Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Items */}
          <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4">
            <h3 className="text-sm font-bold font-heading text-[#121614]">
              Ordered Granules ({totalWeight} kg Total)
            </h3>
            <div className="divide-y divide-[#EFEBE1]">
              {order.orderItems.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-[#121614]">{item.productName}</div>
                    <div className="text-[11px] text-[#58635B]">
                      {item.variantTitle} × {item.quantity} ({item.weightKg * item.quantity} kg)
                    </div>
                  </div>
                  <div className="font-bold text-[#121614]">
                    ₹{item.totalPrice.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#EFEBE1] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#58635B]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#121614]">₹{order.subtotalAmount}</span>
              </div>
              <div className="flex justify-between text-[#58635B]">
                <span>Shipping:</span>
                <span className="font-semibold text-[#121614]">
                  {order.shippingAmount === 0 ? "FREE" : `₹${order.shippingAmount}`}
                </span>
              </div>
              <div className="flex justify-between text-[#58635B]">
                <span>GST (5% Included):</span>
                <span>₹{order.taxAmount}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#EFEBE1] text-base font-extrabold text-[#121614] font-heading">
                <span>Total Amount:</span>
                <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4">
            <h3 className="text-sm font-bold font-heading text-[#121614] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#2E6B47]" />
              <span>Consignment Destination</span>
            </h3>
            <div className="text-xs text-[#58635B] space-y-1 leading-relaxed">
              <div className="font-bold text-[#121614]">{shippingAddr.fullName}</div>
              <div>{shippingAddr.phone}</div>
              <div>{shippingAddr.addressLine1}</div>
              {shippingAddr.addressLine2 && <div>{shippingAddr.addressLine2}</div>}
              {shippingAddr.landmark && <div>Landmark: {shippingAddr.landmark}</div>}
              <div className="font-semibold text-[#121614]">
                {shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}
              </div>
              {order.customerGstin && (
                <div className="pt-2 text-[11px] text-[#2E6B47] font-semibold">
                  Buyer GSTIN: {order.customerGstin}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#EFEBE1] text-xs text-[#58635B] space-y-1">
              <div><strong>Payment Mode:</strong> {order.paymentMethod}</div>
              <div><strong>Payment Status:</strong> {order.paymentStatus}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
