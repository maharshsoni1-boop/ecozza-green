import React from "react";
import prisma from "@/lib/prisma";
import { AdminBatchesManager } from "@/components/admin/AdminBatchesManager";

export const dynamic = "force-dynamic";

export default async function AdminBatchesPage() {
  const [batches, products] = await Promise.all([
    prisma.batchLabReport.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Production Batches & Lab Quality Reports
        </h1>
        <p className="text-xs text-[#58635B] mt-1">
          Maintain physical & chemical test parameters (carbon %, pH, moisture, heavy metals) and upload laboratory PDF certificates.
        </p>
      </div>

      <AdminBatchesManager initialBatches={batches} products={products} />
    </div>
  );
}
