import React from "react";
import prisma from "@/lib/prisma";
import { AdminLeadsManager } from "@/components/admin/AdminLeadsManager";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await prisma.leadEnquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Commercial Grower & Nursery Leads CRM
        </h1>
        <p className="text-xs text-[#58635B] mt-1">
          Review bulk requests, manage quotation statuses, and connect directly with buyers via WhatsApp.
        </p>
      </div>

      <AdminLeadsManager initialLeads={leads} />
    </div>
  );
}
