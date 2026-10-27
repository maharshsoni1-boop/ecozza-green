"use client";

import React, { useState } from "react";
import Link from "next/link";
import { updateOrderStatusAction } from "@/app/actions/admin-orders";
import {
  Search,
  Filter,
  Truck,
  FileText,
  Check,
  ChevronRight,
  Printer,
  ExternalLink,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  variantTitle: string;
  weightKg: number;
  quantity: number;
  totalPrice: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerGstin: string | null;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
  carrierName: string | null;
  trackingNumber: string | null;
  invoiceNumber: string | null;
  createdAt: Date;
  shippingAddress: string;
  orderItems: OrderItem[];
}

export function AdminOrdersManager({ initialOrders }: { initialOrders: OrderRecord[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses = ["ALL", "PLACED", "PAID", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

  const filtered = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    }
    setUpdatingId(null);
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string, carrierName: string) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatusAction(orderId, "SHIPPED", trackingNumber, carrierName);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, orderStatus: "SHIPPED", trackingNumber, carrierName }
            : o
        )
      );
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8C978F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order # or Phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5]"
          />
        </div>

        <div className="flex flex-wrap gap-1 w-full md:w-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-[#1E3A2B] text-white"
                  : "bg-[#FAF8F5] text-[#58635B] hover:text-[#121614] hover:bg-[#EFEBE1]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-[#E5E0D6] overflow-hidden divide-y divide-[#EFEBE1]">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#58635B]">
            No orders match the selected status or query.
          </div>
        ) : (
          filtered.map((order) => {
            const shipping = JSON.parse(order.shippingAddress || "{}");
            return (
              <div key={order.id} className="p-6 space-y-4 hover:bg-[#FAF8F5]/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-[#121614] font-heading">
                        {order.orderNumber}
                      </span>
                      <span className="badge-carbon text-[10px]">{order.orderStatus}</span>
                      <span className="badge-earth text-[10px]">{order.paymentMethod}</span>
                    </div>
                    <div className="text-xs text-[#58635B] mt-0.5">
                      {order.customerName} ({order.customerPhone}) • {shipping.city}, {shipping.state}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/invoice/${order.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFEBE1] border border-[#E5E0D6] text-xs font-semibold text-[#121614]"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#2E6B47]" />
                      <span>Invoice</span>
                    </Link>

                    {/* Status Changer */}
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="py-1.5 px-2.5 rounded-lg border border-[#E5E0D6] text-xs font-bold text-[#121614] bg-white"
                    >
                      {statuses.filter((s) => s !== "ALL").map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items & Tracking */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFEBE1]">
                  <div>
                    <div className="font-semibold text-[#121614] mb-1">Ordered Consignment:</div>
                    <ul className="space-y-0.5 text-[#58635B]">
                      {order.orderItems.map((item) => (
                        <li key={item.id}>
                          • {item.productName} ({item.variantTitle}) × {item.quantity} = ₹{item.totalPrice}
                        </li>
                      ))}
                    </ul>
                    <div className="font-bold text-[#121614] mt-2">
                      Total: ₹{order.totalAmount} (Incl. ₹{order.shippingAmount} Shipping)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold text-[#121614] flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#2E6B47]" />
                      <span>Courier Tracking Assignment:</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={order.trackingNumber || ""}
                        placeholder="Enter AWB (e.g. SR-GJ-9823101)"
                        id={`awb-${order.id}`}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#E5E0D6] text-xs bg-white"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`awb-${order.id}`) as HTMLInputElement;
                          if (input) handleTrackingUpdate(order.id, input.value, "Shiprocket / Blue Dart");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#1E3A2B] text-white text-xs font-semibold hover:bg-[#2E6B47]"
                      >
                        Save & Dispatch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
