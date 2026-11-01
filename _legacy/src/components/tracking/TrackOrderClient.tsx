"use client";

import React, { useState, useEffect } from "react";
import { trackOrderAction } from "@/app/actions/track";
import Link from "next/link";
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  FileText,
  MapPin,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export function TrackOrderClient({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (val: string) => {
    if (!val.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await trackOrderAction(val);
      if (res.success) {
        setResult(res.order);
      } else {
        setError(res.error || "Order not found");
        setResult(null);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const statusSteps = ["PLACED", "PAID", "PACKED", "SHIPPED", "DELIVERED"];

  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Search Input Box */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#121614] font-heading">
          Enter Your Details to Track Dispatch
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C978F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. EG-ORD-10001 or 9825012345"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track Consignment"}
          </button>
        </form>

        <p className="text-[11px] text-[#58635B]">
          Tip: You can use the order number sent on SMS/Email or your 10-digit mobile number.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0D6] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFEBE1]">
            <div>
              <span className="badge-carbon mb-1">{result.orderStatus}</span>
              <h3 className="text-xl font-bold font-heading text-[#121614]">
                Order {result.orderNumber}
              </h3>
              <div className="text-xs text-[#58635B] mt-0.5">
                Placed on {new Date(result.createdAt).toLocaleDateString("en-IN")} • Amount: ₹{result.totalAmount}
              </div>
            </div>

            <Link
              href={`/invoice/${result.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFEBE1] border border-[#E5E0D6] text-xs font-bold text-[#121614] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#2E6B47]" />
              <span>Tax Invoice</span>
            </Link>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#58635B]">
              Dispatch Pipeline
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              {statusSteps.map((step, idx) => {
                const currentIdx = getStepIndex(result.orderStatus);
                const isDone = currentIdx >= idx;
                const isCurrent = currentIdx === idx;
                return (
                  <div
                    key={step}
                    className={`p-3 rounded-xl border transition-all ${
                      isDone
                        ? "bg-[#E9F4EE] border-[#2E6B47]/30 text-[#1E3A2B] font-bold"
                        : "bg-[#FAF8F5] border-[#E5E0D6] text-[#8C978F]"
                    } ${isCurrent ? "ring-2 ring-[#2E6B47]" : ""}`}
                  >
                    <div className="text-xs font-bold">{step}</div>
                    <div className="text-[10px] mt-0.5">
                      {isDone ? "Completed" : "Pending"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Details */}
          {result.trackingNumber && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFEBE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-[#121614]">
                  Courier: {result.carrierName || "Shiprocket"}
                </div>
                <div className="text-[#58635B]">
                  Tracking AWB: <strong className="text-[#121614]">{result.trackingNumber}</strong>
                </div>
              </div>
              {result.trackingUrl && (
                <a
                  href={result.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#2E6B47] hover:underline"
                >
                  <span>Live Tracking Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Delivery Address & Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EFEBE1] text-xs">
            <div>
              <div className="font-bold text-[#121614] flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#2E6B47]" />
                <span>Delivery Address</span>
              </div>
              <div className="text-[#58635B] space-y-0.5">
                <div>{result.shippingAddress.fullName}</div>
                <div>{result.shippingAddress.addressLine1}</div>
                <div>{result.shippingAddress.city}, {result.shippingAddress.state} - {result.shippingAddress.postalCode}</div>
              </div>
            </div>

            <div>
              <div className="font-bold text-[#121614] flex items-center gap-1.5 mb-1">
                <Package className="w-3.5 h-3.5 text-[#2E6B47]" />
                <span>Consignment Items</span>
              </div>
              <div className="text-[#58635B] space-y-1">
                {result.items.map((i: any) => (
                  <div key={i.id} className="flex justify-between">
                    <span>{i.productName} ({i.variantTitle})</span>
                    <span className="font-semibold text-[#121614]">× {i.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
