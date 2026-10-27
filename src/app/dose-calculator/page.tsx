import React from "react";
import prisma from "@/lib/prisma";
import { DoseCalculatorClient } from "@/components/calculator/DoseCalculatorClient";
import Link from "next/link";
import { Calculator } from "lucide-react";

export const metadata = {
  title: "Biochar Soil Conditioner Dose Calculator | Ecozza Green",
  description:
    "Calculate exact kilogram requirements, number of bags, and costs for your vegetable beds, potted plants, fruit orchards, or acreage based on soil texture.",
};

export const dynamic = "force-dynamic";

export default async function DoseCalculatorPage() {
  const [rules, variants] = await Promise.all([
    prisma.doseRule.findMany({
      orderBy: { plantCategory: "asc" },
    }),
    prisma.productVariant.findMany({
      where: {
        isActive: true,
        isBulkQuoteOnly: false,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: { weightKg: "asc" },
    }),
  ]);

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Breadcrumb */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Interactive Agronomic Estimator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading">
            Biochar Soil Conditioner Dose Calculator
          </h1>
          <p className="text-xs sm:text-sm text-[#58635B] leading-relaxed">
            Select your crop or planting format, specify your soil texture, and calculate the exact kilograms and bag combination needed.
          </p>
        </div>

        <DoseCalculatorClient rules={rules} availableVariants={variants} />
      </div>
    </div>
  );
}
