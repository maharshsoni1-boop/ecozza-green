"use client";

import React, { useState } from "react";
import { updateReviewApprovalAction, deleteReviewAction } from "@/app/actions/admin-reviews";
import { Star, Check, X, Trash2 } from "lucide-react";

interface ReviewRecord {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
  isApproved: boolean;
  createdAt: Date;
  product: {
    name: string;
  };
}

export function AdminReviewsManager({ initialReviews }: { initialReviews: ReviewRecord[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleApproval = async (id: string, current: boolean) => {
    setUpdatingId(id);
    const res = await updateReviewApprovalAction(id, !current);
    if (res.success) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved: !current } : r))
      );
    }
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this review?")) return;
    const res = await deleteReviewAction(id);
    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-xs text-[#58635B]">
        Showing <strong>{reviews.length}</strong> buyer reviews. Only approved reviews appear publicly.
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E5E0D6] text-center text-xs text-[#58635B]">
            No customer reviews submitted yet.
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-3 hover:shadow-2xs transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EFEBE1]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#121614] font-heading">
                      {rev.reviewerName}
                    </span>
                    {rev.isVerifiedBuyer && (
                      <span className="badge-carbon text-[10px]">Verified Buyer</span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.isApproved
                          ? "bg-[#E9F4EE] text-[#2E6B47]"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {rev.isApproved ? "Approved & Live" : "Pending Moderation"}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#58635B] mt-0.5">
                    Product: <strong>{rev.product.name}</strong> • {new Date(rev.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                    disabled={updatingId === rev.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      rev.isApproved
                        ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                        : "bg-[#1E3A2B] text-white hover:bg-[#2E6B47]"
                    }`}
                  >
                    {rev.isApproved ? (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Review</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    title="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[#C06D38]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C06D38]" />
                  ))}
                  <span className="text-xs font-bold text-[#121614] ml-2">
                    "{rev.title}"
                  </span>
                </div>
                <p className="text-xs text-[#58635B] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
