"use client";

import React, { useState } from "react";
import { saveBatchReportAction } from "@/app/actions/admin-batches";
import { FlaskConical, Plus, Check, FileText, AlertCircle } from "lucide-react";

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

interface Product {
  id: string;
  name: string;
}

export function AdminBatchesManager({
  initialBatches,
  products,
}: {
  initialBatches: Batch[];
  products: Product[];
}) {
  const [batches, setBatches] = useState(initialBatches);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    batchNumber: "",
    productId: products[0]?.id || "",
    labName: "NABL Accredited Soil Testing Laboratory",
    carbonPercentage: 74.0,
    phValue: 7.8,
    moisturePercentage: 8.0,
    granuleSizeMm: "2 mm - 5 mm",
    bulkDensity: 0.44,
    heavyMetalsSummary: "Below detectable limits (FCO Compliant)",
    labReportPdfUrl: "/docs/sample-lab-report-b01.pdf",
    isVerified: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await saveBatchReportAction(form);
    if (res.success) {
      setShowModal(false);
      window.location.reload();
    } else {
      setError(res.error || "Failed to save");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-xs text-[#58635B]">
          Showing <strong>{batches.length}</strong> official production batch records
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Batch Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47]">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#121614]">
                    Batch #{batch.batchNumber}
                  </h3>
                  <div className="text-[10px] text-[#58635B]">
                    Logged on {new Date(batch.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                batch.isVerified ? "bg-[#E9F4EE] text-[#2E6B47]" : "bg-amber-50 text-amber-700"
              }`}>
                {batch.isVerified ? "Verified Report" : "Draft / Sample"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EFEBE1]">
                <div className="text-[10px] text-[#58635B]">Carbon %</div>
                <div className="font-bold text-[#121614] mt-0.5">{batch.carbonPercentage}%</div>
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EFEBE1]">
                <div className="text-[10px] text-[#58635B]">pH Level</div>
                <div className="font-bold text-[#121614] mt-0.5">{batch.phValue}</div>
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EFEBE1]">
                <div className="text-[10px] text-[#58635B]">Moisture</div>
                <div className="font-bold text-[#121614] mt-0.5">{batch.moisturePercentage}%</div>
              </div>
            </div>

            <div className="text-xs text-[#58635B] space-y-1 pt-1">
              <div><strong>Testing Lab:</strong> {batch.labName || "Awaiting certification"}</div>
              <div><strong>Granule Size:</strong> {batch.granuleSizeMm || "2-5mm"}</div>
              <div><strong>Heavy Metals:</strong> {batch.heavyMetalsSummary || "FCO compliant"}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to add new batch */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold font-heading text-[#121614]">
              Log Production Batch & Laboratory Test Report
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#121614]">Batch Number (e.g. EG-2026-B02) *</label>
                <input
                  type="text"
                  required
                  value={form.batchNumber}
                  onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                  placeholder="EG-2026-B02"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#121614]">Carbon % *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.carbonPercentage}
                    onChange={(e) => setForm({ ...form, carbonPercentage: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#121614]">pH Value *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.phValue}
                    onChange={(e) => setForm({ ...form, phValue: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#121614]">Moisture % *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.moisturePercentage}
                    onChange={(e) => setForm({ ...form, moisturePercentage: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#121614]">Granule Size Range *</label>
                  <input
                    type="text"
                    required
                    value={form.granuleSizeMm}
                    onChange={(e) => setForm({ ...form, granuleSizeMm: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#121614]">Testing Laboratory Name *</label>
                <input
                  type="text"
                  required
                  value={form.labName}
                  onChange={(e) => setForm({ ...form, labName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#121614]">Heavy Metals Summary *</label>
                <input
                  type="text"
                  required
                  value={form.heavyMetalsSummary}
                  onChange={(e) => setForm({ ...form, heavyMetalsSummary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white font-bold"
                >
                  {loading ? "Saving..." : "Save Batch"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E0D6] text-[#58635B]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
