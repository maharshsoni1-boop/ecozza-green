import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return { title: "Article Not Found | Ecozza Green" };
  }

  return {
    title: `${post.title} | Ecozza Green Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <div className="py-12 bg-[#FAF8F5] min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58635B] hover:text-[#121614]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-[#58635B]">
            <span className="badge-carbon text-[10px]">Soil Agronomy</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#2E6B47]" />
              <span>{new Date(post.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#2E6B47]" />
              <span>{post.author}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121614] font-heading leading-tight">
            {post.title}
          </h1>

          <p className="text-sm text-[#58635B] italic leading-relaxed border-l-2 border-[#2E6B47] pl-4">
            {post.excerpt}
          </p>
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="rounded-3xl overflow-hidden bg-white border border-[#E5E0D6] shadow-sm">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-[360px] object-cover"
            />
          </div>
        )}

        {/* Markdown Content */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E0D6] shadow-2xs text-xs sm:text-sm text-[#58635B] space-y-4 leading-relaxed whitespace-pre-line">
          {post.contentMarkdown}
        </div>

        {/* Share & Dosing CTA */}
        <div className="bg-[#121614] text-white p-6 rounded-3xl border border-[#28302C] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold font-heading text-white">
              Want to see how many bags you need for this crop?
            </h4>
            <p className="text-xs text-[#A8B2AC]">
              Use our interactive dose calculator with your specific soil type.
            </p>
          </div>
          <Link
            href="/dose-calculator"
            className="px-4 py-2 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors shrink-0"
          >
            Open Calculator
          </Link>
        </div>
      </article>
    </div>
  );
}
