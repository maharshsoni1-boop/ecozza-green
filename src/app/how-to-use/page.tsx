import React from "react";
import Link from "next/link";
import {
  Sprout,
  Droplets,
  Layers,
  Trees,
  Calculator,
  ArrowRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { COMPLIANCE_CONFIG } from "@/lib/compliance";

export const metadata = {
  title: "How to Apply Biochar Soil Conditioner | Ecozza Green",
  description:
    "Complete agronomic manual for applying Ecozza Green granular biochar in nursery media, tree planting pits, field bands, and drip trenches.",
};

export default function HowToUsePage() {
  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Field Application Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading">
            How to Apply Ecozza Green Granules
          </h1>
          <p className="text-xs sm:text-sm text-[#58635B] leading-relaxed">
            Biochar performs best when incorporated into the active root zone alongside water and compost. Never leave dry granules exposed on bare topsoil.
          </p>
        </div>

        {/* Disclaimer Notice */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E0D6] flex items-start gap-3 text-xs text-[#58635B] shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-[#C06D38] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#121614]">Agronomic Rule: </strong>
            {COMPLIANCE_CONFIG.GENERAL_DISCLAIMER}
          </div>
        </div>

        {/* 5 Main Methods with SVG Diagrams */}
        <div className="space-y-10">
          {/* Method 1: Nursery Mix */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5E0D6] shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="badge-carbon">Method 01</span>
              <h2 className="text-2xl font-bold font-heading text-[#121614]">
                Nursery Seedling Mix & Propagation Media
              </h2>
              <p className="text-xs text-[#58635B] leading-relaxed">
                For seedling trays, polybags, and vegetative propagation plugs. Calibrated 2-4mm granules prevent media compaction and reduce damping-off vulnerability.
              </p>
              <div className="space-y-1.5 text-xs text-[#121614] font-medium pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" />
                  <span><strong>Ratio:</strong> Blend 5% to 8% by volume into cocopeat or nursery soil.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" />
                  <span><strong>Inoculation:</strong> Moisten mix with organic compost tea or microbial wash before seeding.</span>
                </div>
              </div>
            </div>

            {/* Inline Technical SVG Diagram 1 */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 rounded-2xl border border-[#EFEBE1] flex items-center justify-center">
              <svg viewBox="0 0 280 180" className="w-full max-w-xs h-auto">
                <rect x="20" y="30" width="240" height="120" rx="8" fill="#FFFFFF" stroke="#C4BCAC" strokeWidth="2" />
                {/* Cocopeat / Media layer */}
                <rect x="30" y="45" width="220" height="90" rx="4" fill="#EFEBE1" />
                {/* Biochar Granule Specks */}
                <circle cx="50" cy="65" r="4" fill="#1E3A2B" />
                <circle cx="80" cy="80" r="5" fill="#121614" />
                <circle cx="120" cy="60" r="4.5" fill="#2E6B47" />
                <circle cx="160" cy="90" r="5" fill="#121614" />
                <circle cx="200" cy="70" r="4" fill="#1E3A2B" />
                <circle cx="220" cy="100" r="5" fill="#121614" />
                <circle cx="95" cy="110" r="4.5" fill="#2E6B47" />
                <circle cx="140" cy="120" r="4" fill="#1E3A2B" />
                {/* Sprout Plant */}
                <path d="M140 60 Q140 30 140 20" stroke="#2E6B47" strokeWidth="3" fill="none" />
                <path d="M140 20 Q125 15 125 25 Q135 25 140 20" fill="#2E6B47" />
                <path d="M140 20 Q155 15 155 25 Q145 25 140 20" fill="#2E6B47" />
                <text x="140" y="160" textAnchor="middle" fill="#58635B" fontSize="10" fontWeight="bold">
                  Nursery Media (5-8% Biochar Granules)
                </text>
              </svg>
            </div>
          </div>

          {/* Method 2: Planting Pit */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5E0D6] shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="badge-carbon">Method 02</span>
              <h2 className="text-2xl font-bold font-heading text-[#121614]">
                New Planting Pits for Fruit Saplings
              </h2>
              <p className="text-xs text-[#58635B] leading-relaxed">
                Ideal when setting new mango, pomegranate, guava, lime, or forestry saplings. Permanent biochar carbon prevents root ball drought shock.
              </p>
              <div className="space-y-1.5 text-xs text-[#121614] font-medium pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" />
                  <span><strong>Dose:</strong> 500g to 1 kg per 2×2 ft pit.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" />
                  <span><strong>Method:</strong> Blend granules with topsoil and seasoned compost at the lower two-thirds of the pit.</span>
                </div>
              </div>
            </div>

            {/* Inline Technical SVG Diagram 2 */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 rounded-2xl border border-[#EFEBE1] flex items-center justify-center">
              <svg viewBox="0 0 280 180" className="w-full max-w-xs h-auto">
                {/* Pit Excavation Outline */}
                <path d="M50 40 L50 140 Q50 150 60 150 L220 150 Q230 150 230 140 L230 40" fill="#FAF8F5" stroke="#C06D38" strokeWidth="2" strokeDasharray="4 2" />
                {/* Pit Fill Blend */}
                <path d="M55 70 L55 140 Q55 145 60 145 L220 145 Q225 145 225 140 L225 70 Z" fill="#EFEBE1" />
                {/* Granules in pit */}
                <circle cx="75" cy="110" r="5" fill="#121614" />
                <circle cx="110" cy="130" r="5.5" fill="#1E3A2B" />
                <circle cx="150" cy="120" r="4.5" fill="#2E6B47" />
                <circle cx="180" cy="135" r="5" fill="#121614" />
                <circle cx="205" cy="115" r="4" fill="#1E3A2B" />
                {/* Sapling trunk and roots */}
                <path d="M140 10 L140 85" stroke="#7A5636" strokeWidth="4" />
                <path d="M140 85 Q115 110 95 125" stroke="#C4BCAC" strokeWidth="2" fill="none" />
                <path d="M140 85 Q150 115 170 130" stroke="#C4BCAC" strokeWidth="2" fill="none" />
                <path d="M140 85 Q135 120 130 140" stroke="#C4BCAC" strokeWidth="2" fill="none" />
                <text x="140" y="170" textAnchor="middle" fill="#58635B" fontSize="10" fontWeight="bold">
                  Tree Basin Pit Blend (500g - 1kg)
                </text>
              </svg>
            </div>
          </div>

          {/* Method 3: Field Band Application */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5E0D6] shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="badge-carbon">Method 03</span>
              <h2 className="text-2xl font-bold font-heading text-[#121614]">
                Field Band Application (Commercial Acreage)
              </h2>
              <p className="text-xs text-[#58635B] leading-relaxed">
                For commercial vegetable rows (tomato, chilli, brinjal, onion) and raised bed farming. Concentrating granules directly along crop rows maximizes water retention where roots feed.
              </p>
              <div className="space-y-1.5 text-xs text-[#121614] font-medium pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" />
                  <span><strong>Rate:</strong> 400 kg to 600 kg per acre in furrows or planting bands.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" />
                  <span><strong>Timing:</strong> Pre-sowing or bed preparation before mulch laying.</span>
                </div>
              </div>
            </div>

            {/* Inline Technical SVG Diagram 3 */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 rounded-2xl border border-[#EFEBE1] flex items-center justify-center">
              <svg viewBox="0 0 280 180" className="w-full max-w-xs h-auto">
                {/* Furrow / Ridge cross section */}
                <path d="M20 130 Q60 80 100 130 Q140 80 180 130 Q220 80 260 130" fill="none" stroke="#C06D38" strokeWidth="3" />
                {/* Biochar band clusters in ridge */}
                <circle cx="60" cy="100" r="4.5" fill="#121614" />
                <circle cx="55" cy="110" r="4" fill="#1E3A2B" />
                <circle cx="65" cy="115" r="4" fill="#2E6B47" />
                <circle cx="140" cy="100" r="4.5" fill="#121614" />
                <circle cx="135" cy="110" r="4" fill="#1E3A2B" />
                <circle cx="145" cy="115" r="4" fill="#2E6B47" />
                <circle cx="220" cy="100" r="4.5" fill="#121614" />
                <circle cx="215" cy="110" r="4" fill="#1E3A2B" />
                <circle cx="225" cy="115" r="4" fill="#2E6B47" />
                <text x="140" y="160" textAnchor="middle" fill="#58635B" fontSize="10" fontWeight="bold">
                  Row Banding (Concentrated in Furrows)
                </text>
              </svg>
            </div>
          </div>

          {/* Method 4: Drip-line Trench */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5E0D6] shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="badge-carbon">Method 04</span>
              <h2 className="text-2xl font-bold font-heading text-[#121614]">
                Drip-Line Trenching (Mature Orchards)
              </h2>
              <p className="text-xs text-[#58635B] leading-relaxed">
                For established fruit trees (3+ years). Dig a shallow 4 to 6-inch trench directly beneath the canopy perimeter where drip emitters drip.
              </p>
              <div className="space-y-1.5 text-xs text-[#121614] font-medium pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" />
                  <span><strong>Dose:</strong> 1.5 kg to 2 kg per mature tree.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B47]" />
                  <span><strong>Benefit:</strong> Catches every drop of irrigation water, creating a perpetual sponge in the feeder root ring.</span>
                </div>
              </div>
            </div>

            {/* Inline Technical SVG Diagram 4 */}
            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 rounded-2xl border border-[#EFEBE1] flex items-center justify-center">
              <svg viewBox="0 0 280 180" className="w-full max-w-xs h-auto">
                {/* Drip lateral pipe */}
                <line x1="30" y1="40" x2="250" y2="40" stroke="#121614" strokeWidth="4" />
                {/* Drip Emitter Drop */}
                <circle cx="140" cy="40" r="4" fill="#C06D38" />
                <path d="M140 50 Q138 65 140 70 Q142 65 140 50" fill="#2E6B47" />
                {/* Trench below emitter */}
                <rect x="80" y="80" width="120" height="45" rx="6" fill="#EFEBE1" stroke="#C4BCAC" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="4.5" fill="#121614" />
                <circle cx="120" cy="110" r="5" fill="#1E3A2B" />
                <circle cx="140" cy="98" r="4.5" fill="#2E6B47" />
                <circle cx="160" cy="108" r="5" fill="#121614" />
                <circle cx="180" cy="100" r="4" fill="#1E3A2B" />
                <text x="140" y="150" textAnchor="middle" fill="#58635B" fontSize="10" fontWeight="bold">
                  Drip-Line Feeder Root Trench
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* When to Apply Section */}
        <div className="bg-[#121614] text-white p-8 sm:p-10 rounded-3xl border border-[#28302C] space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#8DE0AD]" />
            <h3 className="text-xl font-bold font-heading text-white">
              When is the Best Time to Apply in India?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#C4BCAC]">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="font-bold text-white block">Pre-Monsoon (May - June)</span>
              <p>
                Best for open-field farms and orchards. Applying before summer rains lets the sponge absorb rainwater runoff and prevent dry-season stress.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="font-bold text-white block">Transplanting Time</span>
              <p>
                Whenever setting new nursery plugs or orchard saplings. Incorporate directly in the pit or furrow.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="font-bold text-white block">Pot Repotting Cycle</span>
              <p>
                For terrace gardening, blend into top 2 inches of potting mix during biannual soil replenishment (February / September).
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/dose-calculator"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Required Bags</span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-colors"
            >
              <span>Explore Bag Formats</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
