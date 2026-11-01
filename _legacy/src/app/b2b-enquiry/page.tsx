import React from "react";
import { B2BEnquiryClient } from "@/components/enquiry/B2BEnquiryClient";
import { Building2 } from "lucide-react";

export const metadata = {
  title: "B2B & Bulk Biochar Inquiries | Ecozza Green",
  description:
    "Direct facility quotation for commercial nurseries, fruit orchards, and agricultural cooperatives. 1-tonne jumbo bags and truckload quantities in India.",
};

interface B2BPageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function B2BEnquiryPage({ searchParams }: B2BPageProps) {
  const params = await searchParams;

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Commercial Growers & Cooperatives</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading">
            Bulk & Nursery Consignments
          </h1>
          <p className="text-xs sm:text-sm text-[#58635B] leading-relaxed">
            Supplying calibrated biochar soil conditioner granules in 25 kg bags and 1-Tonne Jumbo Bags directly from our Gujarat plant.
          </p>
        </div>

        <B2BEnquiryClient initialProduct={params.product} />
      </div>
    </div>
  );
}
