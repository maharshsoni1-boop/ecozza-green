"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ecozza_green_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ecozza_green_cookie_consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("ecozza_green_cookie_consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="glass-card-dark p-5 rounded-2xl shadow-2xl border border-[#2E6B47]/60 text-white space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2E6B47] flex items-center justify-center text-[#8DE0AD] shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold font-heading">
              Cookie & Analytics Preferences
            </h4>
          </div>
          <button
            onClick={handleDecline}
            className="text-[#8DE0AD]/70 hover:text-white p-1 rounded-md"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#C4BCAC] leading-relaxed">
          We use functional cookies to save your cart items and anonymous analytics (GA4) to understand how growers use our soil calculator. Read our{" "}
          <Link
            href="/policies/privacy"
            className="underline text-[#8DE0AD] hover:text-white"
          >
            Privacy Policy
          </Link>.
        </p>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={handleDecline}
            className="px-3 py-1.5 text-xs font-medium text-[#C4BCAC] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Necessary Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 text-xs font-semibold bg-[#2E6B47] hover:bg-[#388E5A] text-white rounded-lg transition-all shadow-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
