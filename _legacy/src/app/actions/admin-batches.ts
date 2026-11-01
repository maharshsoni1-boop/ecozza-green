"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveBatchReportAction(data: {
  id?: string;
  batchNumber: string;
  productId?: string;
  testDate?: string;
  labName?: string;
  labReportPdfUrl?: string;
  carbonPercentage?: number;
  phValue?: number;
  moisturePercentage?: number;
  granuleSizeMm?: string;
  bulkDensity?: number;
  heavyMetalsSummary?: string;
  notes?: string;
  isVerified?: boolean;
}) {
  try {
    const payload = {
      batchNumber: data.batchNumber.trim(),
      productId: data.productId || null,
      testDate: data.testDate ? new Date(data.testDate) : null,
      labName: data.labName?.trim() || null,
      labReportPdfUrl: data.labReportPdfUrl?.trim() || null,
      carbonPercentage: data.carbonPercentage || null,
      phValue: data.phValue || null,
      moisturePercentage: data.moisturePercentage || null,
      granuleSizeMm: data.granuleSizeMm?.trim() || null,
      bulkDensity: data.bulkDensity || null,
      heavyMetalsSummary: data.heavyMetalsSummary?.trim() || null,
      notes: data.notes?.trim() || null,
      isVerified: data.isVerified ?? false,
    };

    if (data.id) {
      await prisma.batchLabReport.update({
        where: { id: data.id },
        data: payload,
      });
    } else {
      await prisma.batchLabReport.create({
        data: payload,
      });
    }

    revalidatePath("/admin/batches");
    revalidatePath("/lab-reports");
    revalidatePath("/products/[slug]", "page");
    return { success: true };
  } catch (err: any) {
    console.error("Batch save error:", err);
    return { success: false, error: err.message || "Failed to save batch report." };
  }
}
