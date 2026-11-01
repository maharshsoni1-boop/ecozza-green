import React from "react";
import { checkAdminSession } from "@/app/actions/admin-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden min-h-screen">
        {children}
      </div>
    </div>
  );
}
