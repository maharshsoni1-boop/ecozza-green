import React from "react";
import prisma from "@/lib/prisma";
import { AdminSettingsManager } from "@/components/admin/AdminSettingsManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.systemSetting.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Regulatory Compliance & Store Configuration
        </h1>
        <p className="text-xs text-[#58635B] mt-1">
          Maintain your FCO compliance number, Gujarat GSTIN, HSN codes, and WhatsApp contact numbers.
        </p>
      </div>

      <AdminSettingsManager initialSettings={settings} />
    </div>
  );
}
