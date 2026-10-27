"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, Filter, SlidersHorizontal, RefreshCcw, Sparkles } from "lucide-react";

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
  slug: string;
  name: string;
  tagline: string | null;
  shortDescription: string;
  category: string;
  images: string;
  variants: Variant[];
}

interface ShopClientProps {
  initialProducts: Product[];
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedWeight, setSelectedWeight] = useState<number | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "weight-asc">("price-asc");

  const categories = [
    { label: "All Formats", value: "ALL" },
    { label: "Home & Garden", value: "Home & Garden" },
    { label: "Nursery & Propagation", value: "Nursery & Propagation" },
    { label: "Orchards & Trees", value: "Orchards & Trees" },
    { label: "Commercial Farming", value: "Commercial Farming" },
  ];

  const weightOptions = [
    { label: "All Sizes", value: "ALL" },
    { label: "5 kg Bags", value: 5 },
    { label: "10 kg Bags", value: 10 },
    { label: "25 kg Bags", value: 25 },
    { label: "1 Tonne Bulk", value: 1000 },
  ];

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchTagline = (product.tagline || "").toLowerCase().includes(q);
          const matchDesc = product.shortDescription.toLowerCase().includes(q);
          if (!matchName && !matchTagline && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== "ALL" && product.category !== selectedCategory) {
          return false;
        }

        // Weight filter (product must have a variant with matching weight)
        if (selectedWeight !== "ALL") {
          const hasVariant = product.variants.some((v) => v.weightKg === selectedWeight);
          if (!hasVariant) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const minPriceA = Math.min(...a.variants.map((v) => v.price));
        const minPriceB = Math.min(...b.variants.map((v) => v.price));

        if (sortBy === "price-asc") return minPriceA - minPriceB;
        if (sortBy === "price-desc") return minPriceB - minPriceA;
        if (sortBy === "weight-asc") {
          const minWeightA = Math.min(...a.variants.map((v) => v.weightKg));
          const minWeightB = Math.min(...b.variants.map((v) => v.weightKg));
          return minWeightA - minWeightB;
        }
        return 0;
      });
  }, [initialProducts, searchQuery, selectedCategory, selectedWeight, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedWeight("ALL");
    setSortBy("price-asc");
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8C978F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, plant type, or bag size..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#2E6B47] focus:ring-2 focus:ring-[#2E6B47]/10 transition-all bg-[#FAF8F5]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#58635B] font-medium shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#2E6B47]" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl border border-[#E5E0D6] bg-[#FAF8F5] text-[#121614] font-medium focus:outline-hidden focus:border-[#2E6B47]"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="weight-asc">Bag Size: Small to Large</option>
            </select>

            {(searchQuery || selectedCategory !== "ALL" || selectedWeight !== "ALL") && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#C06D38] hover:text-[#A55724] hover:bg-[#FBF0E6] rounded-xl transition-colors"
                title="Reset all filters"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-3 border-t border-[#EFEBE1] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#58635B] mr-2">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-[#1E3A2B] text-white shadow-xs"
                    : "bg-[#FAF8F5] text-[#58635B] hover:text-[#121614] hover:bg-[#EFEBE1]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Pack Weight Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#58635B] mr-2">
              Pack Weight:
            </span>
            {weightOptions.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setSelectedWeight(opt.value as any)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  selectedWeight === opt.value
                    ? "bg-[#C06D38] text-white shadow-xs"
                    : "bg-[#FAF8F5] text-[#58635B] hover:text-[#121614] hover:bg-[#EFEBE1]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-[#58635B]">
          Showing <strong>{filteredProducts.length}</strong> soil conditioner products
        </div>
        <div className="text-xs text-[#2E6B47] font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>All prices include 5% GST & lab test transparency</span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E0D6] p-12 text-center max-w-md mx-auto space-y-3">
          <Filter className="w-8 h-8 mx-auto text-[#8C978F]" />
          <h3 className="text-base font-bold text-[#121614] font-heading">
            No matching products found
          </h3>
          <p className="text-xs text-[#58635B]">
            Try adjusting your search keywords or clearing active size and category filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3A2B] text-white text-xs font-semibold hover:bg-[#2E6B47] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
