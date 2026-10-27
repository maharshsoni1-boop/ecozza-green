import React from "react";
import Link from "next/link";
import { Leaf, MapPin, ShieldCheck, Factory, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Ecozza Green | Gujarat Biochar Facility",
  description:
    "Ecozza Green is a leading manufacturer of premium granular biochar soil conditioners based in Gujarat, India. Engineered for soil water resilience and permanent carbon.",
};

export default function AboutPage() {
  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Our Origins & Purpose</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading">
            About Ecozza Green
          </h1>
          <p className="text-xs sm:text-sm text-[#58635B] leading-relaxed">
            Restoring structural health, water retention, and biological permanence to Indian soils through engineered woody biochar granules.
          </p>
        </div>

        {/* Brand Mission Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E0D6] shadow-sm space-y-6">
          <h2 className="text-2xl font-bold font-heading text-[#121614]">
            Engineering Carbon-Rich Soil in Gujarat
          </h2>
          <div className="text-xs text-[#58635B] space-y-4 leading-relaxed">
            <p>
              Ecozza Green was established with a singular agronomic focus: to combat the declining Soil Organic Carbon (SOC) levels in Indian agricultural and horticultural soils. In states like Gujarat, Rajasthan, Maharashtra, and across semi-arid belts, intense summer heat oxidizes raw organic compost within months, leaving soils compacted and water-deficient.
            </p>
            <p>
              To solve this, Ecozza Green utilizes high-temperature, oxygen-depleted thermal carbonization to transform woody biomass into highly stable, microscopic honeycomb carbon granules. These granules do not wash away, blow in the wind, or rapidly decay—they stay in the soil, acting as a permanent physical sponge for water and nutrients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EFEBE1]">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE1] space-y-1">
              <span className="font-bold text-[#121614] text-xs block">100% Clean Woodchar</span>
              <p className="text-[11px] text-[#58635B]">
                We only pyrolyze clean forestry and woody biomass. Never contaminated municipal waste or sewage sludge.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE1] space-y-1">
              <span className="font-bold text-[#121614] text-xs block">Gujarat Production Hub</span>
              <p className="text-[11px] text-[#58635B]">
                Our modern processing and grading facility in Gujarat ensures consistent 2-5mm granule sizing and minimal fines.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE1] space-y-1">
              <span className="font-bold text-[#121614] text-xs block">Complete Batch Traceability</span>
              <p className="text-[11px] text-[#58635B]">
                Every bag carries a batch number traceable to certified laboratory tests (carbon %, pH, and heavy-metal tests).
              </p>
            </div>
          </div>
        </div>

        {/* Facility & Team */}
        <div className="bg-[#121614] text-white p-8 sm:p-12 rounded-3xl border border-[#28302C] space-y-6">
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-[#8DE0AD]" />
            <h3 className="text-xl font-bold font-heading text-white">
              Manufacturing & Dispatch Facility
            </h3>
          </div>
          <p className="text-xs text-[#C4BCAC] leading-relaxed max-w-2xl">
            Our state-of-the-art grading facility is situated within Gujarat's premier industrial and agricultural logistics corridor. With direct access to national highway networks, we deliver single 5kg bags to home gardeners and 1-tonne jumbo bags to commercial nurseries pan-India.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Contact & Facility Details</span>
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
