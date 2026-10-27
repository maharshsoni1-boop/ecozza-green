"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  Search,
  FileCheck2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Download,
} from "lucide-react";

interface Batch {
  id: string;
  batchNumber: string;
  labName: string | null;
  labReportPdfUrl: string | null;
  carbonPercentage: number | null;
  phValue: number | null;
  moisturePercentage: number | null;
  granuleSizeMm: string | null;
  bulkDensity: number | null;
  heavyMetalsSummary: string | null;
  notes: string | null;
  isVerified: boolean;
  createdAt: Date;
}

export function LabReportsClient({ batches }: { batches: Batch[] }) {
  const [search, setSearch] = useState("");

  const filtered = batches.filter((b) =>
    b.batchNumber.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Batch Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#121614] font-heading">
          Look up Your Bag Batch Number
        </h2>
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C978F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type batch number printed on packaging (e.g. EG-2026-B01)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
          />
        </div>
        <p className="text-[11px] text-[#58635B]">
          Look on the back panel of your Ecozza Green bag or scan the QR code to find the batch code.
        </p>
      </div>

      {/* Batch Cards */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E5E0D6] text-center text-xs text-[#58635B]">
            No batch found matching "{search}". Please double check the code printed on your packaging.
          </div>
        ) : (
          filtered.map((batch) => (
            <div
              key={batch.id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0D6] shadow-2xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFEBE1]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-[#121614] font-heading">
                      Batch #{batch.batchNumber}
                    </span>
                    <span className="badge-carbon text-[10px]">
                      {batch.isVerified ? "Certified Report" : "Sample Demo Data"}
                    </span>
                  </div>
                  <div className="text-xs text-[#58635B] mt-1">
                    Tested by: <strong>{batch.labName || "Awaiting Laboratory Certification"}</strong>
                  </div>
                </div>

                {batch.labReportPdfUrl && (
                  <a
                    href={batch.labReportPdfUrl}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-colors shadow-xs shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report PDF</span>
                  </a>
                )}
              </div>

              {/* Lab Parameters Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE1]">
                  <div className="text-[10px] text-[#58635B]">Organic Carbon</div>
                  <div className="text-base font-extrabold text-[#121614] font-heading mt-0.5">
                    {batch.carbonPercentage}%
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE1]">
                  <div className="text-[10px] text-[#58635B]">pH Level</div>
                  <div className="text-base font-extrabold text-[#121614] font-heading mt-0.5">
                    {batch.phValue}
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE1]">
                  <div className="text-[10px] text-[#58635B]">Moisture</div>
                  <div className="text-base font-extrabold text-[#121614] font-heading mt-0.5">
                    {batch.moisturePercentage}%
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE1]">
                  <div className="text-[10px] text-[#58635B]">Granule Size</div>
                  <div className="text-xs font-bold text-[#121614] mt-1">
                    {batch.granuleSizeMm}
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE1]">
                  <div className="text-[10px] text-[#58635B]">Bulk Density</div>
                  <div className="text-xs font-bold text-[#121614] mt-1">
                    {batch.bulkDensity} g/cm³
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE1]">
                  <div className="text-[10px] text-[#58635B]">Heavy Metals</div>
                  <div className="text-[11px] font-bold text-[#2E6B47] mt-1">
                    {batch.heavyMetalsSummary || "FCO Pass"}
                  </div>
                </div>
              </div>

              {batch.notes && (
                <div className="text-xs text-[#58635B] bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFEBE1] leading-relaxed">
                  <strong className="text-[#121614]">Quality Notes:</strong> {batch.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Trust & Quality Assurance Statement */}
      <div className="bg-[#121614] text-white p-8 rounded-3xl border border-[#28302C] space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#8DE0AD]" />
          <h3 className="text-lg font-bold font-heading text-white">
            Our Quality & Purity Assurance
          </h3>
        </div>
        <p className="text-xs text-[#C4BCAC] leading-relaxed">
          At Ecozza Green, every batch produced at our Gujarat facility undergoes thorough testing. We test organic carbon %, pH, moisture, and ensure heavy metal contents are strictly below detection limits. We never use sludge or contaminated waste biomass.
        </p>
      </div>
    </div>
  );
}
