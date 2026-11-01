"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight, ShieldCheck, Check } from "lucide-react";

interface Variant {
  id: string;
  title: string;
  weightKg: number;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stockQuantity: number;
  isBulkQuoteOnly: boolean;
}

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    shortDescription: string;
    category: string;
    images: string;
    variants: Variant[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const images: string[] = JSON.parse(product.images || "[]");
  const mainImage = images[0] || "/images/biochar-hero.jpg";

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const pricePerKg = selectedVariant
    ? Math.round(selectedVariant.price / selectedVariant.weightKg)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariant || selectedVariant.isBulkQuoteOnly) return;

    addItem({
      id: selectedVariant.id,
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      variantTitle: selectedVariant.title,
      slug: product.slug,
      weightKg: selectedVariant.weightKg,
      unitPrice: selectedVariant.price,
      image: mainImage,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E0D6] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Product Image Box */}
      <Link
        href={`/products/${product.slug}`}
        className="relative h-56 bg-[#FAF8F5] overflow-hidden block"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="badge-carbon">
            {product.category}
          </span>
          <span className="badge-earth">
            Made in Gujarat
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-base font-bold text-[#121614] hover:text-[#2E6B47] transition-colors font-heading line-clamp-1">
              {product.name}
            </h3>
          </Link>
          {product.tagline && (
            <p className="text-xs text-[#58635B] mt-1 line-clamp-2">
              {product.tagline}
            </p>
          )}

          {/* Pack Size Selectors */}
          <div className="mt-4">
            <span className="text-[11px] font-semibold text-[#58635B] uppercase tracking-wider block mb-1.5">
              Select Pack Size:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                    idx === selectedVariantIndex
                      ? "bg-[#1E3A2B] text-white shadow-xs"
                      : "bg-[#FAF8F5] text-[#121614] hover:bg-[#EFEBE1] border border-[#E5E0D6]"
                  }`}
                >
                  {v.weightKg >= 1000 ? "1 Tonne Bulk" : `${v.weightKg} kg`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-[#EFEBE1]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#121614] font-heading">
                  ₹{selectedVariant.price.toLocaleString("en-IN")}
                </span>
                {selectedVariant.compareAtPrice && (
                  <span className="text-xs text-[#8C978F] line-through">
                    ₹{selectedVariant.compareAtPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#58635B] mt-0.5">
                <span>₹{pricePerKg}/kg</span>
                <span>•</span>
                <span className="text-[#2E6B47] font-semibold">Incl. 5% GST</span>
              </div>
            </div>

            <div className="text-right">
              {selectedVariant.isBulkQuoteOnly ? (
                <span className="text-[11px] font-bold text-[#C06D38] bg-[#FBF0E6] px-2 py-0.5 rounded-md">
                  Enquiry Only
                </span>
              ) : selectedVariant.stockQuantity > 10 ? (
                <span className="text-[11px] text-[#2E6B47] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B47]"></span>
                  In Stock
                </span>
              ) : (
                <span className="text-[11px] text-amber-600 font-medium">
                  Few bags left
                </span>
              )}
            </div>
          </div>

          {selectedVariant.isBulkQuoteOnly ? (
            <Link
              href="/b2b-enquiry"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C06D38] hover:bg-[#A55724] text-white text-xs font-bold transition-colors shadow-sm"
            >
              <span>Request B2B Bulk Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                added
                  ? "bg-[#2E6B47] text-white"
                  : "bg-[#1E3A2B] hover:bg-[#2E6B47] text-white"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart ({selectedVariant.title})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
