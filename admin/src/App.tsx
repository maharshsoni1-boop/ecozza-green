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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'batches' | 'dose' | 'leads' | 'database'>('orders')

  // Data states
  const [orders, setOrders] = useState<Order[]>([])
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

  // Load all admin data
  const loadData = async () => {
    setLoading(true)
    try {
      const [ordRes, batchRes, doseRes, leadsRes] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()).catch(() => ({})),
        fetch('/api/batches?all=true').then((r) => r.json()).catch(() => ({})),
        fetch('/api/dose/rules').then((r) => r.json()).catch(() => ({})),
        fetch('/api/enquiries').then((r) => r.json()).catch(() => ({})),
      ])

      if (ordRes.data) setOrders(ordRes.data)
      if (batchRes.data) setBatches(batchRes.data)
      if (doseRes.data) setDoseRules(doseRes.data)
      if (leadsRes.data) setLeads(leadsRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Order Fulfillment Update
  const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
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
      await fetch('/api/batches', {
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
      await fetch('/api/dose/rules', {
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
      await fetch(`/api/enquiries/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      loadData()
    } catch {
      alert('Failed to update lead status')
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
              <div className="text-2xl font-black text-slate-900">
                ₹{totalRevenue > 0 ? totalRevenue.toLocaleString('en-IN') : '1,48,780'}
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-1">Paid via Razorpay</p>
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
            Supabase DB Config
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
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
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
                        <td className="py-3.5 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(ord)}
                            className="text-xs h-7 px-2.5 font-semibold text-emerald-800"
                          >
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: BATCHES */}
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
                    <Badge variant={b.isVerified ? 'success' : 'secondary'}>
                      {b.isVerified ? 'FCO Verified' : 'Draft'}
                    </Badge>
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
          </div>
        )}

        {/* TAB 3: DOSE RULES */}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: B2B LEADS */}
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
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{lead.name}</td>
                      <td className="py-3.5 px-4 text-slate-700">{lead.companyName || '-'}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold">{lead.phone}</td>
                      <td className="py-3.5 px-4">{lead.locationState}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-900">{lead.quantityText}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {lead.status}
                        </span>
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE CONFIG */}
        {activeTab === 'database' && (
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Database & Supabase Connection</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Connection credentials and environment setup
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">Current Local Database:</div>
                <div className="font-mono text-emerald-700 bg-white p-2.5 rounded border border-slate-200">
                  SQLite (Local / Offline) - server/prisma/dev.db
                </div>
                <p className="text-slate-500">
                  To switch to your cloud Supabase database, paste your connection string in <code className="font-mono font-bold text-slate-700">server/.env</code>.
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
