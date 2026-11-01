"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateReviewApprovalAction(id: string, isApproved: boolean) {
  try {
    await prisma.review.update({
      where: { id },
      data: { isApproved },
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    revalidatePath("/products/[slug]", "page");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteReviewAction(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    revalidatePath("/products/[slug]", "page");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
