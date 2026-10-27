"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLeadStatusAction(id: string, status: string, adminNotes?: string) {
  try {
    const data: any = { status };
    if (adminNotes !== undefined) data.adminNotes = adminNotes;

    await prisma.leadEnquiry.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
