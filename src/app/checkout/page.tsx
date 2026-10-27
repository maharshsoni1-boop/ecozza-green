import React from "react";
import Link from "next/link";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { ShieldCheck, Truck, Lock } from "lucide-react";

export const metadata = {
  title: "Secure Checkout | Ecozza Green",
  description:
    "Complete your order of Ecozza Green granular biochar soil conditioner. Razorpay secure payments and Cash on Delivery with GST tax invoice.",
};

export default function CheckoutPage() {
  return (
    <div className="py-10 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb & Security strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D6]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#58635B] mb-1">
              <Link href="/" className="hover:text-[#121614]">Home</Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-[#121614]">Cart</Link>
              <span>/</span>
              <span className="font-semibold text-[#121614]">Checkout</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#121614] font-heading">
              Complete Your Soil Conditioner Order
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#58635B]">
            <span className="flex items-center gap-1.5 text-[#2E6B47] font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted</span>
            </span>
            <span>•</span>
            <span>Gujarat Facility Dispatch</span>
          </div>
        </div>

        {/* Client Checkout Component */}
        <CheckoutClient />
      </div>
    </div>
  );
}
