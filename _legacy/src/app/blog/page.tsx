import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, ArrowRight, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Agronomy & Soil Health Blog | Ecozza Green",
  description:
    "Expert agronomic articles, research insights on soil porosity, biochar charging techniques, and soil organic carbon restoration.",
};

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F4EE] text-[#1E3A2B] text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-[#2E6B47]" />
            <span>Agronomic Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading">
            Soil Health & Biochar Insights
          </h1>
          <p className="text-xs sm:text-sm text-[#58635B] leading-relaxed">
            Practical science, field application trials, and expert guidance from the Ecozza Green Agronomy Team in Gujarat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-[#E5E0D6] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="h-48 overflow-hidden bg-[#FAF8F5] relative">
                <img
                  src={post.coverImageUrl || "/images/biochar-hero.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-[#8C978F]">
                    <Calendar className="w-3.5 h-3.5 text-[#2E6B47]" />
                    <span>{new Date(post.createdAt).toLocaleDateString("en-IN")}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-base font-bold font-heading text-[#121614] hover:text-[#2E6B47] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-[#58635B] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E6B47] hover:text-[#1E3A2B] pt-2"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
