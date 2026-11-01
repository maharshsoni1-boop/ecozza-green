"use client";

import React, { useState } from "react";
import { saveSystemSettingsAction } from "@/app/actions/admin-settings";
import { Settings, Check, AlertCircle, Save, ShieldCheck } from "lucide-react";

interface Setting {
  key: string;
  value: string;
  description: string | null;
}

export function AdminSettingsManager({ initialSettings }: { initialSettings: Setting[] }) {
  const settingsMap = initialSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const [form, setForm] = useState(settingsMap);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await saveSystemSettingsAction(form);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError(res.error || "Failed to update settings");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {saved && (
        <div className="p-4 rounded-xl bg-[#E9F4EE] border border-[#2E6B47]/30 text-[#1E3A2B] text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#2E6B47]" />
          <span>System compliance & store settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Regulatory & FCO Compliance Box */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A2B] uppercase tracking-wider pb-2 border-b border-[#EFEBE1]">
          <ShieldCheck className="w-4 h-4 text-[#2E6B47]" />
          <span>Statutory Fertilizer (Control) Order & Regulatory Compliance</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#121614]">
            FCO Registration / Compliance Number
          </label>
          <input
            type="text"
            value={form["fco_registration_number"] || ""}
            onChange={(e) => setForm({ ...form, fco_registration_number: e.target.value })}
            placeholder="[Leave empty until official certificate is available]"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
          />
          <p className="text-[11px] text-[#58635B]">
            Strict Rule: Keep empty until official registration number is granted. When left blank, public pages display placeholder notice or hide gracefully.
          </p>
        </div>
      </div>

      {/* Taxation & GST Settings */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4 shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#121614] pb-2 border-b border-[#EFEBE1]">
          Taxation & GST Invoice Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Gujarat GSTIN *</label>
            <input
              type="text"
              required
              value={form["store_gstin"] || "24AAAAE0000A1Z5"}
              onChange={(e) => setForm({ ...form, store_gstin: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] uppercase bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Biochar HSN Code *</label>
            <input
              type="text"
              required
              value={form["default_hsn_code"] || "31059090"}
              onChange={(e) => setForm({ ...form, default_hsn_code: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Concessional GST Rate (%) *</label>
            <input
              type="number"
              step="0.1"
              required
              value={form["default_gst_rate"] || "5.0"}
              onChange={(e) => setForm({ ...form, default_gst_rate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>
        </div>
      </div>

      {/* Shipping & Support Settings */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4 shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#121614] pb-2 border-b border-[#EFEBE1]">
          Store Information & Contact Numbers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Free Shipping Threshold (₹) *</label>
            <input
              type="number"
              required
              value={form["free_shipping_threshold"] || "1499"}
              onChange={(e) => setForm({ ...form, free_shipping_threshold: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">WhatsApp Support Number *</label>
            <input
              type="text"
              required
              value={form["store_whatsapp"] || "919876543210"}
              onChange={(e) => setForm({ ...form, store_whatsapp: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Customer Support Email *</label>
            <input
              type="email"
              required
              value={form["store_email"] || "care@ecozzagreen.in"}
              onChange={(e) => setForm({ ...form, store_email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#121614]">Support Phone *</label>
            <input
              type="text"
              required
              value={form["store_phone"] || "+91 98765 43210"}
              onChange={(e) => setForm({ ...form, store_phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-[#121614]">Gujarat Plant & Dispatch Address *</label>
            <input
              type="text"
              required
              value={form["store_address"] || "Plot 42, Green Agro Park, GIDC Industrial Area, Gujarat - 382445, India"}
              onChange={(e) => setForm({ ...form, store_address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] bg-[#FAF8F5]"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? "Saving Settings..." : "Save Settings"}</span>
      </button>
    </form>
  );
}
