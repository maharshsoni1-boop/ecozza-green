import React from "react";
import prisma from "@/lib/prisma";
import { AdminBlogManager } from "@/components/admin/AdminBlogManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Agronomy Articles & Agronomic Guides CMS
        </h1>
        <p className="text-xs text-[#58635B] mt-1">
          Compose educational guides on soil structure, high porosity carbon matrices, and composting.
        </p>
      </div>

      <AdminBlogManager initialPosts={posts} />
    </div>
  );
}
