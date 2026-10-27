"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    totalWeightKg,
    itemCount,
    isFreeShipping,
    amountNeededForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E5E0D6]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E0D6] bg-white">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#121614] font-heading">
                Your Ecozza Cart
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#162E20] text-[#8DE0AD]">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#58635B] hover:text-[#121614] hover:bg-[#FAF8F5] rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#162E20] text-white px-6 py-3.5 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-[#8DE0AD] font-medium">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>You unlocked <strong>FREE Pan-India Delivery</strong>!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-1.5 font-medium">
                  <span>Add ₹{Math.round(amountNeededForFreeShipping)} more for FREE Delivery</span>
                  <span>₹{subtotal} / ₹{freeShippingThreshold}</span>
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#8DE0AD] h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-[#121614] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-[#58635B] mb-6">
                  Add Ecozza Green biochar soil conditioner granules to start enhancing soil structure.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#1E3A2B] text-white text-sm font-semibold hover:bg-[#2E6B47] transition-colors"
                >
                  Browse Granules
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white p-4 rounded-xl border border-[#E5E0D6] flex gap-4 relative"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#FAF8F5] relative shrink-0 border border-[#EFEBE1]">
                    {/* Fallback image */}
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-semibold text-[#121614] hover:text-[#2E6B47] line-clamp-1 transition-colors"
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-[#9E9584] hover:text-red-600 transition-colors ml-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-[#58635B] mt-0.5">
                      {item.variantTitle} ({item.weightKg} kg)
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#E5E0D6] rounded-lg bg-[#FAF8F5]">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="p-1 hover:bg-[#EFEBE1] rounded-l-lg text-[#121614] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#121614]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="p-1 hover:bg-[#EFEBE1] rounded-r-lg text-[#121614] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-[#121614]">
                          ₹{item.unitPrice * item.quantity}
                        </div>
                        <div className="text-[10px] text-[#58635B]">
                          ₹{Math.round(item.unitPrice / item.weightKg)}/kg
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E5E0D6] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#58635B]">
                  <span>Total Consignment Weight:</span>
                  <span className="font-semibold text-[#121614]">{totalWeightKg} kg</span>
                </div>
                <div className="flex justify-between text-[#58635B]">
                  <span>Subtotal (Inclusive of 5% GST):</span>
                  <span className="font-bold text-[#121614] text-base">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#58635B]">
                  <span>Pan-India Delivery:</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-[#2E6B47] font-semibold">FREE</span>
                    ) : (
                      "Calculated at checkout"
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#58635B] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFEBE1]">
                <ShieldCheck className="w-4 h-4 text-[#2E6B47] shrink-0" />
                <span>GST Tax Invoice with HSN 31059090 issued on all orders</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl border border-[#1E3A2B] text-[#1E3A2B] text-sm font-semibold hover:bg-[#E9F4EE] transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#1E3A2B] text-white text-sm font-semibold hover:bg-[#2E6B47] transition-all shadow-md hover:shadow-lg"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
