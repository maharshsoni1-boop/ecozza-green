
import React, { useState, useEffect } from 'react'
import {
  ShoppingBag,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  PhoneCall,
  FileCheck,
  Truck,
  Building2,
  FileText,
  Info,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { DoseCalculator } from '@/components/DoseCalculator'
import { TrackOrder } from '@/components/TrackOrder'
import { LabReports } from '@/components/LabReports'
import { B2BEnquiry } from '@/components/B2BEnquiry'
import { WhyBiochar } from '@/components/WhyBiochar'
import { HowToUse } from '@/components/HowToUse'
import { AboutContact } from '@/components/AboutContact'
import { PolicyModal, type PolicyKey } from '@/components/PolicyModal'
import { CheckoutDrawer, type CartItem } from '@/components/CheckoutDrawer'
import { ProductDetail, type Product, type ProductVariant } from '@/components/ProductDetail'

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Ecozza Premium Organic Biochar',
    slug: 'ecozza-premium-biochar',
    category: 'Soil Conditioner',
    tagline: 'Micro-porous granules designed for water & nutrient retention in pots and garden beds',
    shortDescription: 'High-surface area activated biochar for superior moisture retention & microbial aeration.',
    description: `### Pure Carbon Matrix for Thriving Roots
Ecozza Green Garden Grade Granules are produced through controlled thermal carbonization of clean woody biomass, followed by biological charging. 

#### Key Attributes:
- **High Porosity:** Microscopic honeycomb pore structure acts as a permanent sponge for soil moisture.
- **Nutrient Sponge:** Retains applied plant nutrients, reducing leaching during watering.
- **Soil Aeration:** Prevents potting soil compaction, encouraging fibrous root expansion.
- **Long-term Stability:** Biochar does not decompose rapidly like raw compost, providing structural soil improvement for years.`,
    hsnCode: '31059090',
    gstRatePercentage: 5,
    scoopSizeGrams: 50,
    dosePerPotGrams: 100,
    dosePerTreeGrams: 500,
    imagesList: ['/images/product-biochar.jpg'],
    variants: [
      { id: 'v1', title: '5 kg Bag', weightKg: 5, price: 499, compareAtPrice: 599, stockQuantity: 180, sku: 'EG-GARD-5KG' },
      { id: 'v2', title: '10 kg Pack', weightKg: 10, price: 899, compareAtPrice: 1199, stockQuantity: 95, sku: 'EG-GARD-10KG' },
      { id: 'v3', title: '25 kg Farm Sack', weightKg: 25, price: 1899, compareAtPrice: 2499, stockQuantity: 40, sku: 'EG-GARD-25KG' },
    ],
  },
  {
    id: 'prod-2',
    name: 'Ecozza Microbe-Inoculated Biochar',
    slug: 'ecozza-inoculated-biochar',
    category: 'Bio-Fertilizer Enriched',
    tagline: 'Pre-charged with mycorrhizae and beneficial indigenous soil bacteria',
    shortDescription: 'Pre-charged with mycorrhizae and beneficial indigenous soil bacteria for immediate rooting power.',
    description: `### Bio-Charged Microbial Inoculated Carbon
Pre-activated with beneficial mycorrhizal fungi strains and rhizosphere bacteria. Eliminates initial nutrient tie-up and kickstarts living biology immediately upon soil blending.`,
    hsnCode: '31059090',
    gstRatePercentage: 5,
    scoopSizeGrams: 50,
    dosePerPotGrams: 80,
    dosePerTreeGrams: 400,
    imagesList: ['/images/product-inoculated.jpg'],
    variants: [
      { id: 'v4', title: '5 kg Enriched Bag', weightKg: 5, price: 649, compareAtPrice: 799, stockQuantity: 70, sku: 'EG-NURS-10KG' },
      { id: 'v5', title: '15 kg Orchard Pack', weightKg: 15, price: 1699, compareAtPrice: 2199, stockQuantity: 85, sku: 'EG-NURS-25KG' },
    ],
  },
  {
    id: 'prod-3',
    name: 'Ecozza Urban Green Potting Mix',
    slug: 'ecozza-urban-potting-mix',
    category: 'Nursery & Terrace',
    tagline: 'Ready-to-use potting blend with 20% carbon matrix for terrace gardens',
    shortDescription: 'Ready-to-use potting blend with 20% carbon matrix for terrace gardens, indoor plants & bonsai.',
    description: `### Premium Urban Potting Blend
Designed for container plants, elevated garden beds, indoor tropicals, and rooftop planters. Maintains aeration, prevents root rot, and buffers high midday temperatures.`,
    hsnCode: '31059090',
    gstRatePercentage: 5,
    scoopSizeGrams: 50,
    dosePerPotGrams: 150,
    dosePerTreeGrams: 1000,
    imagesList: ['/images/product-potting.jpg'],
    variants: [
      { id: 'v6', title: '3 kg Pouch', weightKg: 3, price: 349, compareAtPrice: 420, stockQuantity: 160, sku: 'EG-FARM-25KG' },
      { id: 'v7', title: '10 kg Sack', weightKg: 10, price: 799, compareAtPrice: 999, stockQuantity: 15, sku: 'EG-FARM-1T' },
    ],
  },
]

