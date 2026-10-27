"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveDoseRuleAction(data: {
  id?: string;
  plantCategory: string;
  cropName: string;
  unitType: string;
  soilType: string;
  recommendedDoseGrams: number;
  bagRecommendationText?: string;
  notes?: string;
}) {
  try {
    const payload = {
      plantCategory: data.plantCategory.trim(),
      cropName: data.cropName.trim(),
      unitType: data.unitType.trim(),
      soilType: data.soilType.trim(),
      recommendedDoseGrams: data.recommendedDoseGrams,
      bagRecommendationText: data.bagRecommendationText?.trim() || null,
      notes: data.notes?.trim() || null,
    };

    if (data.id) {
      await prisma.doseRule.update({
        where: { id: data.id },
        data: payload,
      });
    } else {
      await prisma.doseRule.create({
        data: payload,
      });
    }

    revalidatePath("/admin/dose-table");
    revalidatePath("/dose-calculator");
    return { success: true };
  } catch (err: any) {
    console.error("Dose rule save error:", err);
    return { success: false, error: err.message || "Failed to save dose rule." };
  }
}

export async function deleteDoseRuleAction(id: string) {
  try {
    await prisma.doseRule.delete({ where: { id } });
    revalidatePath("/admin/dose-table");
    revalidatePath("/dose-calculator");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
