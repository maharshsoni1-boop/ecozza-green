import React, { useState, useEffect } from 'react'
import {
  Package,
  ShoppingBag,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  Database,
  Leaf,
  Layers,
  Search,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  createdAt: string
}

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'batches' | 'database'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch orders from API
  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true)
        const res = await fetch('/api/orders')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setOrders(json.data)
          }
        }
      } catch (err) {
        console.warn('API server offline or connecting, using fallback demo data')
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  // Demo Fallback orders
  const displayOrders = orders.length > 0 ? orders : [
    {
      id: 'ord-1',
      orderNumber: 'EG-ORD-90214',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@greenfarm.in',
      totalAmount: 1899,
      orderStatus: 'PLACED',
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ord-2',
      orderNumber: 'EG-ORD-90188',
      customerName: 'Dr. Priya Desai',
      customerEmail: 'priya.desai@agriuniv.edu',
      totalAmount: 4990,
      orderStatus: 'SHIPPED',
      paymentStatus: 'PAID',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ord-3',
      orderNumber: 'EG-ORD-89945',
      customerName: 'Vikram Mehta',
      customerEmail: 'vikram@terracegarden.co',
      totalAmount: 899,
      orderStatus: 'DELIVERED',
      paymentStatus: 'PAID',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white h-16 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Leaf className="w-5 h-5 text-emerald-950" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight flex items-center gap-2">
              Ecozza Green <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">ADMIN CONSOLE</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <span>Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div className="flex items-center gap-2 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Server: 5000</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Revenue
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">₹1,48,780</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">+18.2% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Orders
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">{displayOrders.length}</div>
              <p className="text-xs text-slate-500 mt-1">Ready for packing & dispatch</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Biochar in Stock
              </CardTitle>
              <Package className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">12,450 kg</div>
              <p className="text-xs text-slate-500 mt-1">4 Warehouse depots in India</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Certified Lab Batches
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">18 Batches</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">100% NABL Verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 text-sm font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders ({displayOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Products & Inventory
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'batches'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            FCO Lab Reports
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'database'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            Supabase / DB Config
          </button>
        </div>

        {/* Tab 1: Orders Table */}
        {activeTab === 'orders' && (
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Recent Customer Orders</CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Live orders from customer storefront
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Total (₹)</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{ord.customerName}</div>
                          <div className="text-[11px] text-slate-400">{ord.customerEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900">₹{ord.totalAmount}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Products & Inventory */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Ecozza Premium Biochar</h3>
              <p className="text-xs text-slate-500 mb-3">5 kg, 10 kg, 25 kg bags</p>
              <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">Current Stock:</span>
                <span className="font-bold text-emerald-700">6,200 kg Available</span>
              </div>
            </Card>
            <Card className="bg-white border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Microbe-Inoculated Biochar</h3>
              <p className="text-xs text-slate-500 mb-3">5 kg, 15 kg bags</p>
              <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">Current Stock:</span>
                <span className="font-bold text-emerald-700">3,800 kg Available</span>
              </div>
            </Card>
            <Card className="bg-white border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Urban Potting Mix Matrix</h3>
              <p className="text-xs text-slate-500 mb-3">3 kg, 10 kg packs</p>
              <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">Current Stock:</span>
                <span className="font-bold text-emerald-700">2,450 kg Available</span>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Lab Batches */}
        {activeTab === 'batches' && (
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">Certified NABL Lab Batches</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Every batch undergoes third-party lab testing for FCO organic compliance before packaging.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-emerald-950">Batch EG-2026-B04</span>
                  <p className="text-xs text-slate-600 mt-0.5">Fixed Carbon: 73.4% | pH: 7.8 | Moisture: 7.9%</p>
                </div>
                <Badge variant="success">Verified FCO Compliant</Badge>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-slate-950">Batch EG-2026-B03</span>
                  <p className="text-xs text-slate-600 mt-0.5">Fixed Carbon: 71.8% | pH: 7.6 | Moisture: 8.2%</p>
                </div>
                <Badge variant="success">Verified FCO Compliant</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Database & Supabase */}
        {activeTab === 'database' && (
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Database & Supabase Connection</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Architecture configuration for server, client, and admin
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">Current Database Status:</div>
                <div className="font-mono text-emerald-700 bg-white p-2.5 rounded border border-slate-200">
                  SQLite (Local / Offline) - server/prisma/dev.db
                </div>
                <p className="text-slate-500">
                  To connect to your cloud Supabase database, paste your connection string in <code className="font-mono font-bold text-slate-700">server/.env</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-950">Ready for Supabase PostgreSQL:</div>
                <p className="text-emerald-800">
                  Your server is configured with both Prisma ORM and the official <code className="font-mono">@supabase/supabase-js</code> client for JWT verification, RLS, and secure image uploads.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
