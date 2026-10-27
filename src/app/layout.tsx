import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CookieBanner } from "@/components/layout/CookieBanner";

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ecozzagreen.in"),
  title: {
    default: "Ecozza Green | Granular Biochar Soil Conditioner (Gujarat, India)",
    template: "%s | Ecozza Green",
  },
  description:
    "Official store for Ecozza Green biochar soil conditioner granules. Manufactured in Gujarat, India to improve soil water retention, microbial life, and nutrient holding capacity.",
  keywords: [
    "Ecozza Green",
    "biochar granules",
    "soil conditioner India",
    "biochar Gujarat",
    "organic soil amendment",
    "potting mix biochar",
    "agricultural biochar India",
  ],
  authors: [{ name: "Ecozza Green" }],
  creator: "Ecozza Green",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ecozzagreen.in",
    siteName: "Ecozza Green",
    title: "Ecozza Green | Granular Biochar Soil Conditioner",
    description:
      "Carbon-rich granular biochar soil conditioner made in Gujarat, India for nurseries, farmers, and home gardeners.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ecozza Green",
    url: "https://ecozzagreen.in",
    logo: "https://ecozzagreen.in/images/ecozza-green-logo.png",
    description:
      "Ecozza Green manufactures high-grade granular biochar soil conditioners in Gujarat, India to improve water and nutrient retention.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-98765-43210",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
  };

  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#121614] antialiased selection:bg-[#2E6B47] selection:text-white">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <CookieBanner />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
