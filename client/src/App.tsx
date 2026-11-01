import React, { useState, useEffect } from 'react'
import {
  Leaf,
  ShoppingBag,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  TrendingDown,
  X,
  PhoneCall,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProductVariant {
  id: string
  title: string
  weightKg: number
  price: number
  compareAtPrice?: number | null
}

interface Product {
  id: string
  name: string
  slug: string
  category: string
  shortDescription: string
  imagesList?: string[]
  variants: ProductVariant[]
}

interface CartItem {
  variantId: string
  productName: string
  variantTitle: string
  price: number
  weightKg: number
  quantity: number
}

// Fallback initial products if server is connecting
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Ecozza Premium Organic Biochar',
    slug: 'ecozza-premium-biochar',
    category: 'Soil Conditioner',
    shortDescription: 'High-surface area activated biochar for superior moisture retention & microbial aeration.',
    variants: [
      { id: 'v1', title: '5 kg Bag', weightKg: 5, price: 499, compareAtPrice: 599 },
      { id: 'v2', title: '10 kg Pack', weightKg: 10, price: 899, compareAtPrice: 1199 },
      { id: 'v3', title: '25 kg Farm Sack', weightKg: 25, price: 1899, compareAtPrice: 2499 },
    ],
  },
  {
    id: 'prod-2',
    name: 'Ecozza Microbe-Inoculated Biochar',
    slug: 'ecozza-inoculated-biochar',
    category: 'Bio-Fertilizer Enriched',
    shortDescription: 'Pre-charged with mycorrhizae and beneficial indigenous soil bacteria for immediate rooting power.',
    variants: [
      { id: 'v4', title: '5 kg Enriched Bag', weightKg: 5, price: 649, compareAtPrice: 799 },
      { id: 'v5', title: '15 kg Orchard Pack', weightKg: 15, price: 1699, compareAtPrice: 2199 },
    ],
  },
  {
    id: 'prod-3',
    name: 'Ecozza Urban Green Potting Mix',
    slug: 'ecozza-urban-potting-mix',
    category: 'Nursery & Terrace',
    shortDescription: 'Ready-to-use potting blend with 20% carbon matrix for terrace gardens, indoor plants & bonsai.',
    variants: [
      { id: 'v6', title: '3 kg Pouch', weightKg: 3, price: 349, compareAtPrice: 420 },
      { id: 'v7', title: '10 kg Sack', weightKg: 10, price: 799, compareAtPrice: 999 },
    ],
  },
]

