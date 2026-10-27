"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateVariantStockAction(variantId: string, newStock: number) {
  try {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity: newStock },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    console.error("Stock update error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateVariantPriceAction(
  variantId: string,
  newPrice: number,
  compareAtPrice: number | null
) {
  try {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { price: newPrice, compareAtPrice },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    console.error("Price update error:", err);
    return { success: false, error: err.message };
  }
}
