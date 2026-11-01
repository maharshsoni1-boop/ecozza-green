import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Droplets,
  Layers,
  Sparkles,
  ShieldCheck,
  Calculator,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Trees,
  Sprout,
  HelpCircle,
  PhoneCall,
  Clock,
} from "lucide-react";
import { COMPLIANCE_CONFIG } from "@/lib/compliance";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { weightKg: "asc" },
      },
    },
    take: 4,
  });

  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    take: 3,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#162E20] via-[#121614] to-[#121614] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#2E6B47]/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#8DE0AD]">
                <Image
                  src="/logo.png"
                  alt="Ecozza Green"
                  width={28}
                  height={20}
                  className="h-5 w-auto object-contain brightness-125"
                />
                <span>Engineered Biochar Soil Conditioner • Gujarat, India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1] text-white">
                Carbon-Rich Soil, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DE0AD] via-[#4ADE80] to-[#E9F4EE]">
                  Built to Last.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#C4BCAC] max-w-xl leading-relaxed">
                Granular biochar crafted to hold moisture up to 3x longer and lock nutrients directly into the active root zone. 
                <span className="font-semibold text-white"> Not a fertilizer</span>—a permanent physical upgrade to your soil structure.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-sm font-bold transition-all shadow-lg hover:shadow-[#2E6B47]/30 hover:scale-[1.02]"
                >
                  <span>Shop Granules</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dose-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-bold backdrop-blur-md border border-white/20 transition-all hover:scale-[1.02]"
                >
                  <Calculator className="w-4 h-4 text-[#C06D38]" />
                  <span>Calculate Soil Dose</span>
                </Link>

                <Link
                  href="/b2b-enquiry"
                  className="text-xs font-semibold text-[#8DE0AD] hover:text-white underline underline-offset-4 py-2"
                >
                  Bulk / Nursery Quotes &rarr;
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#A8B2AC]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8DE0AD]" />
                  <span>100% Woody Biochar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8DE0AD]" />
                  <span>Zero Sludge / Fillers</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#8DE0AD]" />
                  <span>Lab Tested Batches</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trees className="w-4 h-4 text-[#8DE0AD]" />
                  <span>Pan-India Courier</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-[#1B221E] group">
                <img
                  src="/images/biochar-hero.jpg"
                  alt="Ecozza Green biochar granules honeycomb microscopic pores and root zone structure"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Official Brand Badge */}
                <div className="absolute top-4 right-4 bg-[#121614]/85 backdrop-blur-md pl-1.5 pr-3 py-1 rounded-full border border-white/20 flex items-center gap-2 shadow-lg z-10">
                  <Image
                    src="/icon-circle.png"
                    alt="Ecozza Green Brand Mark"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-contain"
                  />
                  <span className="text-[11px] font-bold text-white tracking-wide">Official Brand</span>
                </div>

                {/* Floating Stat Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#121614]/90 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-[#8DE0AD] uppercase tracking-wider">
                      Batch EG-2026-B01
                    </div>
                    <div className="text-sm font-bold text-white font-heading">
                      74.2% Organic Carbon Matrix
                    </div>
                  </div>
                  <Link
                    href="/lab-reports"
                    className="px-3 py-1.5 rounded-lg bg-[#2E6B47] text-white text-xs font-semibold hover:bg-[#388E5A] transition-colors"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE BENEFIT STRIP */}
      <section className="py-14 bg-[#FAF8F5] border-b border-[#E5E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E6B47]">
              Physical Soil Upgrade
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121614] font-heading mt-1">
              Why Biochar Transforms Heavy or Sandy Soils
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E5E0D6] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47] mb-5">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#121614] font-heading mb-2">
                Holds Moisture 3x Longer
              </h3>
              <p className="text-sm text-[#58635B] leading-relaxed">
                Microscopic carbon honeycomb structures trap capillary water like an underground sponge, drastically reducing irrigation frequency and drought stress.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E5E0D6] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FBF0E6] flex items-center justify-center text-[#C06D38] mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#121614] font-heading mb-2">
                Locks Nutrients in Root Zone
              </h3>
              <p className="text-sm text-[#58635B] leading-relaxed">
                High Cation Exchange Capacity (CEC) electrically binds dissolved compost nutrients and organic teas, preventing them from leaching past thirsty root tips.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E5E0D6] shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#E9F4EE] flex items-center justify-center text-[#1E3A2B] mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#121614] font-heading mb-2">
                Lasts for Decades
              </h3>
              <p className="text-sm text-[#58635B] leading-relaxed">
                Unlike raw cow dung or peat moss that degrades within months, pyrolyzed biochar carbon is biochemically recalcitrant and remains stable in your soil for years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2E6B47]">
                Packaged & Bulk Granules
              </span>
              <h2 className="text-3xl font-extrabold text-[#121614] font-heading mt-1">
                Featured Ecozza Green Soil Conditioners
              </h2>
              <p className="text-sm text-[#58635B] mt-1 max-w-xl">
                Choose the right calibration for terrace gardening, seedling plugs, fruit orchards, or commercial farming.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E3A2B] hover:text-[#2E6B47] transition-colors mt-4 md:mt-0"
            >
              <span>View All Formats</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. DOSE CALCULATOR CALLOUT BANNER */}
      <section className="py-14 bg-gradient-to-r from-[#1E3A2B] via-[#162E20] to-[#121614] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#C06D38] text-white text-xs font-bold">
                Dynamic Agronomic Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                Not Sure How Many Kilograms You Need?
              </h2>
              <p className="text-sm text-[#C4BCAC] max-w-2xl leading-relaxed">
                Use our soil dose calculator. Select your crop, number of pots, fruit trees, or acreage, and your soil texture. Get exact bag recommendations and costs instantly.
              </p>
              <p className="text-xs text-[#8DE0AD]/80 italic">
                *All doses are starting recommendations; soil organic carbon and moisture levels vary.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/dose-calculator"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white text-[#121614] font-bold text-sm hover:bg-[#FAF8F5] transition-all shadow-xl hover:scale-105"
              >
                <Calculator className="w-5 h-5 text-[#C06D38]" />
                <span>Launch Dose Calculator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 STEPS) */}
      <section className="py-16 bg-[#FAF8F5] border-b border-[#E5E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E6B47]">
              Simple Application
            </span>
            <h2 className="text-3xl font-extrabold text-[#121614] font-heading mt-1">
              How to Apply in 3 Simple Steps
            </h2>
            <p className="text-sm text-[#58635B] mt-1">
              Biochar performs best when integrated into the active root zone alongside water and compost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-[#E5E0D6] relative">
              <div className="text-4xl font-extrabold text-[#E5E0D6] font-heading absolute top-6 right-6">
                01
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47] font-bold mb-4">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#121614] font-heading mb-2">
                Incorporate into Soil
              </h3>
              <p className="text-sm text-[#58635B] leading-relaxed">
                Mix granules with your potting mix (5-10% volume), pit soil around saplings, or furrow bands in field beds. Do not leave bare on soil surface.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-[#E5E0D6] relative">
              <div className="text-4xl font-extrabold text-[#E5E0D6] font-heading absolute top-6 right-6">
                02
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47] font-bold mb-4">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#121614] font-heading mb-2">
                Water Deeply
              </h3>
              <p className="text-sm text-[#58635B] leading-relaxed">
                Irrigate thoroughly. The dry pores readily draw water through capillary suction, hydrating the internal carbon matrices.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-[#E5E0D6] relative">
              <div className="text-4xl font-extrabold text-[#E5E0D6] font-heading absolute top-6 right-6">
                03
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47] font-bold mb-4">
                <Trees className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#121614] font-heading mb-2">
                Sustained Root Zone
              </h3>
              <p className="text-sm text-[#58635B] leading-relaxed">
                Beneficial soil microbes colonize pore surfaces, while root hairs anchor tightly, enjoying extended moisture during dry spells.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/how-to-use"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E3A2B] hover:text-[#2E6B47] underline underline-offset-4"
            >
              <span>Explore Complete Application Manual with Diagrams</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (VERIFIED ONLY) */}
      <section className="py-16 bg-white border-b border-[#E5E0D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E6B47]">
              Customer Experiences
            </span>
            <h2 className="text-3xl font-extrabold text-[#121614] font-heading mt-1">
              Feedback from Verified Indian Growers
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-[#FAF8F5] p-8 rounded-2xl border border-[#E5E0D6] shadow-xs"
              >
                <div className="flex items-center gap-1 text-[#C06D38] mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                  <span className="ml-2 text-xs font-bold text-[#2E6B47] bg-[#E9F4EE] px-2 py-0.5 rounded-full">
                    Verified Buyer
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#121614] mb-2 font-heading">
                  "{r.title}"
                </h3>
                <p className="text-sm text-[#58635B] leading-relaxed italic">
                  "{r.comment}"
                </p>
                <div className="mt-4 pt-3 border-t border-[#EFEBE1] text-xs font-semibold text-[#121614]">
                  — {r.reviewerName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. B2B & BULK CALLOUT */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#121614] rounded-3xl p-8 sm:p-12 text-white border border-[#28302C] relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="badge-carbon">B2B Commercial Growers</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                Supplying Commercial Nurseries & Agricultural Cooperatives
              </h2>
              <p className="text-sm text-[#C4BCAC] leading-relaxed">
                Order in 1-Tonne Jumbo Bags or truckload consignments direct from our Gujarat manufacturing facility. GST input tax credit invoices provided.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/b2b-enquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors"
                >
                  <span>Submit B2B Bulk Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/919876543210?text=Hello%20Ecozza%20Green%2C%20I%20need%20a%20B2B%20commercial%20quote%20for%20biochar%20granules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-[#8DE0AD]" />
                  <span>Direct WhatsApp Connect</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ PREVIEW */}
      <section className="py-16 bg-white border-t border-[#E5E0D6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E6B47]">
              Clear Agronomy Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121614] font-heading mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]">
              <h3 className="text-sm font-bold text-[#121614] font-heading">
                Is Ecozza Green biochar a fertilizer?
              </h3>
              <p className="text-xs text-[#58635B] mt-2 leading-relaxed">
                <strong>No.</strong> Biochar is a soil conditioner, not a fertilizer. It does not supply significant primary NPK nutrients by itself. Its job is to provide permanent physical pore structure that holds water and stops added fertilizers from washing away.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]">
              <h3 className="text-sm font-bold text-[#121614] font-heading">
                Why use granules instead of biochar powder?
              </h3>
              <p className="text-xs text-[#58635B] mt-2 leading-relaxed">
                Fine biochar dust blows away easily in dry Indian winds and can form an impermeable crust if wet. Our 2-5mm calibrated granules stay anchored in the soil and create crucial macropores for root oxygen.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]">
              <h3 className="text-sm font-bold text-[#121614] font-heading">
                Where are your products dispatched from?
              </h3>
              <p className="text-xs text-[#58635B] mt-2 leading-relaxed">
                All consignments are processed, packaged, and dispatched directly from our manufacturing and grading facility in Gujarat, India, with tracked courier delivery across all serviceable Indian pincodes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
