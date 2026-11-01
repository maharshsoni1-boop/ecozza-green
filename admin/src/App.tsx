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
  Plus,
  Trash2,
  Edit,
  Truck,
  Building2,
  X,
  FileCheck2,
  Check,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiUrl } from '@/lib/api'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  orderStatus: string
  paymentStatus: string
  trackingNumber?: string | null
  carrierName?: string | null
  shippingAddress: string
  createdAt: string
}

interface Batch {
  id: string
  batchNumber: string
  labName: string | null
  labReportPdfUrl: string | null
  carbonPercentage: number | null
  phValue: number | null
  moisturePercentage: number | null
  granuleSizeMm: string | null
  bulkDensity: number | null
  notes: string | null
  isVerified: boolean
}

interface DoseRule {
  id: string
  plantCategory: string
  cropName: string
  unitType: string
  soilType: string
  recommendedDoseGrams: number
  notes: string | null
}

interface LeadEnquiry {
  id: string
  name: string
  companyName: string | null
  gstin: string | null
  phone: string
  email: string | null
  locationState: string
  quantityText: string
  status: string
  createdAt: string
}

interface Product {
  id: string
  name: string
  slug: string
  category: string
  tagline?: string | null
  variants: Array<{
    id: string
    title: string
    weightKg: number
    price: number
    stockQuantity: number
    isBulkQuoteOnly: boolean
  }>
}

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'batches' | 'dose' | 'leads' | 'database'>('orders')

  // Data states
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [doseRules, setDoseRules] = useState<DoseRule[]>([])
  const [leads, setLeads] = useState<LeadEnquiry[]>([])
  const [loading, setLoading] = useState(false)

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false)
  const [isAddDoseOpen, setIsAddDoseOpen] = useState(false)

  // Forms
  const [newBatch, setNewBatch] = useState({
    batchNumber: '',
    labName: 'NABL Certified Agricultural Lab',
    carbonPercentage: '74.5',
    phValue: '7.8',
    moisturePercentage: '8.0',
    granuleSizeMm: '2 mm - 5 mm',
    labReportPdfUrl: '',
    isVerified: true,
  })

  const [newDose, setNewDose] = useState({
    plantCategory: 'Potted & Terrace Garden',
    cropName: '',
    unitType: 'POT',
    recommendedDoseGrams: '100',
    notes: '',
  })

  // Connection state
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)

  // Load all admin data
  const loadData = async () => {
    setLoading(true)
    try {
      const [ordRes, prodRes, batchRes, doseRes, leadsRes] = await Promise.all([
        fetch(apiUrl('/api/orders')).then((r) => r.json()).catch(() => ({})),
        fetch(apiUrl('/api/products')).then((r) => r.json()).catch(() => ({})),
        fetch(apiUrl('/api/batches?all=true')).then((r) => r.json()).catch(() => ({})),
        fetch(apiUrl('/api/dose/rules')).then((r) => r.json()).catch(() => ({})),
        fetch(apiUrl('/api/enquiries')).then((r) => r.json()).catch(() => ({})),
      ])

      const isConnected = Boolean(ordRes.data || prodRes.data || batchRes.data)
      setApiOnline(isConnected)

      if (ordRes.data) setOrders(ordRes.data)
      if (prodRes.data) setProducts(prodRes.data)
      if (batchRes.data) setBatches(batchRes.data)
      if (doseRes.data) setDoseRules(doseRes.data)
      if (leadsRes.data) setLeads(leadsRes.data)
    } catch {
      setApiOnline(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Delete Handlers for Admin
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      await fetch(apiUrl(`/api/orders/${orderId}`), { method: 'DELETE' })
      loadData()
    } catch {
      alert('Failed to delete order')
    }
  }

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm('Are you sure you want to delete this batch certificate?')) return
    try {
      await fetch(apiUrl(`/api/batches/${batchId}`), { method: 'DELETE' })
      loadData()
    } catch {
      alert('Failed to delete batch')
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this B2B lead?')) return
    try {
      await fetch(apiUrl(`/api/enquiries/${leadId}`), { method: 'DELETE' })
      loadData()
    } catch {
      alert('Failed to delete lead')
    }
  }

  const handleDeleteDose = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this dose rule?')) return
    try {
      await fetch(apiUrl(`/api/dose/rules/${ruleId}`), { method: 'DELETE' })
      loadData()
    } catch {
      alert('Failed to delete dose rule')
    }
  }

  // Order Fulfillment Update
  const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      await fetch(apiUrl(`/api/orders/${orderId}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: status,
          trackingNumber,
          carrierName: trackingNumber ? 'Shiprocket Express' : undefined,
        }),
      })
      setSelectedOrder(null)
      loadData()
    } catch {
      alert('Failed to update order status')
    }
  }

  // Add Batch
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(apiUrl('/api/batches'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBatch),
      })
      setIsAddBatchOpen(false)
      setNewBatch({
        batchNumber: '',
        labName: 'NABL Certified Agricultural Lab',
        carbonPercentage: '74.5',
        phValue: '7.8',
        moisturePercentage: '8.0',
        granuleSizeMm: '2 mm - 5 mm',
        labReportPdfUrl: '',
        isVerified: true,
      })
      loadData()
    } catch {
      alert('Failed to create batch')
    }
  }

  // Add Dose Rule
  const handleCreateDoseRule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(apiUrl('/api/dose/rules'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDose),
      })
      setIsAddDoseOpen(false)
      setNewDose({
        plantCategory: 'Potted & Terrace Garden',
        cropName: '',
        unitType: 'POT',
        recommendedDoseGrams: '100',
        notes: '',
      })
      loadData()
    } catch {
      alert('Failed to create dose rule')
    }
  }

  // Update Lead Status
  const handleUpdateLead = async (leadId: string, status: string) => {
    try {
      await fetch(apiUrl(`/api/enquiries/${leadId}/status`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      loadData()
    } catch {
      alert('Failed to update lead status')
    }
  }

  // 1-Click Shiprocket AWB Generation
  const handleShiprocketGenerate = async (orderId: string) => {
    try {
      setLoading(true)
      const res = await fetch(apiUrl(`/api/orders/${orderId}/shiprocket`), { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        alert(json.message)
        setSelectedOrder(null)
        loadData()
      } else {
        alert(json.error || 'Failed to generate Shiprocket shipment')
      }
    } catch {
      alert('Failed to connect to shipping service')
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'PAID' ? o.totalAmount : 0), 0)

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white h-16 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Ecozza Green" className="h-9 w-auto object-contain" />
          <div>
            <h1 className="font-bold text-sm tracking-tight flex items-center gap-2">
              Ecozza Green <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">OPERATIONS PORTAL</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition font-semibold"
          >
            <span>Customer Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div className="flex items-center gap-2 font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                apiOnline === true
                  ? 'bg-emerald-400 animate-pulse'
                  : apiOnline === false
                  ? 'bg-rose-400'
                  : 'bg-amber-400'
              }`}
            ></span>
            <span className={apiOnline === true ? 'text-emerald-400' : apiOnline === false ? 'text-rose-400' : 'text-amber-400'}>
              {apiOnline === true ? 'API Connected' : apiOnline === false ? 'API Offline' : 'Connecting...'}
            </span>
          </div>
        </div>
      </header>

      {/* Backend Offline Warning Banner */}
      {apiOnline === false && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Backend Not Connected (404 / Offline):</strong> The admin console cannot reach the Express backend server. If deployed to Vercel/Netlify, make sure to add <code>VITE_API_URL="https://your-backend-api.onrender.com"</code> in your hosting Environment Variables.
            </span>
          </div>
          <Button size="sm" variant="outline" onClick={loadData} className="h-7 text-xs bg-white border-amber-300 font-bold hover:bg-amber-100">
            Retry Connection
          </Button>
        </div>
      )}

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
              <div className="text-2xl font-black text-slate-900">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                {orders.filter((o) => o.paymentStatus === 'PAID').length} paid via Razorpay
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Orders
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">{orders.length}</div>
              <p className="text-xs text-slate-500 mt-1">Customer shipments</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                B2B Bulk Enquiries
              </CardTitle>
              <Building2 className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">{leads.length}</div>
              <p className="text-xs text-slate-500 mt-1">Commercial farms & estates</p>
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
              <div className="text-2xl font-black text-slate-900">{batches.length}</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">100% NABL Verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 text-xs sm:text-sm font-semibold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Products & Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'batches'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            NABL Lab Batches ({batches.length})
          </button>
          <button
            onClick={() => setActiveTab('dose')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'dose'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Dose Rules ({doseRules.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'leads'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            B2B Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            Supabase PostgreSQL DB
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Live Customer Orders
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Click any order to fulfill, assign Shiprocket AWB, or update delivery status
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={loadData} className="text-xs">
                  Refresh Orders
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Tracking</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="font-semibold">No customer orders yet</p>
                          <p className="text-[11px] mt-0.5">Orders placed in the customer storefront will appear here instantly.</p>
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{ord.customerName}</div>
                            <div className="text-[11px] text-slate-400">{ord.customerEmail}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono">{ord.customerPhone}</td>
                          <td className="py-3.5 px-4 font-black text-slate-900">₹{ord.totalAmount}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.orderStatus === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'SHIPPED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {ord.trackingNumber || <span className="text-slate-400">Unassigned</span>}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(ord)}
                              className="text-xs h-7 px-2.5 font-semibold text-emerald-800"
                            >
                              Fulfill
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: PRODUCTS & INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Products & Inventory</h3>
                <p className="text-xs text-slate-500">Live product catalog and pack variants stored in Supabase</p>
              </div>
              <Button size="sm" variant="outline" onClick={loadData} className="text-xs">
                Refresh Catalog
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => (
                <Card key={prod.id} className="p-5 bg-white border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{prod.name}</h4>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 mt-1 inline-block">
                        {prod.category}
                      </span>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {prod.variants.length} Packs
                    </Badge>
                  </div>
                  {prod.tagline && <p className="text-xs text-slate-500 italic">{prod.tagline}</p>}

                  <div className="border-t border-slate-100 pt-3">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Variants & Stock
                    </div>
                    <div className="space-y-1.5">
                      {prod.variants.map((v) => (
                        <div key={v.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="font-semibold text-slate-800">{v.title}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-slate-600">
                              Stock: <b className="text-slate-900">{v.stockQuantity}</b>
                            </span>
                            <span className="font-black text-emerald-800">
                              {v.isBulkQuoteOnly ? 'B2B Quote Only' : `₹${v.price}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BATCHES */}
        {activeTab === 'batches' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Certified Batch Lab Reports</h3>
                <p className="text-xs text-slate-500">Manage NABL certified laboratory test certificates</p>
              </div>
              <Button
                onClick={() => setIsAddBatchOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Lab Certificate
              </Button>
            </div>

            {batches.length === 0 ? (
              <Card className="p-12 text-center text-slate-400 bg-white">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-semibold text-xs">No lab certificates uploaded yet</p>
                <p className="text-[11px] mt-0.5">Click "Add Lab Certificate" above to upload a certified NABL report.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batches.map((b) => (
                  <Card key={b.id} className="p-5 bg-white border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {b.batchNumber}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{b.labName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={b.isVerified ? 'success' : 'secondary'}>
                          {b.isVerified ? 'FCO Verified' : 'Draft'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteBatch(b.id)}
                          className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Carbon</span>
                        <span className="font-bold text-emerald-900">{b.carbonPercentage}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">pH</span>
                        <span className="font-bold text-slate-800">{b.phValue}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Moisture</span>
                        <span className="font-bold text-slate-800">{b.moisturePercentage}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DOSE RULES */}
        {activeTab === 'dose' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Crop Dose Recommendations</h3>
                <p className="text-xs text-slate-500">Formulated agronomy rates for soil calculator engine</p>
              </div>
              <Button
                onClick={() => setIsAddDoseOpen(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add Crop Rule
              </Button>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Crop Name</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Recommended Grams</th>
                    <th className="py-3 px-4">Agronomy Notes</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doseRules.map((rule) => (
                    <tr key={rule.id}>
                      <td className="py-3 px-4 font-semibold text-slate-800">{rule.plantCategory}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{rule.cropName}</td>
                      <td className="py-3 px-4 font-mono">{rule.unitType}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">
                        {rule.recommendedDoseGrams}g
                      </td>
                      <td className="py-3 px-4 text-slate-500">{rule.notes || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDose(rule.id)}
                          className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: B2B LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Commercial Farm Quotes & B2B Leads</h3>
              <p className="text-xs text-slate-500">Direct inquiries for 1-Tonne bulk bags and state tenders</p>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Phone (WhatsApp)</th>
                    <th className="py-3 px-4">State</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-semibold text-xs">No B2B bulk enquiries received yet</p>
                        <p className="text-[11px] mt-0.5">Commercial quotes submitted on the storefront will appear here.</p>
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{lead.name}</td>
                        <td className="py-3.5 px-4 text-slate-700">{lead.companyName || '-'}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold">{lead.phone}</td>
                        <td className="py-3.5 px-4">{lead.locationState}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-900">{lead.quantityText}</td>
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLead(lead.id, e.target.value)}
                            className="p-1 rounded border border-slate-200 text-xs bg-slate-50 font-medium"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="QUOTED">QUOTED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DATABASE CONFIG */}
        {activeTab === 'database' && (
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Database & Cloud Supabase Status</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Live connection to Supabase PostgreSQL database
                  </CardDescription>
                </div>
                <Badge variant="success" className="bg-emerald-600 text-white font-mono text-xs">
                  Connected & Synchronized
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Database: Supabase PostgreSQL (AWS ap-south-1)
                </div>
                <div className="font-mono text-emerald-900 bg-white p-3 rounded-lg border border-emerald-200 text-[11px] overflow-x-auto">
                  aws-0-ap-south-1.pooler.supabase.com:5432 / postgres (SSL Required)
                </div>
                <p className="text-emerald-800 text-[11px]">
                  All tables, products, variants, orders, and batch records are synchronized live in your Supabase PostgreSQL cloud database.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Catalog Products</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{products.length}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Orders</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{orders.length}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Lab Batches</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{batches.length}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Dose Rules</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{doseRules.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Order Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Update Order {selectedOrder.orderNumber}</h3>
                <p className="text-[11px] text-slate-500">{selectedOrder.customerName} (₹{selectedOrder.totalAmount})</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Order Fulfillment Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['PLACED', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(selectedOrder.id, st, selectedOrder.trackingNumber || undefined)}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition ${
                        selectedOrder.orderStatus === st
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Shiprocket Auto-Generation */}
              <div className="pt-2 border-t border-slate-100">
                <Button
                  onClick={() => handleShiprocketGenerate(selectedOrder.id)}
                  disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 text-xs flex items-center justify-center gap-2 mb-2"
                >
                  <Truck className="w-4 h-4" />
                  Auto-Generate Live Shiprocket AWB
                </Button>
                <div className="text-center text-[10px] text-slate-400 font-medium">
                  — or manually specify courier & tracking —
                </div>
              </div>

              <div className="pt-2">
                <label className="font-bold text-slate-700 uppercase block mb-1">Shiprocket AWB / Tracking Number</label>
                <input
                  type="text"
                  defaultValue={selectedOrder.trackingNumber || ''}
                  id="trackingInput"
                  placeholder="e.g. SR-IND-9821421"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <Button
                onClick={() => {
                  const input = document.getElementById('trackingInput') as HTMLInputElement
                  updateOrderStatus(selectedOrder.id, 'SHIPPED', input.value || undefined)
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 text-xs mt-2"
              >
                Mark as SHIPPED with Tracking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add NABL Certified Batch Certificate</h3>
              <button onClick={() => setIsAddBatchOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Batch Code *</label>
                <input
                  type="text"
                  required
                  value={newBatch.batchNumber}
                  onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                  placeholder="e.g. EG-2026-B05"
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Carbon %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatch.carbonPercentage}
                    onChange={(e) => setNewBatch({ ...newBatch, carbonPercentage: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatch.phValue}
                    onChange={(e) => setNewBatch({ ...newBatch, phValue: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Moisture %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatch.moisturePercentage}
                    onChange={(e) => setNewBatch({ ...newBatch, moisturePercentage: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 text-xs">
                Save & Publish Certificate
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Add Dose Rule Modal */}
      {isAddDoseOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add Crop Dose Rule</h3>
              <button onClick={() => setIsAddDoseOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateDoseRule} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Plant Category</label>
                <input
                  type="text"
                  required
                  value={newDose.plantCategory}
                  onChange={(e) => setNewDose({ ...newDose, plantCategory: e.target.value })}
                  placeholder="e.g. Fruit Orchards"
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Crop Name *</label>
                <input
                  type="text"
                  required
                  value={newDose.cropName}
                  onChange={(e) => setNewDose({ ...newDose, cropName: e.target.value })}
                  placeholder="e.g. Mango & Pomegranate"
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Unit Type</label>
                  <select
                    value={newDose.unitType}
                    onChange={(e) => setNewDose({ ...newDose, unitType: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <option value="POT">POT</option>
                    <option value="TREE">TREE</option>
                    <option value="ACRE">ACRE</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Dose (Grams)</label>
                  <input
                    type="number"
                    required
                    value={newDose.recommendedDoseGrams}
                    onChange={(e) => setNewDose({ ...newDose, recommendedDoseGrams: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 text-xs">
                Save Dose Rule
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
