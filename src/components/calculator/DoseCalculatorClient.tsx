"use client";

import React, { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import {
  Calculator,
  ShoppingBag,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Check,
  Scale,
  Sprout,
  HelpCircle,
} from "lucide-react";
import { COMPLIANCE_CONFIG } from "@/lib/compliance";

interface DoseRule {
  id: string;
  plantCategory: string;
  cropName: string;
  unitType: string;
  soilType: string;
  recommendedDoseGrams: number;
  bagRecommendationText: string | null;
  notes: string | null;
}

interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  weightKg: number;
  price: number;
  sku: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string;
  };
}

export function DoseCalculatorClient({
  rules,
  availableVariants,
}: {
  rules: DoseRule[];
  availableVariants: ProductVariant[];
}) {
  const { addItem } = useCart();
  const [selectedCropName, setSelectedCropName] = useState(rules[0]?.cropName || "");
  const [selectedSoilType, setSelectedSoilType] = useState("Sandy Soil");
  const [unitCount, setUnitCount] = useState<number>(10);
  const [added, setAdded] = useState(false);

  // Group crops by category
  const categories = useMemo(() => {
    const map = new Map<string, string[]>();
    rules.forEach((r) => {
      if (!map.has(r.plantCategory)) {
        map.set(r.plantCategory, []);
      }
      const list = map.get(r.plantCategory)!;
      if (!list.includes(r.cropName)) {
        list.push(r.cropName);
      }
    });
    return Array.from(map.entries());
  }, [rules]);

  // Find matching active rule
  const currentRule = useMemo(() => {
    // 1. Exact match on crop and soil
    const exact = rules.find(
      (r) => r.cropName === selectedCropName && r.soilType === selectedSoilType
    );
    if (exact) return exact;

    // 2. Fallback to same crop with first available soil rule
    const cropMatch = rules.find((r) => r.cropName === selectedCropName);
    return cropMatch || rules[0];
  }, [rules, selectedCropName, selectedSoilType]);

  // Calculate required kilograms
  const totalKgNeeded = useMemo(() => {
    if (!currentRule || unitCount <= 0) return 0;
    const totalGrams = currentRule.recommendedDoseGrams * unitCount;
    return Math.round((totalGrams / 1000) * 10) / 10; // 1 decimal
  }, [currentRule, unitCount]);

  // Determine optimal combination of bags: 25kg, 10kg, 5kg
  const bagPlan = useMemo(() => {
    let remaining = totalKgNeeded;
    let bags25 = 0;
    let bags10 = 0;
    let bags5 = 0;

    if (remaining > 0) {
      bags25 = Math.floor(remaining / 25);
      remaining %= 25;

      bags10 = Math.floor(remaining / 10);
      remaining %= 10;

      bags5 = Math.ceil(remaining / 5);
    }

    // Find actual variants from DB
    const v25 = availableVariants.find((v) => v.weightKg === 25);
    const v10 = availableVariants.find((v) => v.weightKg === 10);
    const v5 = availableVariants.find((v) => v.weightKg === 5);

    const cost25 = (v25?.price || 1699) * bags25;
    const cost10 = (v10?.price || 799) * bags10;
    const cost5 = (v5?.price || 449) * bags5;

    return {
      bags25,
      bags10,
      bags5,
      variant25: v25,
      variant10: v10,
      variant5: v5,
      totalCost: cost25 + cost10 + cost5,
    };
  }, [totalKgNeeded, availableVariants]);

  const handleAddAllToCart = () => {
    if (bagPlan.bags25 > 0 && bagPlan.variant25) {
      const img = JSON.parse(bagPlan.variant25.product.images || "[]")[0] || "/images/biochar-hero.jpg";
      addItem(
        {
          id: bagPlan.variant25.id,
          productId: bagPlan.variant25.product.id,
          variantId: bagPlan.variant25.id,
          productName: bagPlan.variant25.product.name,
          variantTitle: bagPlan.variant25.title,
          slug: bagPlan.variant25.product.slug,
          weightKg: bagPlan.variant25.weightKg,
          unitPrice: bagPlan.variant25.price,
          image: img,
        },
        bagPlan.bags25
      );
    }

    if (bagPlan.bags10 > 0 && bagPlan.variant10) {
      const img = JSON.parse(bagPlan.variant10.product.images || "[]")[0] || "/images/biochar-hero.jpg";
      addItem(
        {
          id: bagPlan.variant10.id,
          productId: bagPlan.variant10.product.id,
          variantId: bagPlan.variant10.id,
          productName: bagPlan.variant10.product.name,
          variantTitle: bagPlan.variant10.title,
          slug: bagPlan.variant10.product.slug,
          weightKg: bagPlan.variant10.weightKg,
          unitPrice: bagPlan.variant10.price,
          image: img,
        },
        bagPlan.bags10
      );
    }

    if (bagPlan.bags5 > 0 && bagPlan.variant5) {
      const img = JSON.parse(bagPlan.variant5.product.images || "[]")[0] || "/images/biochar-hero.jpg";
      addItem(
        {
          id: bagPlan.variant5.id,
          productId: bagPlan.variant5.product.id,
          variantId: bagPlan.variant5.id,
          productName: bagPlan.variant5.product.name,
          variantTitle: bagPlan.variant5.title,
          slug: bagPlan.variant5.product.slug,
          weightKg: bagPlan.variant5.weightKg,
          unitPrice: bagPlan.variant5.price,
          image: img,
        },
        bagPlan.bags5
      );
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const unitLabel =
    currentRule?.unitType === "POT"
      ? "Pots / Containers"
      : currentRule?.unitType === "TREE"
      ? "Fruit Trees / Saplings"
      : currentRule?.unitType === "ACRE"
      ? "Acres of Field"
      : "Units";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Mandatory Statutory Notice */}
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D6] flex items-start gap-3 text-xs text-[#58635B]">
        <ShieldAlert className="w-5 h-5 text-[#C06D38] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#121614] block mb-0.5">Agronomic Dosing Disclaimer:</strong>
          {COMPLIANCE_CONFIG.DOSE_DISCLAIMER} Soil conditioner does not substitute chemical or organic fertilizer inputs.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Inputs */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0D6] space-y-6 shadow-sm">
          <h2 className="text-lg font-bold font-heading text-[#121614] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#2E6B47]" />
            <span>Select Your Planting & Soil Parameters</span>
          </h2>

          {/* 1. Crop / Plant Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#121614]">
              1. Crop or Garden Application:
            </label>
            <select
              value={selectedCropName}
              onChange={(e) => setSelectedCropName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D6] text-xs font-semibold text-[#121614] bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
            >
              {categories.map(([category, crops]) => (
                <optgroup key={category} label={category}>
                  {crops.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 2. Soil Texture */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#121614]">
              2. Your Soil Texture / Type:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Sandy Soil", "Clayey / Heavy Soil", "Loamy Soil", "Degraded / Low Carbon"].map(
                (soil) => (
                  <button
                    key={soil}
                    type="button"
                    onClick={() => setSelectedSoilType(soil)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                      selectedSoilType === soil
                        ? "border-[#1E3A2B] bg-[#E9F4EE] text-[#1E3A2B] ring-1 ring-[#1E3A2B]"
                        : "border-[#E5E0D6] bg-[#FAF8F5] text-[#58635B] hover:bg-[#EFEBE1]"
                    }`}
                  >
                    {soil}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 3. Number of units */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-[#121614]">
                3. Number of {unitLabel}:
              </label>
              <span className="font-extrabold text-[#2E6B47] text-sm">
                {unitCount} {unitLabel}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={currentRule?.unitType === "ACRE" ? 50 : 200}
                value={unitCount}
                onChange={(e) => setUnitCount(parseInt(e.target.value, 10))}
                className="flex-1 accent-[#2E6B47]"
              />
              <input
                type="number"
                min={1}
                value={unitCount}
                onChange={(e) => setUnitCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-3 py-2 rounded-xl border border-[#E5E0D6] text-xs font-bold text-center bg-[#FAF8F5]"
              />
            </div>
          </div>

          {/* Agronomic Application Tip */}
          {currentRule?.bagRecommendationText && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE1] space-y-1 text-xs">
              <div className="font-bold text-[#121614] flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[#2E6B47]" />
                <span>Recommended Application Method:</span>
              </div>
              <p className="text-[#58635B] leading-relaxed">
                {currentRule.bagRecommendationText}
              </p>
              <div className="text-[11px] text-[#8C978F] italic pt-1">
                Base dose: {currentRule.recommendedDoseGrams >= 1000 ? `${currentRule.recommendedDoseGrams / 1000} kg` : `${currentRule.recommendedDoseGrams} grams`} per unit.
              </div>
            </div>
          )}
        </div>

        {/* Right Recommended Output & Cart Pack */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121614] text-white p-6 sm:p-8 rounded-3xl border border-[#28302C] shadow-xl space-y-6">
            <span className="badge-carbon">Recommended Consignment</span>

            <div className="space-y-1">
              <div className="text-xs text-[#A8B2AC] uppercase tracking-wider font-semibold">
                Total Granules Required
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#8DE0AD] font-heading">
                {totalKgNeeded} kg
              </div>
              <div className="text-xs text-[#C4BCAC]">
                Calibrated for {unitCount} {unitLabel.toLowerCase()} in {selectedSoilType}
              </div>
            </div>

            {/* Bag Breakdown */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Recommended Pack Configuration:
              </div>

              <div className="space-y-2">
                {bagPlan.bags25 > 0 && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">25 kg Bag(s)</div>
                      <div className="text-[11px] text-[#A8B2AC]">₹{bagPlan.variant25?.price || 1699} per bag</div>
                    </div>
                    <span className="text-base font-extrabold text-[#8DE0AD]">× {bagPlan.bags25}</span>
                  </div>
                )}

                {bagPlan.bags10 > 0 && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">10 kg Bag(s)</div>
                      <div className="text-[11px] text-[#A8B2AC]">₹{bagPlan.variant10?.price || 799} per bag</div>
                    </div>
                    <span className="text-base font-extrabold text-[#8DE0AD]">× {bagPlan.bags10}</span>
                  </div>
                )}

                {bagPlan.bags5 > 0 && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">5 kg Bag(s)</div>
                      <div className="text-[11px] text-[#A8B2AC]">₹{bagPlan.variant5?.price || 449} per bag</div>
                    </div>
                    <span className="text-base font-extrabold text-[#8DE0AD]">× {bagPlan.bags5}</span>
                  </div>
                )}
              </div>

              {/* Total Estimated Cost */}
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-xs text-[#C4BCAC]">Estimated Cost (Incl. 5% GST):</span>
                <span className="text-2xl font-extrabold text-white font-heading">
                  ₹{bagPlan.totalCost.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Direct Add to Cart Action */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddAllToCart}
                disabled={totalKgNeeded <= 0}
                className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs transition-all shadow-lg ${
                  added
                    ? "bg-[#2E6B47] text-white"
                    : "bg-[#2E6B47] hover:bg-[#388E5A] text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added Recommended Bags to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add All Recommended Bags to Cart</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-[#A8B2AC]">
                Eligible for <strong>FREE Pan-India Courier Delivery</strong> on orders over ₹1499.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
