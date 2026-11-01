import React from "react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/invoice/PrintButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface InvoicePageProps {
  params: Promise<{ orderId: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (!order) {
    notFound();
  }

  const shippingAddr = JSON.parse(order.shippingAddress as string);
  const isIntraState = (shippingAddr.state || "").toLowerCase() === "gujarat";

  const totalWeight = order.orderItems.reduce((acc, i) => acc + i.weightKg * i.quantity, 0);

  // Tax breakdown
  const totalAmount = order.totalAmount;
  const taxableAmount = Math.round((order.subtotalAmount / 1.05) * 100) / 100;
  const gstAmount = Math.round((order.subtotalAmount - taxableAmount) * 100) / 100;

  const cgstAmount = isIntraState ? (gstAmount / 2).toFixed(2) : "0.00";
  const sgstAmount = isIntraState ? (gstAmount / 2).toFixed(2) : "0.00";
  const igstAmount = !isIntraState ? gstAmount.toFixed(2) : "0.00";

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        {/* Navigation & Print Actions */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href={`/order-confirmation/${order.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58635B] hover:text-[#121614]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Order Confirmation</span>
          </Link>
          <PrintButton />
        </div>

        {/* The Printable Invoice Sheet */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E0D6] shadow-sm print:shadow-none print:border-none print:p-0 print:rounded-none space-y-8 text-[#121614]">
          {/* Top Header */}
          <div className="flex justify-between items-start pb-6 border-b border-[#121614]">
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-20 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Ecozza Green"
                  width={140}
                  height={99}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </div>
              <div>
                <span className="text-2xl font-extrabold font-heading text-[#121614] tracking-tight">
                  Ecozza Green
                </span>
                <p className="text-xs text-[#58635B] mt-0.5 font-medium">
                  Granular Biochar Soil Conditioners
                </p>
                <div className="text-xs text-[#58635B] mt-2 space-y-0.5">
                  <div>Ecozza Green Facility, GIDC Industrial Estate</div>
                  <div>Gujarat - 382445, India</div>
                  <div><strong>GSTIN:</strong> 24AAAAE0000A1Z5 (State Code: 24 - Gujarat)</div>
                  <div><strong>Email:</strong> care@ecozzagreen.in</div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-bold uppercase tracking-wider text-[#121614]">
                Tax Invoice
              </span>
              <div className="text-xs text-[#58635B] mt-2 space-y-1">
                <div><strong>Invoice No:</strong> {order.invoiceNumber}</div>
                <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString("en-IN")}</div>
                <div><strong>Order No:</strong> {order.orderNumber}</div>
                <div><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</div>
              </div>
            </div>
          </div>

          {/* Billed To & Shipped To */}
          <div className="grid grid-cols-2 gap-8 text-xs pb-6 border-b border-[#EFEBE1]">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-[#58635B] mb-1.5">
                Billed / Shipped To:
              </h4>
              <div className="font-bold text-sm text-[#121614]">{shippingAddr.fullName}</div>
              {order.customerGstin && (
                <div className="text-[#2E6B47] font-semibold mt-0.5">
                  Buyer GSTIN: {order.customerGstin}
                </div>
              )}
              <div className="text-[#58635B] mt-1 space-y-0.5">
                <div>{shippingAddr.addressLine1}</div>
                {shippingAddr.addressLine2 && <div>{shippingAddr.addressLine2}</div>}
                <div>{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postalCode}</div>
                <div>Phone: {shippingAddr.phone}</div>
              </div>
            </div>

            <div className="text-right space-y-1 text-xs text-[#58635B]">
              <div><strong>Place of Supply:</strong> {shippingAddr.state}</div>
              <div><strong>Carrier:</strong> {order.carrierName || "Shiprocket"}</div>
              {order.trackingNumber && <div><strong>AWB Tracking:</strong> {order.trackingNumber}</div>}
              <div><strong>Total Weight:</strong> {totalWeight} kg</div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#121614] text-left">
                <th className="py-2 font-bold uppercase">Item Description</th>
                <th className="py-2 font-bold uppercase">HSN Code</th>
                <th className="py-2 font-bold uppercase text-center">Weight</th>
                <th className="py-2 font-bold uppercase text-center">Qty</th>
                <th className="py-2 font-bold uppercase text-right">Rate</th>
                <th className="py-2 font-bold uppercase text-right">Taxable</th>
                <th className="py-2 font-bold uppercase text-right">GST Rate</th>
                <th className="py-2 font-bold uppercase text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE1]">
              {order.orderItems.map((item) => {
                const itemTaxable = Math.round((item.totalPrice / 1.05) * 100) / 100;
                return (
                  <tr key={item.id}>
                    <td className="py-3">
                      <div className="font-bold text-[#121614]">{item.productName}</div>
                      <div className="text-[11px] text-[#58635B]">{item.variantTitle}</div>
                    </td>
                    <td className="py-3">31059090</td>
                    <td className="py-3 text-center">{item.weightKg} kg</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">₹{item.unitPrice}</td>
                    <td className="py-3 text-right">₹{itemTaxable}</td>
                    <td className="py-3 text-right">5%</td>
                    <td className="py-3 text-right font-bold">₹{item.totalPrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Tax Calculation Matrix */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#121614]">
            <div className="space-y-2 text-xs text-[#58635B]">
              <div className="font-bold text-[#121614]">Statutory Declaration:</div>
              <p className="leading-relaxed text-[11px]">
                Certified that the particulars given above are true and correct. Granular Biochar Soil Conditioner classified under HSN 31059090 with 5% concessional GST rate. Non-fertilizer soil amendment.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-[#58635B]">
                <span>Total Taxable Value:</span>
                <span className="font-medium text-[#121614]">₹{taxableAmount}</span>
              </div>
              {isIntraState ? (
                <>
                  <div className="flex justify-between text-[#58635B]">
                    <span>CGST (2.5%):</span>
                    <span className="font-medium text-[#121614]">₹{cgstAmount}</span>
                  </div>
                  <div className="flex justify-between text-[#58635B]">
                    <span>SGST (2.5%):</span>
                    <span className="font-medium text-[#121614]">₹{sgstAmount}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-[#58635B]">
                  <span>IGST (5.0% Inter-state):</span>
                  <span className="font-medium text-[#121614]">₹{igstAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#58635B]">
                <span>Shipping & Freight:</span>
                <span className="font-medium text-[#121614]">
                  {order.shippingAmount === 0 ? "FREE" : `₹${order.shippingAmount}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#121614] text-base font-extrabold text-[#121614] font-heading">
                <span>Total Invoice Amount:</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Signoff */}
          <div className="pt-8 flex justify-between items-end text-xs text-[#58635B]">
            <div>
              Thank you for trusting Ecozza Green for your soil health.
            </div>
            <div className="text-right">
              <div className="font-bold text-[#121614]">For Ecozza Green</div>
              <div className="text-[10px] mt-6">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
