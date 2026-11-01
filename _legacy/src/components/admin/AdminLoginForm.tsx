"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/app/actions/admin-auth";
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, KeyRound } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ecozzagreen.in");
  const [password, setPassword] = useState("EcozzaAdmin2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append("email", email);
    fd.append("password", password);

    const res = await adminLogin(fd);
    if (res.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-[#E5E0D6] shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-1">
          <Image
            src="/logo.png"
            alt="Ecozza Green"
            width={140}
            height={99}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Ecozza Green Back-Office
        </h1>
        <p className="text-xs text-[#58635B]">
          Authorized Administrator & Agronomy Management Portal
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#121614]">Admin Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8C978F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ecozzagreen.in"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#121614]">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C978F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Sign In to Admin Console"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFEBE1] text-[11px] text-[#58635B] space-y-1">
        <div className="font-semibold text-[#121614] flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-[#2E6B47]" />
          <span>Demo Credentials Seeded:</span>
        </div>
        <div>Email: <code className="bg-white px-1.5 py-0.5 rounded-sm">admin@ecozzagreen.in</code></div>
        <div>Password: <code className="bg-white px-1.5 py-0.5 rounded-sm">EcozzaAdmin2026!</code></div>
      </div>
    </div>
  );
}
