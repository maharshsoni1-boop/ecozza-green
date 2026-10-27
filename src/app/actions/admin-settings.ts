"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSystemSettingsAction(settingsMap: Record<string, string>) {
  try {
    for (const [key, value] of Object.entries(settingsMap)) {
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/products/[slug]", "page");
    return { success: true };
  } catch (err: any) {
    console.error("Settings save error:", err);
    return { success: false, error: err.message || "Failed to update settings." };
  }
}
