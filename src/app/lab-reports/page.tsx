import React from "react";
import prisma from "@/lib/prisma";
import { LabReportsClient } from "@/components/reports/LabReportsClient";
import { FileCheck2 } from "lucide-react";

export const metadata = {
  title: "Batch Lab Reports & Quality Certifications | Ecozza Green",
  description:
    "View third-party NABL laboratory test results for every production batch of Ecozza Green granular biochar: carbon %, pH, moisture, and heavy metals.",
};

export const dynamic = "force-dynamic";

export default async function LabReportsPage() {
  const batches = await prisma.batchLabReport.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <FileCheck2 className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Batch Transparency Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading">
            Quality Certificates & Lab Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#58635B] leading-relaxed">
            Verify the chemical and physical test parameters for the biochar batch in your hands. Complete transparency for commercial nurseries and growers.
          </p>
        </div>

        <LabReportsClient batches={batches} />
      </div>
    </div>
  );
}
