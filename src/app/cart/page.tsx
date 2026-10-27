"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { checkPincodeServiceability, PincodeCheckResult } from "@/app/actions/pincode";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Scale,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    totalWeightKg,
    itemCount,
    isFreeShipping,
    amountNeededForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const [pincode, setPincode] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<PincodeCheckResult | null>(null);

  // Estimate shipping fee: Free above threshold; otherwise weight tier estimate
  const estimatedShipping = isFreeShipping
    ? 0
    : totalWeightKg <= 5
    ? 99
    : totalWeightKg <= 10
    ? 149
    : 249;

  const estimatedGst = Math.round((subtotal * 5) / 105); // 5% GST included
  const grandTotal = subtotal + estimatedShipping;

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) return;
    setPincodeLoading(true);
    try {
      const res = await checkPincodeServiceability(pincode);
      setPincodeResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPincodeLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 bg-[#FAF8F5] min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-[#121614]">
            Your Shopping Cart is Empty
          </h1>
          <p className="text-sm text-[#58635B] leading-relaxed">
            Looks like you haven't added any granular soil conditioner to your cart yet. Explore our graded biochar packs to enhance your soil moisture retention.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-colors shadow-md"
            >
              <span>Explore Soil Conditioners</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D6]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#58635B] mb-1">
              <Link href="/" className="hover:text-[#121614]">Home</Link>
              <span>/</span>
              <span className="font-semibold text-[#121614]">Shopping Cart</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#121614] font-heading">
              Your Order Consignment ({itemCount} {itemCount === 1 ? "Item" : "Items"})
            </h1>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E6B47] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-[#162E20] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-[#8DE0AD] shrink-0" />
            {isFreeShipping ? (
              <span className="text-[#8DE0AD]">
                Congratulations! Your order qualifies for <strong>FREE Pan-India Courier Delivery</strong>!
              </span>
            ) : (
              <span>
                Add ₹{Math.round(amountNeededForFreeShipping)} more to get <strong>FREE Pan-India Delivery</strong>!
              </span>
            )}
          </div>
          <div className="w-full sm:w-48 bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#8DE0AD] h-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Main Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E0D6] overflow-hidden divide-y divide-[#EFEBE1]">
              {items.map((item) => (
                <div key={item.variantId} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#EFEBE1]">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-bold text-[#121614] hover:text-[#2E6B47] font-heading line-clamp-1 transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <div className="text-xs text-[#58635B]">
                      Format: <span className="font-semibold text-[#121614]">{item.variantTitle}</span> ({item.weightKg} kg bag)
                    </div>
                    <div className="text-[11px] text-[#58635B]">
                      Rate: ₹{Math.round(item.unitPrice / item.weightKg)}/kg • Incl. 5% GST
                    </div>
                  </div>

                  {/* Quantity & Unit Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-[#E5E0D6] rounded-xl bg-[#FAF8F5]">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-sm font-bold text-[#121614] hover:bg-[#EFEBE1] rounded-l-xl transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-[#121614]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-sm font-bold text-[#121614] hover:bg-[#EFEBE1] rounded-r-xl transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="text-base font-extrabold text-[#121614] font-heading">
                        ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-[#58635B]">
                        {item.weightKg * item.quantity} kg total
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-2 text-[#8C978F] hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-[#58635B] px-2">
              <button
                onClick={clearCart}
                className="hover:text-red-600 underline transition-colors"
              >
                Clear all items
              </button>
              <div className="flex items-center gap-1.5 text-[#121614] font-semibold">
                <Scale className="w-4 h-4 text-[#2E6B47]" />
                <span>Total Bagged Weight: {totalWeightKg} kg</span>
              </div>
            </div>
          </div>

          {/* Right: Summary & Checkout Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] space-y-5 shadow-xs">
              <h2 className="text-lg font-bold font-heading text-[#121614] pb-3 border-b border-[#EFEBE1]">
                Consignment Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#58635B]">
                  <span>Item Subtotal ({itemCount} units):</span>
                  <span className="font-semibold text-[#121614]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-[#58635B]">
                  <span>Total Weight:</span>
                  <span className="font-semibold text-[#121614]">{totalWeightKg} kg</span>
                </div>

                <div className="flex justify-between text-[#58635B]">
                  <span>Est. Pan-India Delivery:</span>
                  <span className="font-semibold text-[#121614]">
                    {isFreeShipping ? (
                      <span className="text-[#2E6B47]">FREE</span>
                    ) : (
                      `₹${estimatedShipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[#58635B] pt-2 border-t border-[#EFEBE1]">
                  <span>Included GST (5% Concessional):</span>
                  <span className="text-[#58635B]">₹{estimatedGst.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-[#EFEBE1] text-base font-extrabold text-[#121614] font-heading">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Pincode Check inside Cart */}
              <div className="pt-3 border-t border-[#EFEBE1] space-y-2">
                <div className="text-[11px] font-bold text-[#121614] uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#2E6B47]" />
                  <span>Delivery Pincode Estimate:</span>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit PIN"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#E5E0D6] text-xs bg-[#FAF8F5]"
                  />
                  <button
                    type="submit"
                    disabled={pincodeLoading || pincode.length !== 6}
                    className="px-3 py-1.5 rounded-lg bg-[#1E3A2B] text-white text-xs font-semibold disabled:opacity-50"
                  >
                    Check
                  </button>
                </form>
                {pincodeResult && (
                  <p className="text-[11px] text-[#2E6B47] font-medium">
                    {pincodeResult.message}
                  </p>
                )}
              </div>

              {/* Primary Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center pt-2">
                <div className="flex items-center justify-center gap-2 text-[11px] text-[#58635B]">
                  <ShieldCheck className="w-4 h-4 text-[#2E6B47]" />
                  <span>Secure 256-bit checkout • Razorpay & COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
