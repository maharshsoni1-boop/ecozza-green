import React from "react";
import prisma from "@/lib/prisma";
import { AdminDoseTableManager } from "@/components/admin/AdminDoseTableManager";

export const dynamic = "force-dynamic";

export default async function AdminDoseTablePage() {
  const rules = await prisma.doseRule.findMany({
    orderBy: { plantCategory: "asc" },
  });

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Soil Dose Recommendation Matrix
        </h1>
        <p className="text-xs text-[#58635B] mt-1">
          Administer starting dose rates per crop, container, or acre. Powers the public interactive soil dose calculator.
        </p>
      </div>

      <AdminDoseTableManager initialRules={rules} />
    </div>
  );
}
