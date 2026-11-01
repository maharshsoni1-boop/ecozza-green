import React from "react";
import prisma from "@/lib/prisma";
import { ShopClient } from "@/components/shop/ShopClient";
import Link from "next/link";
import { Calculator, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { COMPLIANCE_CONFIG } from "@/lib/compliance";

export const metadata = {
  title: "Shop Biochar Soil Conditioner Granules | Ecozza Green",
  description:
    "Explore our range of granular biochar soil conditioners in 5kg, 10kg, 25kg, and 1-tonne bulk bags. Free pan-India delivery above ₹1499.",
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { weightKg: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="py-10 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#58635B]">
            <Link href="/" className="hover:text-[#121614] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#121614]">Shop Granules</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading tracking-tight">
                Granular Biochar Soil Conditioners
              </h1>
              <p className="text-sm text-[#58635B] mt-1.5 max-w-2xl leading-relaxed">
                Porous woody carbon matrices designed to expand root zone water-holding capacity and stop nutrient leaching. Manufactured and graded in Gujarat, India.
              </p>
            </div>

            {/* Dose Calculator Shortcut */}
            <Link
              href="/dose-calculator"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E9F4EE] hover:bg-[#D5EBDD] text-[#1E3A2B] text-xs font-bold transition-colors shrink-0"
            >
              <Calculator className="w-4 h-4 text-[#C06D38]" />
              <span>Need dosing help? Open Calculator</span>
            </Link>
          </div>
        </div>

        {/* Regulatory Disclaimer Notice */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E5E0D6] flex items-start gap-2.5 text-xs text-[#58635B] shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#2E6B47] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#121614]">Agronomic Notice:</strong> Ecozza Green is a granular biochar soil conditioner, not a fertilizer. It enhances soil structure and retains water/nutrients. Use in conjunction with your regular crop nutrition plans.
          </p>
        </div>

        {/* Interactive Products & Filters View */}
        <ShopClient initialProducts={products} />

        {/* Bulk Enquiry Strip for Farmers & Nurseries */}
        <div className="bg-gradient-to-r from-[#162E20] to-[#121614] text-white p-8 rounded-3xl border border-[#28302C] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="badge-carbon">Commercial Orders & Cooperatives</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Ordering more than 500 kilograms or 1-Tonne Jumbo Bags?
            </h3>
            <p className="text-xs text-[#C4BCAC] leading-relaxed">
              We provide discounted direct-from-facility freight consignments with formal GST invoices (HSN 31059090).
            </p>
          </div>

          <Link
            href="/b2b-enquiry"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C06D38] hover:bg-[#A55724] text-white text-xs font-bold transition-all shrink-0 shadow-md"
          >
            <span>Request B2B Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
