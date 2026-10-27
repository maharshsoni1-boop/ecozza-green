"use client";

import React, { useState } from "react";
import { submitB2BEnquiryAction } from "@/app/actions/enquiry";
import {
  Building2,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  Send,
} from "lucide-react";

export function B2BEnquiryClient({ initialProduct }: { initialProduct?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    gstin: "",
    phone: "",
    email: "",
    locationState: "Gujarat",
    locationCity: "",
    cropType: initialProduct || "",
    quantityText: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    leadId: string;
    name: string;
    quantityText: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await submitB2BEnquiryAction(formData);
    if (res.success) {
      setSuccessResult({
        leadId: res.leadId!,
        name: res.name!,
        quantityText: res.quantityText!,
      });
    } else {
      setError(res.error || "Failed to submit enquiry. Please try again.");
    }
    setLoading(false);
  };

  if (successResult) {
    const cleanPhone = formData.phone.replace(/\D/g, "");
    const waText = encodeURIComponent(
      `Hello Ecozza Green, I have submitted a B2B enquiry for ${successResult.quantityText} under Reference #${successResult.leadId.slice(-6)}. Looking forward to quotation.`
    );

    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E0D6] shadow-sm max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47]">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="badge-carbon">Enquiry Received</span>
          <h2 className="text-2xl font-bold font-heading text-[#121614]">
            Thank You, {successResult.name}!
          </h2>
          <p className="text-xs text-[#58635B] leading-relaxed max-w-md mx-auto">
            Our Gujarat agronomy and B2B dispatch team has received your request for{" "}
            <strong className="text-[#121614]">{successResult.quantityText}</strong>. We will contact you within 24 business hours.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE1] text-xs text-[#58635B] text-left space-y-1">
          <div><strong>Enquiry Reference ID:</strong> {successResult.leadId}</div>
          <div><strong>Registered State:</strong> {formData.locationState}</div>
          <div><strong>Phone:</strong> {formData.phone}</div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/919876543210?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Connect Directly on WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setSuccessResult(null);
              setFormData({
                name: "",
                companyName: "",
                gstin: "",
                phone: "",
                email: "",
                locationState: "Gujarat",
                locationCity: "",
                cropType: "",
                quantityText: "",
                message: "",
              });
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#E5E0D6] text-xs font-semibold text-[#58635B] hover:text-[#121614]"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E0D6] shadow-sm max-w-3xl mx-auto space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Vipulbhai Patel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Mobile Number (+91) *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 9825012345"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Organization / Nursery Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Anand Green Hi-Tech Nursery"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">GSTIN (Optional for Tax Credit)</label>
            <input
              type="text"
              maxLength={15}
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
              placeholder="e.g. 24AAAAE0000A1Z5"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="For formal quotation PDF"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">State *</label>
            <input
              type="text"
              required
              value={formData.locationState}
              onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
              placeholder="e.g. Gujarat"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">City / District</label>
            <input
              type="text"
              value={formData.locationCity}
              onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
              placeholder="e.g. Vadodara"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Crop / Application Type</label>
            <input
              type="text"
              value={formData.cropType}
              onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              placeholder="e.g. Mango Orchard / Seedling Trays"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-[#121614]">Required Quantity *</label>
            <input
              type="text"
              required
              value={formData.quantityText}
              onChange={(e) => setFormData({ ...formData, quantityText: e.target.value })}
              placeholder="e.g. 5 Tonnes Jumbo Bags or 200 bags of 25kg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-[#121614]">Specific Requirements / Delivery Schedule</label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Specify preferred granule size, unloading arrangements, or monthly delivery schedule..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
        >
          {loading ? (
            <span>Sending Inquiry to Sales Desk...</span>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#8DE0AD]" />
              <span>Submit Commercial B2B Enquiry</span>
            </>
          )}
        </button>

        <div className="text-center pt-2 text-[11px] text-[#58635B] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B47]" />
          <span>GST Tax Invoices with HSN 31059090 provided on all commercial consignments.</span>
        </div>
      </form>
    </div>
  );
}
