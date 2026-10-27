import React from "react";
import prisma from "@/lib/prisma";
import { AdminOrdersManager } from "@/components/admin/AdminOrdersManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { orderItems: true },
  });

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Customer Orders & Dispatch Pipeline
        </h1>
        <p className="text-xs text-[#58635B] mt-1">
          Update fulfillment status, assign courier tracking numbers, and view GST invoices.
        </p>
      </div>

      <AdminOrdersManager initialOrders={orders} />
    </div>
  );
}
