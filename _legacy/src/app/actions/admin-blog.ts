"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveBlogPostAction(data: {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  coverImageUrl?: string;
  author?: string;
  isPublished?: boolean;
}) {
  try {
    const payload = {
      title: data.title.trim(),
      slug: data.slug.trim().toLowerCase(),
      excerpt: data.excerpt.trim(),
      contentMarkdown: data.contentMarkdown,
      coverImageUrl: data.coverImageUrl?.trim() || null,
      author: data.author?.trim() || "Ecozza Green Agronomy Team",
      isPublished: data.isPublished ?? false,
      publishedAt: data.isPublished ? new Date() : null,
    };

    if (data.id) {
      await prisma.blogPost.update({
        where: { id: data.id },
        data: payload,
      });
    } else {
      await prisma.blogPost.create({
        data: payload,
      });
    }

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save blog post." };
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