import { apiUrl } from '@/lib/api'

export default function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'calculator' | 'how-to-use' | 'track' | 'lab' | 'b2b' | 'why' | 'about'>('shop')
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null)

  // Fetch real products from server
  useEffect(() => {
    fetch(apiUrl('/api/products'))
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setProducts(json.data)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const initialMap: Record<string, ProductVariant> = {}
    products.forEach((p) => {
      if (p.variants && p.variants.length > 0) {
        initialMap[p.id] = p.variants[0]
      }
    })
    setSelectedVariants(initialMap)
  }, [products])

  const addToCart = (product: Product, customVariant?: ProductVariant, quantity: number = 1) => {
    const variant = customVariant || selectedVariants[product.id] || product.variants[0]
    if (!variant) return

    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id)
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [
        ...prev,
        {
          variantId: variant.id,
          productName: product.name,
          variantTitle: variant.title,
          price: variant.price,
          weightKg: variant.weightKg,
          quantity,
          image: product.imagesList?.[0] || '/images/product-biochar.jpg',
        },
      ]
    })
    setIsCheckoutOpen(true)
  }

  const addRecommendedToCart = (title: string, weightKg: number, price: number) => {
    const matchedProduct = products.find((p) => p.variants && p.variants.some((v) => Math.abs(v.weightKg - weightKg) < 0.5)) || products[0]
    const matchedVariant = matchedProduct?.variants.find((v) => Math.abs(v.weightKg - weightKg) < 0.5) || matchedProduct?.variants[0]
    const variantId = matchedVariant ? matchedVariant.id : `rec-${Date.now()}`

    setCart((prev) => {
      const existing = prev.find((item) => item.productName === title)
      if (existing) {
        return prev.map((item) =>
          item.productName === title ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [
        ...prev,
        {
          variantId,
          productName: title,
          variantTitle: matchedVariant ? matchedVariant.title : `${weightKg} kg Pack`,
          price: matchedVariant ? matchedVariant.price : price,
          weightKg,
          quantity: 1,
          image: matchedProduct?.imagesList?.[0] || '/images/product-biochar.jpg',
        },
      ]
    })
    setIsCheckoutOpen(true)
  }

  const updateQuantity = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>FCO Compliant 100% Organic Soil Carbon | Pan-India Doorstep Logistics via Shiprocket</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              setActiveTab('shop')
              setSelectedProduct(null)
            }}
            className="flex items-center gap-3 text-left"
          >
            <img
              src="/logo.png"
              alt="Ecozza Green"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                // Fallback to icon if logo is not loaded
                (e.target as HTMLElement).style.display = 'none'
              }}
            />
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-950 flex items-center gap-1">
                Ecozza <span className="text-emerald-600 font-extrabold">Green</span>
              </span>
              <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase -mt-1">
                Regenerative Soil Carbon
              </p>
            </div>
          </button>

          {/* Navigation Links (Note: Direct admin button removed as requested) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <button
              onClick={() => {
                setActiveTab('shop')
                setSelectedProduct(null)
              }}
              className={`hover:text-emerald-700 transition ${activeTab === 'shop' && !selectedProduct ? 'text-emerald-800 font-bold' : ''}`}
            >
              Shop Biochar
            </button>
            <button
              onClick={() => {
                setActiveTab('calculator')
                setSelectedProduct(null)
              }}
              className={`flex items-center gap-1 hover:text-emerald-700 transition ${activeTab === 'calculator' ? 'text-emerald-800 font-bold' : ''}`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              Dose Calculator
            </button>
            <button
              onClick={() => {
                setActiveTab('how-to-use')
                setSelectedProduct(null)
              }}
              className={`flex items-center gap-1 hover:text-emerald-700 transition ${activeTab === 'how-to-use' ? 'text-emerald-800 font-bold' : ''}`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              How to Apply
            </button>
            <button
              onClick={() => {
                setActiveTab('lab')
                setSelectedProduct(null)
              }}
              className={`flex items-center gap-1 hover:text-emerald-700 transition ${activeTab === 'lab' ? 'text-emerald-800 font-bold' : ''}`}
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              Lab Reports
            </button>
            <button
              onClick={() => {
                setActiveTab('b2b')
                setSelectedProduct(null)
              }}
              className={`flex items-center gap-1 hover:text-emerald-700 transition ${activeTab === 'b2b' ? 'text-emerald-800 font-bold' : ''}`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              B2B Bulk Quotes
            </button>
            <button
              onClick={() => {
                setActiveTab('track')
                setSelectedProduct(null)
              }}
              className={`flex items-center gap-1 hover:text-emerald-700 transition ${activeTab === 'track' ? 'text-emerald-800 font-bold' : ''}`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              Track Order
            </button>
            <button
              onClick={() => {
                setActiveTab('why')
                setSelectedProduct(null)
              }}
              className={`hover:text-emerald-700 transition ${activeTab === 'why' ? 'text-emerald-800 font-bold' : ''}`}
            >
              Why Biochar?
            </button>
            <button
              onClick={() => {
                setActiveTab('about')
                setSelectedProduct(null)
              }}
              className={`hover:text-emerald-700 transition ${activeTab === 'about' ? 'text-emerald-800 font-bold' : ''}`}
            >
              About Us
            </button>
          </nav>

          {/* Cart Trigger */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCheckoutOpen(true)}
              className="relative bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 font-bold text-xs"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              <span>Cart</span>
              {totalItemsCount > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-xs font-bold bg-emerald-950 text-white rounded-full">
                  {totalItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* TAB 1: SHOP STOREFRONT */}
        {activeTab === 'shop' && (
          selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              onAddToCart={(prod, variant, qty) => addToCart(prod, variant, qty)}
              onBuyNow={(prod, variant, qty) => {
                addToCart(prod, variant, qty)
                setIsCheckoutOpen(true)
              }}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenCalculator={() => {
                setSelectedProduct(null)
                setActiveTab('calculator')
              }}
              onOpenB2B={() => {
                setSelectedProduct(null)
                setActiveTab('b2b')
              }}
              allProducts={products}
            />
          ) : (
            <div className="space-y-16">
              {/* Hero Section with biochar-hero image background */}
              <section className="relative overflow-hidden rounded-3xl border border-emerald-100/50 shadow-sm">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('/images/biochar-hero.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-slate-950/80 backdrop-blur-[2px]" />

                <div className="relative z-10 p-8 sm:p-14 text-white max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-6 border border-emerald-400/30">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    FCO Certified & Certified NABL Lab Tested Batches
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                    Heal Your Soil with High-Purity <span className="text-emerald-400">Biochar</span>.
                  </h1>
                  <p className="mt-5 text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
                    Retain 40% more moisture, unlock dormant fertilizer nutrients, and enrich your microbial root rhizosphere with certified organic biochar. Formulated for pots, orchards, and high-yield farms.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4 items-center">
                    <Button
                      size="lg"
                      onClick={() => {
                        document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-700/25 px-8 font-bold"
                    >
                      Shop Biochar Bags <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(null)
                        setActiveTab('calculator')
                      }}
                      className="border-emerald-300/40 text-emerald-100 bg-white/10 hover:bg-white/20 font-bold backdrop-blur-sm"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Estimate Quantity for My Land
                    </Button>
                  </div>
                </div>
              </section>

              {/* Product Catalog Grid */}
              <section id="products-grid">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <Badge variant="secondary" className="mb-2 text-emerald-800 bg-emerald-100">
                      Certified Soil Conditioner
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                      Ecozza Soil Care Products
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                      Click any product to check live stock, inspect lab specs, and test delivery to your pincode.
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Showing {products.length} lab-tested products
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => {
                    const currentVariant = selectedVariants[product.id] || product.variants[0]
                    return (
                      <Card
                        key={product.id}
                        className="overflow-hidden border border-emerald-100/80 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group bg-white"
                      >
                        <div>
                          {/* Image with Click to Detail */}
                          <div
                            onClick={() => setSelectedProduct(product)}
                            className="relative h-56 bg-slate-100 overflow-hidden cursor-pointer"
                          >
                            <img
                              src={product.imagesList?.[0] || '/images/product-biochar.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/product-biochar.jpg'
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                            <div className="flex justify-between items-start absolute top-3 left-3 right-3 z-10">
                              <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                                {product.category}
                              </span>
                              <span className="text-[11px] font-semibold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 border border-white/20">
                                <FileCheck className="w-3 h-3 text-emerald-400" /> FCO Tested
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-4 right-4 z-10">
                              <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md group-hover:text-emerald-300 transition-colors">
                                {product.name}
                              </h3>
                            </div>
                          </div>

                          <CardHeader
                            onClick={() => setSelectedProduct(product)}
                            className="pb-3 pt-4 cursor-pointer"
                          >
                            <CardDescription className="text-slate-600 text-xs line-clamp-2">
                              {product.shortDescription}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4 pt-0">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Choose Pack Size
                                </label>
                                {currentVariant?.stockQuantity !== undefined && (
                                  <span
                                    className={`text-[11px] font-bold flex items-center gap-1 ${
                                      currentVariant.stockQuantity <= 20
                                        ? 'text-amber-700'
                                        : 'text-emerald-700'
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        currentVariant.stockQuantity <= 20
                                          ? 'bg-amber-500'
                                          : 'bg-emerald-500'
                                      }`}
                                    />
                                    {currentVariant.stockQuantity <= 20
                                      ? `Only ${currentVariant.stockQuantity} left`
                                      : `${currentVariant.stockQuantity} in stock`}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {product.variants.map((v) => {
                                  const isSelected = currentVariant?.id === v.id
                                  return (
                                    <button
                                      key={v.id}
                                      onClick={() =>
                                        setSelectedVariants((prev) => ({ ...prev, [product.id]: v }))
                                      }
                                      className={`text-xs py-1.5 px-2 rounded-lg border font-medium transition ${
                                        isSelected
                                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-sm'
                                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                                      }`}
                                    >
                                      {v.title}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>

                            <div className="flex items-baseline gap-2 pt-1">
                              <span className="text-2xl font-black text-slate-900">
                                ₹{currentVariant?.price || 0}
                              </span>
                              {currentVariant?.compareAtPrice && (
                                <span className="text-sm line-through text-slate-400">
                                  ₹{currentVariant.compareAtPrice}
                                </span>
                              )}
                              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">
                                Incl. 5% GST
                              </span>
                            </div>
                          </CardContent>
                        </div>

                        <CardFooter className="pt-2 pb-5 border-t border-slate-100 flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedProduct(product)}
                            className="w-1/2 border-emerald-600/70 text-emerald-800 hover:bg-emerald-50 font-bold text-xs"
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => addToCart(product, currentVariant)}
                            className="w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                            Add to Cart
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </section>
            </div>
          )
        )}

        {/* TAB 2: DOSE CALCULATOR */}
        {activeTab === 'calculator' && (
          <DoseCalculator onAddRecommended={addRecommendedToCart} />
        )}

        {/* TAB 3: HOW TO APPLY */}
        {activeTab === 'how-to-use' && <HowToUse />}

        {/* TAB 4: TRACK ORDER */}
        {activeTab === 'track' && <TrackOrder />}

        {/* TAB 5: LAB REPORTS */}
        {activeTab === 'lab' && <LabReports />}

        {/* TAB 6: B2B BULK QUOTES */}
        {activeTab === 'b2b' && <B2BEnquiry />}

        {/* TAB 7: WHY BIOCHAR */}
        {activeTab === 'why' && <WhyBiochar />}

        {/* TAB 8: ABOUT & CONTACT */}
        {activeTab === 'about' && <AboutContact />}
      </main>

      {/* Cart & Checkout Drawer */}
      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onClearCart={() => setCart([])}
      />

      {/* Policy Modal */}
      <PolicyModal policyKey={activePolicy} onClose={() => setActivePolicy(null)} />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Ecozza Green" className="h-6 w-auto" />
              <span className="font-bold text-white text-base">Ecozza Green</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's premium biomass pyrolysis soil conditioner. NABL tested, FCO compliant, and sequestering carbon permanently.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
            <div className="flex flex-col space-y-1.5 text-xs text-slate-400">
              <button onClick={() => { setActiveTab('shop'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-left hover:text-white">Shop Catalog</button>
              <button onClick={() => setActiveTab('calculator')} className="text-left hover:text-white">Dose Calculator</button>
              <button onClick={() => setActiveTab('how-to-use')} className="text-left hover:text-white">How to Apply Guide</button>
              <button onClick={() => setActiveTab('lab')} className="text-left hover:text-white">Certified Lab Reports</button>
              <button onClick={() => setActiveTab('b2b')} className="text-left hover:text-white">B2B Bulk Quotes</button>
              <button onClick={() => setActiveTab('track')} className="text-left hover:text-white">Track Order</button>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Compliance & Policies</h4>
            <div className="flex flex-col space-y-1.5 text-xs text-slate-400">
              <button onClick={() => setActivePolicy('privacy')} className="text-left hover:text-white">Privacy Policy</button>
              <button onClick={() => setActivePolicy('terms')} className="text-left hover:text-white">Terms of Sale</button>
              <button onClick={() => setActivePolicy('shipping')} className="text-left hover:text-white">Shipping & Freight Policy</button>
              <button onClick={() => setActivePolicy('returns')} className="text-left hover:text-white">Returns & Refund Policy</button>
              <div className="text-[11px] text-emerald-400 pt-1">✓ FCO Standard Compliant (HSN: 31059090)</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Direct Support</h4>
            <p className="text-xs text-slate-400 mb-2">
              For agricultural estate tenders & jumbo bag deliveries:
            </p>
            <div className="text-emerald-400 font-mono text-xs">
              +91-98765-43210 | care@ecozza.green
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Ecozza Green. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
