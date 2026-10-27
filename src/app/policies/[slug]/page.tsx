import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ShieldAlert, ArrowLeft } from "lucide-react";
import { COMPLIANCE_CONFIG } from "@/lib/compliance";

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

const POLICIES: Record<
  string,
  { title: string; subtitle: string; content: string[] }
> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How Ecozza Green handles your personal details, order delivery data, and cookie preferences.",
    content: [
      "1. Information We Collect: When you place an order or submit a B2B enquiry on Ecozza Green, we collect your name, mobile phone number, shipping address, email address, and optional GSTIN (for tax invoicing).",
      "2. Purpose of Collection: Information is used strictly for processing order deliveries via logistics partners (Shiprocket), sending transaction updates via email/SMS, generating GST tax invoices, and responding to B2B bulk enquiries.",
      "3. Payment Data Security: All online payments are handled directly by Razorpay through encrypted 256-bit SSL sessions. Ecozza Green does not store debit/credit card numbers or UPI PINs on its servers.",
      "4. Analytics and Cookies: We use functional session cookies to maintain your shopping cart and anonymous analytics (Google Analytics 4) to improve website usability. You can manage cookie preferences via our Cookie Consent banner.",
      "5. Contact Us: For any data deletion or privacy inquiries, contact care@ecozzagreen.in.",
    ],
  },
  terms: {
    title: "Terms and Conditions of Sale",
    subtitle: "Standard legal terms governing orders and purchases from Ecozza Green.",
    content: [
      "1. Product Classification: Ecozza Green products are sold as granular biochar soil conditioners. They are designed to enhance soil moisture and nutrient retention. They are NOT fertilizers and do not substitute required crop nutrition inputs.",
      "2. No Yield Guarantees: Soil biology and performance vary significantly based on existing soil organic carbon, moisture, and agricultural practices. Dosing recommendations provided on this site are starting guidelines only.",
      "3. Pricing & Taxes: All prices listed on the consumer storefront are inclusive of 5% concessional GST under HSN code 31059090 unless otherwise stated.",
      "4. Orders & Acceptance: Order receipt confirmation does not signify automatic acceptance. Ecozza Green reserves the right to cancel orders due to stock depletion, courier unserviceability, or pricing errors, with a full refund.",
      "5. Jurisdiction: Any disputes arising from transactions on this site shall be subject to the exclusive jurisdiction of the competent courts in Gujarat, India.",
    ],
  },
  shipping: {
    title: "Shipping & Delivery Policy",
    subtitle: "Information regarding weight tiers, delivery timelines, and courier partners.",
    content: [
      "1. Delivery Zones: Ecozza Green ships consignments pan-India across all serviceable postal pincodes verified through our courier network.",
      "2. Heavy Consignment Rates: Due to bag weights (5 kg, 10 kg, 25 kg), shipping rates are calculated dynamically based on total consignment weight. Standard retail orders over ₹1,499 qualify for FREE standard courier delivery.",
      "3. Estimated Timelines: Gujarat and neighboring states typically receive delivery within 2 to 3 business days. Other major Indian states and metro areas are delivered within 4 to 6 business days.",
      "4. Cash on Delivery (COD): COD is offered on select serviceable pincodes for consumer orders up to ₹5,000. Large bulk or 1-tonne consignments require advance bank transfer or online payment.",
      "5. Damaged Shipments: If a bag arrives punctured or damaged in transit, please take photographs and notify care@ecozzagreen.in or WhatsApp (+91 98765 43210) within 48 hours for immediate replacement.",
    ],
  },
  returns: {
    title: "Returns, Cancellations & Refund Policy",
    subtitle: "Guidelines regarding order cancellations, returns of unopened bags, and refund timelines.",
    content: [
      "1. Cancellations: Orders can be cancelled free of charge before dispatch from our Gujarat warehouse. Once the courier tracking number has been generated, standard cancellation may incur return transit fees.",
      "2. Return Eligibility: Unopened bags in their original sealed packaging may be returned within 7 days of delivery. Due to agronomic purity standards, opened bags or contaminated bags cannot be accepted for return.",
      "3. Defective or Damaged Products: In the unlikely event of receiving a batch with compromised physical packaging, Ecozza Green will issue a free replacement or 100% refund.",
      "4. Refund Processing: Approved refunds will be credited back to the original source (UPI, Card, or Netbanking) via Razorpay within 5 to 7 business days.",
    ],
  },
};

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = POLICIES[slug];

  if (!policy) {
    notFound();
  }

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58635B] hover:text-[#121614]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Flag for Legal Counsel Review Notice */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block font-bold">
              [DRAFT POLICY PLACEHOLDER — PENDING LEGAL COUNSEL REVIEW]
            </strong>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              This document represents standard e-commerce operating policy drafts for Ecozza Green. Final legal wording must be reviewed by the brand's legal advisors before commercial scale operations.
            </p>
          </div>
        </div>

        {/* Main Document Box */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E0D6] shadow-sm space-y-6">
          <div className="pb-4 border-b border-[#EFEBE1]">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121614] font-heading">
              {policy.title}
            </h1>
            <p className="text-xs text-[#58635B] mt-1">{policy.subtitle}</p>
          </div>

          <div className="space-y-4 text-xs text-[#58635B] leading-relaxed">
            {policy.content.map((clause, idx) => (
              <p key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFEBE1]">
                {clause}
              </p>
            ))}
          </div>

          <div className="pt-4 border-t border-[#EFEBE1] text-[11px] text-[#8C978F]">
            Last updated: October 2026 • Ecozza Green, Gujarat, India.
          </div>
        </div>
      </div>
    </div>
  );
}
