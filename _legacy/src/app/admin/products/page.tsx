import React from "react";
import prisma from "@/lib/prisma";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { weightKg: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Product Catalogs & Bag Inventory
        </h1>
        <p className="text-xs text-[#58635B] mt-1">
          Update prices, manage packaging variant stock quantities, and inspect SKU limits.
        </p>
      </div>

      <AdminProductsManager initialProducts={products} />
    </div>
  );
}
