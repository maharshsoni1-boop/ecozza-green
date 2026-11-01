import React from "react";
import Link from "next/link";
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Contact Ecozza Green | Gujarat Biochar Facility",
  description:
    "Get in touch with Ecozza Green for agronomy assistance, commercial nursery bulk consignments, or order status inquiries. Direct WhatsApp chat available.",
};

export default function ContactPage() {
  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <PhoneCall className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Customer Care & Agronomy Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading">
            Contact Ecozza Green
          </h1>
          <p className="text-xs sm:text-sm text-[#58635B] leading-relaxed">
            Have questions about dosing for your specific soil type or need a commercial bulk quotation? We are here to help.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: WhatsApp */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-[#121614]">
              WhatsApp Direct Chat
            </h3>
            <p className="text-xs text-[#58635B] leading-relaxed">
              Fastest response for order status, dosing recommendations, and photos of soil issues.
            </p>
            <a
              href="https://wa.me/919876543210?text=Hello%20Ecozza%20Green%2C%20I%20have%20an%20inquiry%20regarding%20biochar%20granules."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E6B47] hover:underline pt-2"
            >
              <span>Chat with us (+91 98765 43210)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Phone & Email */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF0E6] flex items-center justify-center text-[#C06D38]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-[#121614]">
              Phone & Email
            </h3>
            <div className="text-xs text-[#58635B] space-y-1">
              <div><strong>Phone:</strong> +91 98765 43210</div>
              <div><strong>Care Email:</strong> care@ecozzagreen.in</div>
              <div><strong>Sales Desk:</strong> sales@ecozzagreen.in</div>
            </div>
            <div className="text-[11px] text-[#8C978F] pt-1">
              Monday to Saturday, 9:00 AM – 6:00 PM IST
            </div>
          </div>

          {/* Card 3: Facility */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#1E3A2B] border border-[#EFEBE1]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-[#121614]">
              Manufacturing Plant
            </h3>
            <div className="text-xs text-[#58635B] space-y-0.5 leading-relaxed">
              <div className="font-semibold text-[#121614]">Ecozza Green Facility</div>
              <div>Plot 42, Green Agro Park</div>
              <div>GIDC Industrial Area</div>
              <div>Gujarat - 382445, India</div>
            </div>
            <div className="text-[11px] text-[#2E6B47] font-semibold pt-1">
              GSTIN: 24AAAAE0000A1Z5
            </div>
          </div>
        </div>

        {/* Location & B2B Prompt */}
        <div className="bg-[#121614] text-white p-8 sm:p-10 rounded-3xl border border-[#28302C] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="badge-carbon">Commercial Orders</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              Visiting our Gujarat Plant or Requesting a Truckload?
            </h3>
            <p className="text-xs text-[#C4BCAC]">
              For tractor trolley or multi-tonne lorry dispatch, please submit a formal inquiry via our commercial desk.
            </p>
          </div>

          <Link
            href="/b2b-enquiry"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors shrink-0 shadow-md"
          >
            <span>B2B Commercial Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
