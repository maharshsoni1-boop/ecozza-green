"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/app/actions/admin-auth";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FlaskConical,
  Calculator,
  Inbox,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Leaf,
  Layers,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders & Shipping", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products & Stock", href: "/admin/products", icon: Package },
    { label: "Batches & Lab Data", href: "/admin/batches", icon: FlaskConical },
    { label: "Dose Calculator Rules", href: "/admin/dose-table", icon: Calculator },
    { label: "B2B Enquiries CRM", href: "/admin/leads", icon: Inbox },
    { label: "Review Moderation", href: "/admin/reviews", icon: Star },
    { label: "Settings & FCO", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-[#121614] text-[#EFEBE1] border-r border-[#28302C] flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#28302C]">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#2E6B47] shadow-xs">
            <Image
              src="/icon-circle.png"
              alt="Ecozza Green Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-heading">Ecozza Green</div>
            <div className="text-[10px] text-[#8DE0AD] uppercase tracking-wider font-semibold">
              Admin Console
            </div>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="p-4 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-[#1E3A2B] text-white shadow-xs"
                  : "text-[#A8B2AC] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#8DE0AD]" : "text-[#8C978F]"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#28302C] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#A8B2AC] hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>View Public Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
