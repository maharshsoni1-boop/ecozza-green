"use client";

import React, { useState } from "react";
import { updateVariantStockAction, updateVariantPriceAction } from "@/app/actions/admin-products";
import { Package, Check, Save, AlertTriangle } from "lucide-react";

interface Variant {
  id: string;
  title: string;
  weightKg: number;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stockQuantity: number;
  isBulkQuoteOnly: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  hsnCode: string;
  variants: Variant[];
}

export function AdminProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleStockSave = async (variantId: string, currentVal: number) => {
    const input = document.getElementById(`stock-${variantId}`) as HTMLInputElement;
    if (!input) return;
    const newStock = parseInt(input.value, 10);
    if (isNaN(newStock) || newStock < 0) return;

    const res = await updateVariantStockAction(variantId, newStock);
    if (res.success) {
      setSavedId(variantId);
      setTimeout(() => setSavedId(null), 1500);
    }
  };

  const handlePriceSave = async (variantId: string) => {
    const priceInput = document.getElementById(`price-${variantId}`) as HTMLInputElement;
    const compareInput = document.getElementById(`compare-${variantId}`) as HTMLInputElement;
    if (!priceInput) return;

    const newPrice = parseFloat(priceInput.value);
    const comparePrice = compareInput && compareInput.value ? parseFloat(compareInput.value) : null;
    if (isNaN(newPrice) || newPrice < 0) return;

    const res = await updateVariantPriceAction(variantId, newPrice, comparePrice);
    if (res.success) {
      setSavedId(variantId);
      setTimeout(() => setSavedId(null), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white p-6 rounded-3xl border border-[#E5E0D6] space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE1]">
            <div>
              <span className="badge-carbon text-[10px] mb-1">{product.category}</span>
              <h2 className="text-base font-bold font-heading text-[#121614]">
                {product.name}
              </h2>
              <div className="text-xs text-[#58635B] mt-0.5">HSN Code: {product.hsnCode}</div>
            </div>
          </div>

          {/* Variants Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#EFEBE1] text-left text-[#58635B]">
                  <th className="pb-2 font-semibold">Format / Size</th>
                  <th className="pb-2 font-semibold">SKU</th>
                  <th className="pb-2 font-semibold">Weight</th>
                  <th className="pb-2 font-semibold">Price (₹)</th>
                  <th className="pb-2 font-semibold">Compare (₹)</th>
                  <th className="pb-2 font-semibold">Inventory Stock</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F5]">
                {product.variants.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FAF8F5]/80">
                    <td className="py-3 font-bold text-[#121614]">
                      {v.title}
                      {v.isBulkQuoteOnly && (
                        <span className="ml-2 badge-earth text-[9px]">Quote Only</span>
                      )}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-[#58635B]">{v.sku}</td>
                    <td className="py-3">{v.weightKg} kg</td>
                    <td className="py-3">
                      <input
                        type="number"
                        id={`price-${v.id}`}
                        defaultValue={v.price}
                        className="w-20 px-2 py-1 rounded-md border border-[#E5E0D6] text-xs font-semibold bg-white"
                      />
                    </td>
                    <td className="py-3">
                      <input
                        type="number"
                        id={`compare-${v.id}`}
                        defaultValue={v.compareAtPrice || ""}
                        placeholder="None"
                        className="w-20 px-2 py-1 rounded-md border border-[#E5E0D6] text-xs bg-white text-[#8C978F]"
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          id={`stock-${v.id}`}
                          defaultValue={v.stockQuantity}
                          className="w-20 px-2 py-1 rounded-md border border-[#E5E0D6] text-xs font-bold bg-white"
                        />
                        {v.stockQuantity <= 25 && !v.isBulkQuoteOnly && (
                          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            handlePriceSave(v.id);
                            handleStockSave(v.id, v.stockQuantity);
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            savedId === v.id
                              ? "bg-[#2E6B47] text-white"
                              : "bg-[#1E3A2B] hover:bg-[#2E6B47] text-white"
                          }`}
                        >
                          {savedId === v.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
