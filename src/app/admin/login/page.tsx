import React from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Leaf } from "lucide-react";

export const metadata = {
  title: "Admin Sign In | Ecozza Green",
  description: "Administrative login for Ecozza Green e-commerce and agronomy platform.",
};

export default function AdminLoginPage() {
  return (
    <div className="py-20 bg-[#FAF8F5] min-h-[85vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 space-y-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1E3A2B] flex items-center justify-center text-[#8DE0AD] shadow-md border border-[#2E6B47]/40">
            <Leaf className="w-6 h-6" />
          </div>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
