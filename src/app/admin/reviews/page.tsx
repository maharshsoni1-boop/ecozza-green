import React from "react";
import prisma from "@/lib/prisma";
import { AdminReviewsManager } from "@/components/admin/AdminReviewsManager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-[#121614]">
          Customer Reviews & Moderation
        </h1>
        <p className="text-xs text-[#58635B] mt-1">
          Review, approve, or reject customer feedback. Only verified purchaser reviews can be made public.
        </p>
      </div>

      <AdminReviewsManager initialReviews={reviews} />
    </div>
  );
}
