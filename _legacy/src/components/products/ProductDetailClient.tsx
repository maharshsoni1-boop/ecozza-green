"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { checkPincodeServiceability, PincodeCheckResult } from "@/app/actions/pincode";
import {
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  FileText,
  Calculator,
  QrCode,
  Sparkles,
  Layers,
  Scale,
  FlaskConical,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Star,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { COMPLIANCE_CONFIG } from "@/lib/compliance";

interface Variant {
  id: string;
  title: string;
  weightKg: number;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stockQuantity: number;
  isBulkQuoteOnly: boolean;
  isActive: boolean;
}

interface BatchReport {
  id: string;
  batchNumber: string;
  labName: string | null;
  labReportPdfUrl: string | null;
  carbonPercentage: number | null;
  phValue: number | null;
  moisturePercentage: number | null;
  granuleSizeMm: string | null;
  bulkDensity: number | null;
  heavyMetalsTested: boolean;
  heavyMetalsSummary: string | null;
  notes: string | null;
  isVerified: boolean;
}

interface ReviewItem {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  createdAt: Date;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    shortDescription: string;
    description: string;
    category: string;
    hsnCode: string;
    gstRatePercentage: number;
    scoopSizeGrams: number | null;
    dosePerPotGrams: number | null;
    dosePerTreeGrams: number | null;
    images: string;
    variants: Variant[];
    batchReports: BatchReport[];
    reviews: ReviewItem[];
  };
  relatedProducts: any[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const images: string[] = JSON.parse(product.images || "[]");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Pincode lookup state
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<PincodeCheckResult | null>(null);

  const activeImage = images[selectedImageIndex] || "/images/biochar-hero.jpg";
  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const pricePerKg = selectedVariant
    ? Math.round(selectedVariant.price / selectedVariant.weightKg)
    : 0;

  const latestBatch = product.batchReports[0] || null;

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.isBulkQuoteOnly) return;
    addItem(
      {
        id: selectedVariant.id,
        productId: product.id,
        variantId: selectedVariant.id,
        productName: product.name,
        variantTitle: selectedVariant.title,
        slug: product.slug,
        weightKg: selectedVariant.weightKg,
        unitPrice: selectedVariant.price,
        image: activeImage,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;
    setPincodeLoading(true);
    try {
      const res = await checkPincodeServiceability(pincodeInput);
      setPincodeResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPincodeLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Product Hero & Buy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
        {/* Left Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden bg-white border border-[#E5E0D6] shadow-xs">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="badge-carbon">{product.category}</span>
              <span className="badge-earth">Gujarat Made</span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    idx === selectedImageIndex
                      ? "border-[#2E6B47] shadow-sm scale-105"
                      : "border-[#E5E0D6] opacity-75 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Packaging & Scoop Guidelines Area */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E5E0D6] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121614] font-heading flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#2E6B47]" />
              <span>Standard Packaging & Dosing Guide</span>
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-[#EFEBE1]">
                <div className="text-[11px] text-[#58635B]">Standard Scoop</div>
                <div className="text-sm font-bold text-[#121614] mt-0.5">
                  {product.scoopSizeGrams || 50}g
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#EFEBE1]">
                <div className="text-[11px] text-[#58635B]">Per 12" Pot</div>
                <div className="text-sm font-bold text-[#121614] mt-0.5">
                  {product.dosePerPotGrams || 100}g
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#EFEBE1]">
                <div className="text-[11px] text-[#58635B]">Per Tree Pit</div>
                <div className="text-sm font-bold text-[#121614] mt-0.5">
                  {product.dosePerTreeGrams || 500}g
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EFEBE1] text-xs">
              <span className="text-[#58635B]">Need crop or acre calculation?</span>
              <Link
                href="/dose-calculator"
                className="font-bold text-[#2E6B47] hover:text-[#1E3A2B] inline-flex items-center gap-1"
              >
                <span>Open Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Details & Purchasing Options */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#2E6B47] uppercase tracking-wider">
                Ecozza Green Official
              </span>
              <span className="text-[#8C978F]">•</span>
              <span className="text-xs text-[#58635B]">HSN: {product.hsnCode}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121614] font-heading leading-tight">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-sm text-[#58635B] mt-2 leading-relaxed">
                {product.tagline}
              </p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#121614] font-heading">
                    ₹{selectedVariant.price.toLocaleString("en-IN")}
                  </span>
                  {selectedVariant.compareAtPrice && (
                    <span className="text-sm text-[#8C978F] line-through">
                      ₹{selectedVariant.compareAtPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#58635B] mt-1">
                  <span className="font-semibold text-[#121614]">₹{pricePerKg} / kg</span>
                  <span>•</span>
                  <span className="text-[#2E6B47] font-semibold">
                    Inclusive of {product.gstRatePercentage}% GST
                  </span>
                </div>
              </div>

              <div>
                {selectedVariant.isBulkQuoteOnly ? (
                  <span className="badge-earth">B2B Quote Only</span>
                ) : selectedVariant.stockQuantity > 0 ? (
                  <span className="text-xs font-semibold text-[#2E6B47] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#2E6B47]"></span>
                    In Stock (Gujarat Hub)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-600">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Bag / Variant Selector */}
            <div className="space-y-2 pt-2 border-t border-[#EFEBE1]">
              <label className="text-xs font-bold text-[#121614] uppercase tracking-wider block">
                Select Format & Bag Size:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      idx === selectedVariantIndex
                        ? "border-[#1E3A2B] bg-[#E9F4EE]/50 ring-1 ring-[#1E3A2B]"
                        : "border-[#E5E0D6] bg-white hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="text-xs font-bold text-[#121614]">{v.title}</div>
                    <div className="text-[11px] text-[#58635B] mt-0.5">
                      {v.isBulkQuoteOnly ? "Request Quote" : `₹${v.price} (₹${Math.round(v.price / v.weightKg)}/kg)`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {!selectedVariant.isBulkQuoteOnly ? (
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E5E0D6] rounded-xl bg-[#FAF8F5]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-sm font-bold text-[#121614] hover:bg-[#EFEBE1] rounded-l-xl transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-[#121614]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-sm font-bold text-[#121614] hover:bg-[#EFEBE1] rounded-r-xl transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs transition-all shadow-md ${
                      added
                        ? "bg-[#2E6B47] text-white"
                        : "bg-[#1E3A2B] hover:bg-[#2E6B47] text-white hover:shadow-lg"
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
                        <span>Add {quantity} Bag(s) to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  href={`/b2b-enquiry?product=${product.slug}&weight=${selectedVariant.weightKg}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#C06D38] hover:bg-[#A55724] text-white font-bold text-xs transition-colors shadow-md"
                >
                  <span>Request Bulk 1-Tonne Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Indian Pincode Serviceability Check */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#121614]">
              <Truck className="w-4 h-4 text-[#2E6B47]" />
              <span>Check Courier Delivery & COD for Your Pincode:</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit PIN (e.g. 380001)"
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#2E6B47] bg-[#FAF8F5]"
              />
              <button
                type="submit"
                disabled={pincodeLoading || pincodeInput.length !== 6}
                className="px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                {pincodeLoading ? "Checking..." : "Check"}
              </button>
            </form>

            {pincodeResult && (
              <div
                className={`p-3 rounded-xl text-xs space-y-1 ${
                  pincodeResult.isServiceable
                    ? "bg-[#E9F4EE] text-[#1E3A2B] border border-[#2E6B47]/20"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <div className="font-semibold">{pincodeResult.message}</div>
                {pincodeResult.isServiceable && (
                  <div className="text-[11px] text-[#2E6B47]">
                    Payment Mode: {pincodeResult.isCodAvailable ? "UPI, Cards & Cash on Delivery" : "Prepaid Courier Only (UPI/Cards)"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#58635B]">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E5E0D6]">
              <ShieldCheck className="w-4 h-4 text-[#2E6B47] shrink-0" />
              <span>GST Tax Invoice Included</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E5E0D6]">
              <MapPin className="w-4 h-4 text-[#2E6B47] shrink-0" />
              <span>Direct From Gujarat Facility</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specification Table & Batch Lab Report Transparency */}
      <section className="bg-white rounded-3xl border border-[#E5E0D6] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E6B47] uppercase tracking-wider mb-1">
              <FlaskConical className="w-4 h-4" />
              <span>Official Physical & Chemical Laboratory Data</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-[#121614]">
              Batch Quality & Lab Specifications
            </h2>
            <p className="text-xs text-[#58635B] mt-1">
              {latestBatch
                ? `Showing lab parameters for Batch #${latestBatch.batchNumber}`
                : COMPLIANCE_CONFIG.LAB_DATA_PENDING}
            </p>
          </div>

          {latestBatch && latestBatch.labReportPdfUrl && (
            <Link
              href="/lab-reports"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEBE1] border border-[#E5E0D6] text-xs font-semibold text-[#121614] transition-colors"
            >
              <FileText className="w-4 h-4 text-[#2E6B47]" />
              <span>Download Lab Report PDF</span>
            </Link>
          )}
        </div>

        {/* Lab Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEBE1]">
            <div className="text-[11px] text-[#58635B] font-medium">Organic Carbon %</div>
            <div className="text-lg font-bold text-[#121614] font-heading mt-1">
              {latestBatch?.carbonPercentage ? `${latestBatch.carbonPercentage}%` : "Awaiting lab data"}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEBE1]">
            <div className="text-[11px] text-[#58635B] font-medium">pH Level</div>
            <div className="text-lg font-bold text-[#121614] font-heading mt-1">
              {latestBatch?.phValue ? latestBatch.phValue : "Awaiting lab data"}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEBE1]">
            <div className="text-[11px] text-[#58635B] font-medium">Moisture Content</div>
            <div className="text-lg font-bold text-[#121614] font-heading mt-1">
              {latestBatch?.moisturePercentage ? `${latestBatch.moisturePercentage}%` : "Awaiting lab data"}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEBE1]">
            <div className="text-[11px] text-[#58635B] font-medium">Granule Size</div>
            <div className="text-lg font-bold text-[#121614] font-heading mt-1">
              {latestBatch?.granuleSizeMm ? latestBatch.granuleSizeMm : "Awaiting lab data"}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEBE1]">
            <div className="text-[11px] text-[#58635B] font-medium">Bulk Density</div>
            <div className="text-lg font-bold text-[#121614] font-heading mt-1">
              {latestBatch?.bulkDensity ? `${latestBatch.bulkDensity} g/cm³` : "Awaiting lab data"}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EFEBE1]">
            <div className="text-[11px] text-[#58635B] font-medium">Heavy Metals</div>
            <div className="text-xs font-bold text-[#2E6B47] mt-1 line-clamp-2">
              {latestBatch?.heavyMetalsSummary || "Awaiting lab data"}
            </div>
          </div>
        </div>

        {/* Compliance Note */}
        <div className="text-[11px] text-[#58635B] bg-[#FAF8F5] p-3 rounded-xl border border-[#EFEBE1]">
          *Notice: Batch test numbers are indicative of the current production lot from our Gujarat facility. Biochar is a non-fertilizer soil conditioner.
        </div>
      </section>

      {/* Description & Agronomy Guide */}
      <section className="bg-white rounded-3xl border border-[#E5E0D6] p-6 sm:p-10 space-y-6">
        <h3 className="text-xl font-bold font-heading text-[#121614]">
          Agronomic Function & How It Works in Soil
        </h3>
        <div className="prose prose-sm text-[#58635B] max-w-none space-y-3 leading-relaxed whitespace-pre-line">
          {product.description}
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="bg-white rounded-3xl border border-[#E5E0D6] p-6 sm:p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-[#121614]">
              Verified Buyer Reviews
            </h3>
            <p className="text-xs text-[#58635B] mt-1">
              Only authentic reviews from verified purchasers are published.
            </p>
          </div>
          <span className="badge-carbon">Verified Feedback</span>
        </div>

        {product.reviews.length === 0 ? (
          <div className="text-xs text-[#58635B] py-6 text-center">
            No published reviews yet for this batch. Verified purchasers can review after delivery.
          </div>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E5E0D6] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C06D38]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C06D38]" />
                    ))}
                    <span className="text-xs font-semibold text-[#121614] ml-2">
                      {rev.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#2E6B47] font-semibold bg-[#E9F4EE] px-2 py-0.5 rounded-full">
                    Verified Buyer
                  </span>
                </div>
                <p className="text-xs text-[#58635B] leading-relaxed">
                  "{rev.comment}"
                </p>
                <div className="text-[11px] text-[#8C978F]">
                  — {rev.reviewerName}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-heading text-[#121614]">
              Related Soil Conditioner Granules
            </h3>
            <Link href="/shop" className="text-xs font-bold text-[#1E3A2B] hover:text-[#2E6B47]">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-2xl border border-[#E5E0D6] flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#121614] font-heading">{p.name}</h4>
                  <p className="text-xs text-[#58635B] mt-1">{p.tagline}</p>
                </div>
                <Link
                  href={`/products/${p.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#2E6B47]"
                >
                  <span>View Formats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
