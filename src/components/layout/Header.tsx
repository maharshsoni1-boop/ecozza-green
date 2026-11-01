"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Menu,
  X,
  Calculator,
  FileCheck2,
  PhoneCall,
  Sparkles,
  HelpCircle,
  Truck,
  Leaf,
  ShieldAlert,
} from "lucide-react";

export function Header() {
  const { itemCount, totalWeightKg, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#121614] text-[#EFEBE1] text-xs py-2 px-4 border-b border-[#28302C]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8DE0AD] animate-pulse"></span>
            <span className="font-medium tracking-wide">
              Direct from Gujarat Facility • 100% Natural Granular Soil Conditioner • Pan-India Courier
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#A8B2AC]">
            <Link
              href="/track-order"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <span className="text-[#3E4A42]">|</span>
            <a
              href="https://wa.me/919876543210?text=Hello%20Ecozza%20Green%2C%20I%20want%20to%20inquire%20about%20biochar%20granules"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8DE0AD] flex items-center gap-1 transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navigation Header */}
      <header className="sticky top-0 z-40 glass-nav transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo strictly "Ecozza Green" */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform border border-[#2E6B47]/40">
                <Image
                  src="/icon-circle.png"
                  alt="Ecozza Green Logo"
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[#121614] font-heading leading-tight group-hover:text-[#1E3A2B] transition-colors">
                  Ecozza Green
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#2E6B47]">
                  Biochar Soil Conditioner
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                href="/shop"
                className="px-3 py-2 text-sm font-medium text-[#121614] hover:text-[#2E6B47] hover:bg-black/5 rounded-lg transition-colors"
              >
                Shop Granules
              </Link>
              <Link
                href="/dose-calculator"
                className="px-3 py-2 text-sm font-medium text-[#121614] hover:text-[#2E6B47] hover:bg-black/5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Calculator className="w-4 h-4 text-[#C06D38]" />
                <span>Dose Calculator</span>
              </Link>
              <Link
                href="/how-to-use"
                className="px-3 py-2 text-sm font-medium text-[#121614] hover:text-[#2E6B47] hover:bg-black/5 rounded-lg transition-colors"
              >
                How to Use
              </Link>
              <Link
                href="/why-biochar"
                className="px-3 py-2 text-sm font-medium text-[#121614] hover:text-[#2E6B47] hover:bg-black/5 rounded-lg transition-colors"
              >
                Why Biochar
              </Link>
              <Link
                href="/b2b-enquiry"
                className="px-3 py-2 text-sm font-medium text-[#1E3A2B] font-semibold bg-[#E9F4EE] hover:bg-[#D5EBDD] rounded-lg transition-colors"
              >
                Bulk & Nursery Enquiry
              </Link>
              <Link
                href="/lab-reports"
                className="px-3 py-2 text-sm font-medium text-[#121614] hover:text-[#2E6B47] hover:bg-black/5 rounded-lg transition-colors flex items-center gap-1"
              >
                <FileCheck2 className="w-4 h-4 text-[#2E6B47]" />
                <span>Lab Reports</span>
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-[#121614] hover:text-[#2E6B47] hover:bg-black/5 rounded-lg transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Right Action Icons: Cart & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="hidden md:inline-flex text-xs font-semibold text-[#58635B] hover:text-[#121614] px-2.5 py-1.5 rounded-md hover:bg-black/5 transition-colors border border-transparent hover:border-[#E5E0D6]"
              >
                Admin
              </Link>

              {/* Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white shadow-sm transition-all"
                aria-label="Open shopping cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#8DE0AD]" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-none">Cart</span>
                  {totalWeightKg > 0 && (
                    <span className="text-[10px] text-[#8DE0AD] leading-none mt-0.5">
                      {totalWeightKg} kg
                    </span>
                  )}
                </div>
                {itemCount > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-[#C06D38] text-white text-[11px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#121614] hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E5E0D6] px-6 py-6 space-y-4 shadow-xl">
            <div className="space-y-2">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#121614] hover:bg-[#FAF8F5]"
              >
                Shop Granules
              </Link>
              <Link
                href="/dose-calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-[#C06D38] hover:bg-[#FAF8F5]"
              >
                <Calculator className="w-5 h-5" />
                <span>Soil Dose Calculator</span>
              </Link>
              <Link
                href="/how-to-use"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#121614] hover:bg-[#FAF8F5]"
              >
                How to Use Guides
              </Link>
              <Link
                href="/why-biochar"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#121614] hover:bg-[#FAF8F5]"
              >
                Why Biochar
              </Link>
              <Link
                href="/b2b-enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#1E3A2B] bg-[#E9F4EE]"
              >
                B2B & Nursery Bulk Enquiries
              </Link>
              <Link
                href="/lab-reports"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-[#121614] hover:bg-[#FAF8F5]"
              >
                <FileCheck2 className="w-5 h-5 text-[#2E6B47]" />
                <span>Lab Test Reports</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#121614] hover:bg-[#FAF8F5]"
              >
                About Ecozza Green
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-[#58635B] hover:bg-[#FAF8F5]"
              >
                <Truck className="w-5 h-5" />
                <span>Track Existing Order</span>
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#58635B] hover:bg-[#FAF8F5]"
              >
                Admin Panel Login
              </Link>
            </div>

            <div className="pt-4 border-t border-[#E5E0D6] flex justify-between items-center text-xs text-[#58635B]">
              <span>Gujarat Facility Dispatch</span>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#2E6B47] flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp Sales</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
