import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Inbox,
  ArrowRight,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  FlaskConical,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orders, products, leads, batches, fcoSetting] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { orderItems: true },
    }),
    prisma.product.findMany({
      include: { variants: true },
    }),
    prisma.leadEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.batchLabReport.findMany(),
    prisma.systemSetting.findUnique({
      where: { key: "fco_registration_number" },
    }),
  ]);

  const totalOrders = await prisma.order.count();
  const allOrders = await prisma.order.findMany({
    select: { totalAmount: true, paymentStatus: true },
  });

  const totalRevenue = allOrders
    .filter((o) => o.paymentStatus === "CAPTURED")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Low stock variants (< 25 bags)
  const lowStockVariants: any[] = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stockQuantity <= 25 && !v.isBulkQuoteOnly) {
        lowStockVariants.push({
          productName: p.name,
          variantTitle: v.title,
          stock: v.stockQuantity,
          sku: v.sku,
        });
      }
    });
  });

  const pendingLeadsCount = await prisma.leadEnquiry.count({
    where: { status: "NEW" },
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D6]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121614] font-heading">
            Executive Overview
          </h1>
          <p className="text-xs text-[#58635B] mt-1">
            Real-time orders, warehouse stock, and commercial agronomy leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-colors"
          >
            Manage All Orders
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#58635B]">Paid Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#E9F4EE] flex items-center justify-center text-[#2E6B47]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#121614] font-heading">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-[#2E6B47] font-medium">
            From verified online & settled orders
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#58635B]">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#1E3A2B]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#121614] font-heading">
            {totalOrders}
          </div>
          <div className="text-[11px] text-[#58635B]">
            Across pan-India delivery zones
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#58635B]">New B2B Leads</span>
            <div className="w-8 h-8 rounded-lg bg-[#FBF0E6] flex items-center justify-center text-[#C06D38]">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#121614] font-heading">
            {pendingLeadsCount}
          </div>
          <div className="text-[11px] text-[#C06D38] font-medium">
            Requires sales quote / response
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#58635B]">Low Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#121614] font-heading">
            {lowStockVariants.length}
          </div>
          <div className="text-[11px] text-red-600 font-medium">
            Variants &lt; 25 bags in warehouse
          </div>
        </div>
      </div>

      {/* Compliance & FCO Status Strip */}
      <div className="bg-[#18201C] text-[#EFEBE1] p-5 rounded-2xl border border-[#28302C] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#8DE0AD]" />
            <span>Regulatory & FCO Compliance Status</span>
          </div>
          <p className="text-[#A8B2AC]">
            FCO Registration Field:{" "}
            {fcoSetting?.value ? (
              <strong className="text-white">{fcoSetting.value}</strong>
            ) : (
              <span className="text-amber-400 font-semibold">
                [FCO Registration Pending / Not configured yet]
              </span>
            )}
          </p>
        </div>

        <Link
          href="/admin/settings"
          className="px-4 py-2 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors shrink-0"
        >
          Manage Compliance Settings
        </Link>
      </div>

      {/* Two Columns: Recent Orders & Pending B2B Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-[#121614]">
              Recent Customer Consignments
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#2E6B47] hover:underline"
            >
              View All ({totalOrders})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#EFEBE1] text-left text-[#58635B]">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F5]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 font-bold text-[#121614]">
                      {o.orderNumber}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-[#121614]">{o.customerName}</div>
                      <div className="text-[10px] text-[#8C978F]">{o.customerPhone}</div>
                    </td>
                    <td className="py-3">
                      <span className="badge-carbon text-[10px]">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-[11px] text-[#58635B]">
                      {o.paymentMethod} ({o.paymentStatus})
                    </td>
                    <td className="py-3 text-right font-bold text-[#121614]">
                      ₹{o.totalAmount}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/invoice/${o.id}`}
                        target="_blank"
                        className="text-[#2E6B47] hover:underline font-semibold"
                      >
                        Invoice
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commercial Leads Preview */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-[#121614]">
              New B2B Inquiries
            </h2>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-[#2E6B47] hover:underline"
            >
              View CRM
            </Link>
          </div>

          <div className="space-y-3">
            {leads.length === 0 ? (
              <p className="text-xs text-[#58635B] py-4 text-center">No pending enquiries.</p>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFEBE1] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#121614]">{lead.name}</span>
                    <span className="badge-earth text-[10px]">{lead.status}</span>
                  </div>
                  {lead.companyName && (
                    <div className="text-[11px] text-[#58635B] font-medium">
                      {lead.companyName}
                    </div>
                  )}
                  <div className="text-[11px] text-[#2E6B47] font-semibold">
                    Requested: {lead.quantityText}
                  </div>
                  <div className="text-[10px] text-[#8C978F]">
                    Location: {lead.locationCity || lead.locationState} • Ph: {lead.phone}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