export default function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCalcOpen, setIsCalcOpen] = useState(false)

  // Calculator State
  const [plantType, setPlantType] = useState('pot')
  const [plantCount, setPlantCount] = useState(10)

  // Fetch real products from server
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const res = await fetch('/api/products')
        if (res.ok) {
          const json = await res.json()
          if (json.data && json.data.length > 0) {
            setProducts(json.data)
          }
        }
      } catch (err) {
        console.warn('API server offline or starting up, showing offline catalog')
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Initialize selected variants
  useEffect(() => {
    const initialMap: Record<string, ProductVariant> = {}
    products.forEach((p) => {
      if (p.variants && p.variants.length > 0) {
        initialMap[p.id] = p.variants[0]
      }
    })
    setSelectedVariants(initialMap)
  }, [products])

  const addToCart = (product: Product) => {
    const variant = selectedVariants[product.id] || product.variants[0]
    if (!variant) return

    setCart((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id)
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id ? { ...item, quantity: item.quantity + 1 } : item
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
          quantity: 1,
        },
      ]
    })
    setIsCartOpen(true)
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

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  // Calculate recommended dosage (Biochar grams)
  const calculateDoseKg = () => {
    if (plantType === 'pot') {
      return ((plantCount * 100) / 1000).toFixed(1) // 100g per pot
    }
    if (plantType === 'tree') {
      return ((plantCount * 500) / 1000).toFixed(1) // 500g per tree
    }
    return (plantCount * 25).toFixed(0) // 25kg per acre
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      {/* Top Notification Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>FCO Compliant 100% Organic Soil Carbon | Free Shipping across India on orders over ₹999</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-950 flex items-center gap-1">
                Ecozza <span className="text-emerald-600 font-extrabold">Green</span>
              </span>
              <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase -mt-1">
                Regenerative Soil Carbon
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#products" className="hover:text-emerald-700 transition">Shop Products</a>
            <button
              onClick={() => setIsCalcOpen(true)}
              className="flex items-center gap-1.5 hover:text-emerald-700 transition text-emerald-800 font-semibold"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              Dose Calculator
            </button>
            <a href="#impact" className="hover:text-emerald-700 transition">Carbon Impact</a>
            <a href="http://localhost:3001" target="_blank" rel="noreferrer" className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full hover:bg-slate-200 transition">
              Admin Portal ↗
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCalcOpen(true)}
              className="hidden sm:inline-flex border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            >
              <Calculator className="w-4 h-4 mr-1.5 text-emerald-600" />
              Calculate Dose
            </Button>
            <Button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20"
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50/30 py-16 sm:py-24 border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              FCO Certified & Certified NABL Lab Tested Batches
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Heal Your Soil with High-Purity <span className="text-emerald-700">Biochar</span>.
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed font-normal">
              Retain 40% more water, unlock dormant fertilizer nutrients, and enrich your microbial root rhizosphere with certified organic biochar. Formulated for pots, orchards, and high-yield farms.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-700/25 px-8" asChild>
                <a href="#products">
                  Shop Biochar Bags <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsCalcOpen(true)}
                className="border-emerald-300 text-emerald-800 hover:bg-emerald-50"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Estimate Quantity for My Land
              </Button>
            </div>

            {/* Quick Benefits Ticker */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-emerald-200/60 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">70%+ Fixed Organic Carbon</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">Water Holding Capacity +40%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">Permanently Carbon Negative</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 text-emerald-800 bg-emerald-100">
              Certified Soil Conditioner
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Ecozza Soil Care Products
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Select your size for instant home delivery or bulk quote request
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
              <Card key={product.id} className="overflow-hidden border border-emerald-100/80 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group bg-white">
                <div>
                  <div className="h-48 bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 p-6 flex flex-col justify-between relative text-white">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
                        {product.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> FCO Tested
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400/90 font-mono tracking-wider">ECOZZA CARBON MATRIX</div>
                      <h3 className="text-xl font-bold text-white mt-1 leading-tight group-hover:text-emerald-200 transition">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <CardHeader className="pb-3 pt-4">
                    <CardDescription className="text-slate-600 text-xs line-clamp-2">
                      {product.shortDescription}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    {/* Variant Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Choose Pack Size
                      </label>
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

                    {/* Price Display */}
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

                <CardFooter className="pt-2 pb-5 border-t border-slate-100">
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">Your Cart ({totalItemsCount})</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-400 mt-1">Add organic biochar to start healing your plants and soil.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{item.productName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.variantTitle} ({item.weightKg} kg)</p>
                      <p className="text-sm font-bold text-emerald-800 mt-1">₹{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateQuantity(item.variantId, -1)}
                          className="p-1.5 hover:text-emerald-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, 1)}
                          className="p-1.5 hover:text-emerald-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateQuantity(item.variantId, -item.quantity)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5% Agricultural Soil Amendment)</span>
                    <span className="font-semibold text-slate-900">₹{gst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-700">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-emerald-800">₹{total}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 shadow-md shadow-emerald-700/20"
                  onClick={() => {
                    alert(`Order created for ₹${total}! Integrated with Razorpay & Ecozza API server.`)
                  }}
                >
                  Proceed to Checkout (₹{total})
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dose Calculator Modal */}
      {isCalcOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-emerald-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900">Soil Dose Calculator</h3>
              </div>
              <button
                onClick={() => setIsCalcOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-sm">
              <div>
                <label className="font-bold text-xs text-slate-600 uppercase block mb-1.5">
                  Application Type
                </label>
                <select
                  value={plantType}
                  onChange={(e) => setPlantType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="pot">Potted Garden / Indoor Plants (100g / pot)</option>
                  <option value="tree">Fruit Trees & Orchards (500g / root ring)</option>
                  <option value="acre">Agricultural Land / Beds (25 kg / 0.5 acre)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-xs text-slate-600 uppercase block mb-1.5">
                  Quantity ({plantType === 'pot' ? 'Number of Pots' : plantType === 'tree' ? 'Number of Trees' : 'Number of Half-Acres'})
                </label>
                <input
                  type="number"
                  min="1"
                  value={plantCount}
                  onChange={(e) => setPlantCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block">
                  Recommended Biochar Quantity
                </span>
                <span className="text-3xl font-black text-emerald-900 mt-1 block">
                  {calculateDoseKg()} kg
                </span>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Mix with top 2-4 inches of soil or blend into compost before planting.
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
              onClick={() => setIsCalcOpen(false)}
            >
              Done & View Bags
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white text-base">Ecozza Green</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's premium biomass pyrolysis soil conditioner. NABL tested, FCO compliant, and sequestering carbon permanently.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Compliance & Quality</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>✓ Fertilizer Control Order (FCO) Standard Compliant</li>
              <li>✓ Certified Organic Carbon 70%+</li>
              <li>✓ Low Heavy Metals & Clean Pyrolysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Bulk & Commercial Orders</h4>
            <p className="text-xs text-slate-400 mb-2">
              For 1 Tonne Bulk Jumbo Bags & agricultural estate tenders:
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
              <PhoneCall className="w-3.5 h-3.5" /> +91-98765-43210 / tenders@ecozza.green
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
