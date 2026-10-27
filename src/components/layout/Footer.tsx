import React from "react";
import Link from "next/link";
import { Leaf, PhoneCall, Mail, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";
import { COMPLIANCE_CONFIG } from "@/lib/compliance";

export function Footer() {
  return (
    <footer className="bg-[#121614] text-[#EFEBE1] pt-16 pb-12 border-t border-[#28302C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#28302C]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A2B] flex items-center justify-center text-[#8DE0AD] border border-[#2E6B47]/40">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold font-heading text-white tracking-tight">
                Ecozza Green
              </span>
            </div>

            <p className="text-sm text-[#A8B2AC] max-w-sm leading-relaxed">
              Premium granular biochar soil conditioner produced in Gujarat, India. Engineered through controlled thermal carbonization to enhance soil water retention, cation exchange, and root microbiome health.
            </p>

            <div className="space-y-2 text-xs text-[#A8B2AC]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8DE0AD] shrink-0" />
                <span>Facility: GIDC Industrial Estate, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8DE0AD] shrink-0" />
                <span>care@ecozzagreen.in</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#8DE0AD] shrink-0" />
                <span>+91 98765 43210 (Mon-Sat, 9 AM - 6 PM IST)</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20Ecozza%20Green%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20biochar%20granules"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3A2B] hover:bg-[#2E6B47] text-[#8DE0AD] hover:text-white text-xs font-semibold transition-colors border border-[#2E6B47]/50"
              >
                <span>Chat with Agronomy Support on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Products */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8B2AC]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Granule Sizes
                </Link>
              </li>
              <li>
                <Link href="/products/ecozza-green-garden-granules" className="hover:text-white transition-colors">
                  Garden Grade (5kg, 10kg, 25kg)
                </Link>
              </li>
              <li>
                <Link href="/products/ecozza-green-nursery-blend" className="hover:text-white transition-colors">
                  Nursery Blend (2-4mm)
                </Link>
              </li>
              <li>
                <Link href="/products/ecozza-green-orchard-special" className="hover:text-white transition-colors">
                  Orchard & Plantation Coarse
                </Link>
              </li>
              <li>
                <Link href="/products/ecozza-green-farm-granules" className="hover:text-white transition-colors">
                  Field Farm Granules (25kg & Bulk)
                </Link>
              </li>
              <li>
                <Link href="/b2b-enquiry" className="hover:text-[#8DE0AD] font-semibold transition-colors">
                  1-Tonne Jumbo Bags (B2B Quote)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Agronomy & Guides */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Agronomy & Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8B2AC]">
              <li>
                <Link href="/dose-calculator" className="hover:text-white transition-colors flex items-center gap-1.5 text-[#C06D38] font-semibold">
                  <span>Soil Dose Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/how-to-use" className="hover:text-white transition-colors">
                  Application Manual & Methods
                </Link>
              </li>
              <li>
                <Link href="/why-biochar" className="hover:text-white transition-colors">
                  Science of Soil Porosity
                </Link>
              </li>
              <li>
                <Link href="/lab-reports" className="hover:text-white transition-colors">
                  Batch Lab Reports & Certificates
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Soil Health Articles
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Compliance & Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8B2AC]">
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Shipping & Courier Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition-colors">
                  Returns & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Ecozza Green
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Factory Visits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & FCO Compliance Strip */}
        <div className="py-6 border-b border-[#28302C] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#8E9B93]">
          <div>
            <span className="font-semibold text-white">FCO Registration / Compliance: </span>
            <span className="text-[#C4BCAC]">
              [Registration / Compliance: Pending official certificate filing]
            </span>
            <p className="text-[11px] text-[#707E75] mt-1">
              Field managed dynamically via admin compliance configuration.
            </p>
          </div>
          <div className="md:text-right">
            <span className="font-semibold text-white">GSTIN: </span>
            <span>24AAAAE0000A1Z5</span> • <span className="font-semibold text-white">HSN Code: </span>
            <span>31059090 (Organic Soil Conditioner)</span>
          </div>
        </div>

        {/* Mandatory Statutory Disclaimer Strip */}
        <div className="pt-6 pb-4">
          <div className="bg-[#18201C] p-4 rounded-xl border border-[#24332A] text-xs text-[#A8B2AC] leading-relaxed">
            <span className="font-bold text-white uppercase tracking-wider block mb-1">
              Statutory Classification Notice
            </span>
            {COMPLIANCE_CONFIG.GENERAL_DISCLAIMER}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#707E75] gap-4">
          <div>
            © 2026 Ecozza Green. All rights reserved. Gujarat, India.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#8DE0AD]">
              <ShieldCheck className="w-4 h-4" />
              <span>Razorpay Verified UPI / Cards / COD</span>
            </span>
            <span>•</span>
            <span>Shiprocket Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
