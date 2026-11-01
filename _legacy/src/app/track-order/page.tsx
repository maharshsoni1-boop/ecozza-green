import React from "react";
import Link from "next/link";
import { TrackOrderClient } from "@/components/tracking/TrackOrderClient";
import { Truck } from "lucide-react";

export const metadata = {
  title: "Track Consignment | Ecozza Green",
  description:
    "Track the live shipment status of your Ecozza Green biochar granules order using your order number or phone number.",
};

interface TrackOrderPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const params = await searchParams;

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <Truck className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Pan-India Courier Network</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#121614] font-heading">
            Track Your Consignment
          </h1>
          <p className="text-xs text-[#58635B] leading-relaxed">
            Real-time status updates from our packaging warehouse in Gujarat to your nursery, farm, or home garden.
          </p>
        </div>

        <TrackOrderClient initialQuery={params.orderNumber} />
      </div>
    </div>
  );
}
