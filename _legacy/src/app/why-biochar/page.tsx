import React from "react";
import Link from "next/link";
import {
  Droplets,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Clock,
  FlaskConical,
  Trees,
  CheckCircle2,
  Calculator,
  Sprout,
} from "lucide-react";
import { COMPLIANCE_CONFIG } from "@/lib/compliance";

export const metadata = {
  title: "Why Biochar? The Science of Porous Soil Carbon | Ecozza Green",
  description:
    "Learn how granular biochar improves soil water retention, cation exchange capacity, and microbial habitat. A physical soil conditioner, not a fertilizer.",
};

export default function WhyBiocharPage() {
  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <FlaskConical className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Soil Physics & Agronomy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading">
            Why Biochar? The Science of Porous Carbon
          </h1>
          <p className="text-xs sm:text-sm text-[#58635B] leading-relaxed">
            Understanding how thermal carbonization creates permanent microscopic pores that transform water and nutrient retention in Indian soils.
          </p>
        </div>

        {/* Statutory Regulatory Banner */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E0D6] flex items-start gap-3 text-xs text-[#58635B] shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-[#C06D38] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#121614] block mb-0.5">Classification & Claims Statement:</strong>
            {COMPLIANCE_CONFIG.GENERAL_DISCLAIMER}
          </div>
        </div>

        {/* Scientific Principles */}
        <div className="space-y-8">
          {/* Principle 1 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D6] shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47]">
              <Droplets className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#121614]">
              1. The Microscopic Honeycomb: Water Holding Capacity
            </h2>
            <p className="text-xs text-[#58635B] leading-relaxed">
              When clean woody biomass is heated in oxygen-depleted pyrolytic kilns at our Gujarat facility, volatile resins vaporize. What remains is a pure carbon skeleton perforated by millions of interconnected micro-pores (ranging from 10 nanometers to 50 micrometers).
            </p>
            <p className="text-xs text-[#58635B] leading-relaxed">
              These pores generate strong capillary force. When you irrigate or when it rains, water is drawn into the internal matrix and held tightly against gravitational drainage—giving root hairs a steady reservoir between watering cycles.
            </p>
          </div>

          {/* Principle 2 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D6] shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FBF0E6] flex items-center justify-center text-[#C06D38]">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#121614]">
              2. Cation Exchange Capacity (CEC): The Nutrient Sponge
            </h2>
            <p className="text-xs text-[#58635B] leading-relaxed">
              In sandy or degraded soils, dissolved minerals and liquid compost teas frequently wash straight down below the root zone (leaching). Biochar carbon surfaces carry negative electrostatic charges that attract and loosely bind positively charged nutrient ions (calcium, potassium, magnesium, ammonium).
            </p>
            <p className="text-xs text-[#58635B] leading-relaxed">
              Because these bonds are gentle, plant roots can exchange hydrogen ions to absorb nutrients on demand, substantially increasing the efficiency of your applied manures or fertilizers.
            </p>
          </div>

          {/* Principle 3 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D6] shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#E9F4EE] flex items-center justify-center text-[#1E3A2B]">
              <Sprout className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#121614]">
              3. Microbial Refuge & Aeration
            </h2>
            <p className="text-xs text-[#58635B] leading-relaxed">
              Heavy clay soils in India easily compact under hot sun, suffocating beneficial soil biology. Granular biochar particles (2mm to 5mm) act as rigid structural spacers, keeping soil loose and oxygenated.
            </p>
            <p className="text-xs text-[#58635B] leading-relaxed">
              The internal cavities provide sheltered habitat for mycorrhizal fungi and beneficial bacteria, shielding them from predatory protozoa and harsh surface heat.
            </p>
          </div>

          {/* Principle 4 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E0D6] shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#121614] border border-[#EFEBE1]">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#121614]">
              4. Recalcitrant Carbon: Why Biochar Does Not Decompose Like Raw Compost
            </h2>
            <p className="text-xs text-[#58635B] leading-relaxed">
              Raw organic matter such as cow dung, vermicompost, and leaves oxidize and decompose within 6 to 12 months under tropical temperatures, requiring constant reapplication. Biochar undergoes aromatic ring crystallization during pyrolysis, making it biochemically resistant to rapid decomposition.
            </p>
            <p className="text-xs text-[#58635B] leading-relaxed">
              Once added to your orchard basins, garden beds, or farm plots, biochar remains structurally active in the soil for decades.
            </p>
          </div>
        </div>

        {/* CTA Callout */}
        <div className="bg-[#121614] text-white p-8 sm:p-10 rounded-3xl border border-[#28302C] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="badge-carbon">Ready to Condition Your Soil?</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Calculate the Exact Starting Dose for Your Soil
            </h3>
            <p className="text-xs text-[#C4BCAC]">
              Select your crop, container size, or field acreage and get instant bag recommendations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dose-calculator"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Launch Calculator</span>
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-colors"
            >
              <span>Shop Granules</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
