import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import Link from "next/link";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Product Not Found | Ecozza Green",
    };
  }

  return {
    title: `${product.name} | Ecozza Green`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Ecozza Green`,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { weightKg: "asc" },
      },
      batchReports: {
        orderBy: { testDate: "desc" },
        take: 1,
      },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      isPublished: true,
    },
    take: 3,
  });

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: JSON.parse(product.images || "[]"),
    description: product.shortDescription,
    sku: product.variants[0]?.sku,
    brand: {
      "@type": "Brand",
      name: "Ecozza Green",
    },
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      url: `https://ecozzagreen.in/products/${product.slug}`,
      priceCurrency: "INR",
      price: v.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        v.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    })),
  };

  return (
    <div className="py-10 bg-[#FAF8F5] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#58635B]">
          <Link href="/" className="hover:text-[#121614] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#121614] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#121614] line-clamp-1">
            {product.name}
          </span>
        </div>

        {/* Client PDP Component */}
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </div>
    </div>
  );
}
