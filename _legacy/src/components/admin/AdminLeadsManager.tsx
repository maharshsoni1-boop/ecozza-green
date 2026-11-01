"use client";

import React, { useState } from "react";
import { updateLeadStatusAction } from "@/app/actions/admin-leads";
import { Inbox, PhoneCall, Mail, MapPin, Building2, Check, ExternalLink } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  companyName: string | null;
  gstin: string | null;
  phone: string;
  email: string | null;
  locationState: string;
  locationCity: string | null;
  cropType: string | null;
  quantityText: string;
  message: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: Date;
}

export function AdminLeadsManager({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses = ["NEW", "CONTACTED", "QUOTED", "CLOSED"];

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const res = await updateLeadStatusAction(id, newStatus);
    if (res.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-xs text-[#58635B]">
        Showing <strong>{leads.length}</strong> commercial nursery & bulk farm leads
      </div>

      <div className="space-y-4">
        {leads.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E5E0D6] text-center text-xs text-[#58635B]">
            No commercial leads received yet.
          </div>
        ) : (
          leads.map((lead) => {
            const cleanPhone = lead.phone.replace(/\D/g, "");
            return (
              <div
                key={lead.id}
                className="bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4 hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EFEBE1]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#121614] font-heading">
                        {lead.name}
                      </span>
                      {lead.companyName && (
                        <span className="text-xs font-semibold text-[#58635B]">
                          • {lead.companyName}
                        </span>
                      )}
                      <span className="badge-carbon text-[10px]">{lead.status}</span>
                    </div>
                    <div className="text-[11px] text-[#58635B] mt-0.5">
                      Submitted on {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20thank%20you%20for%20your%20inquiry%20regarding%20Ecozza%20Green%20biochar%20granules.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E9F4EE] hover:bg-[#D5EBDD] text-[#1E3A2B] text-xs font-bold transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#2E6B47]" />
                      <span>WhatsApp Lead</span>
                    </a>

                    <select
                      value={lead.status}
                      disabled={updatingId === lead.id}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="py-1.5 px-2.5 rounded-lg border border-[#E5E0D6] text-xs font-bold text-[#121614] bg-white"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFEBE1]">
                  <div>
                    <span className="text-[10px] text-[#58635B] font-semibold block">Requested Volume</span>
                    <span className="text-sm font-bold text-[#2E6B47] mt-0.5 block">{lead.quantityText}</span>
                    <span className="text-[10px] text-[#8C978F] mt-0.5 block">Crop: {lead.cropType || "General Soil Mix"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#58635B] font-semibold block">Contact Details</span>
                    <span className="font-semibold text-[#121614] block mt-0.5">Ph: {lead.phone}</span>
                    {lead.email && <span className="text-[#58635B] block">{lead.email}</span>}
                  </div>

                  <div>
                    <span className="text-[10px] text-[#58635B] font-semibold block">Location & Tax</span>
                    <span className="font-semibold text-[#121614] block mt-0.5">
                      {lead.locationCity ? `${lead.locationCity}, ` : ""}{lead.locationState}
                    </span>
                    {lead.gstin && <span className="text-[#2E6B47] text-[10px] block">GSTIN: {lead.gstin}</span>}
                  </div>
                </div>

                {lead.message && (
                  <div className="text-xs text-[#58635B] bg-white p-3 rounded-xl border border-[#EFEBE1]">
                    <strong className="text-[#121614]">Buyer Requirements:</strong> "{lead.message}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
