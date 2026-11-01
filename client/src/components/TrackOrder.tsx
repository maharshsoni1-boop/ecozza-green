import React, { useState } from 'react'
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  FileText,
  MapPin,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiUrl } from '@/lib/api'

export function TrackOrder() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(apiUrl(`/api/track/${encodeURIComponent(identifier.trim())}`))
      const json = await res.json()
      if (json.success) {
        setResult(json.data)
      } else {
        setError(json.error || 'No matching order found.')
      }
    } catch (err: any) {
      setError('Unable to reach server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['PLACED', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED']
  const currentStepIdx = result ? steps.indexOf(result.orderStatus) : 0

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-900/5">
      <div className="text-center max-w-lg mx-auto pb-8 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-3">
          <Truck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Biochar Order
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter your Order Number (e.g. <span className="font-mono text-emerald-800">EG-ORD-10024</span>) or registered phone number.
        </p>

        <form onSubmit={handleTrack} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Order Number (EG-ORD-...) or Phone"
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 font-bold"
          >
            {loading ? 'Searching...' : 'Track'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-300">
          {/* Order Header Summary */}
          <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Order ID</span>
              <div className="text-lg font-black text-slate-900 font-mono">{result.orderNumber}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Order Date</span>
              <div className="text-sm font-semibold text-slate-800">
                {new Date(result.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Amount</span>
              <div className="text-lg font-black text-emerald-800">₹{result.totalAmount}</div>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-6 px-4">
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%` }}
              />

              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx
                const isCurrent = idx === currentStepIdx
                return (
                  <div key={st} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold mt-2 ${
                        isCurrent ? 'text-emerald-800' : 'text-slate-400'
                      }`}
                    >
                      {st}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Courier Dispatch Link */}
          {result.trackingNumber && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-950 block">Dispatched with {result.carrierName || 'Shiprocket'}</span>
                <span className="font-mono text-emerald-700">AWB: {result.trackingNumber}</span>
              </div>
              {result.trackingUrl && (
                <a
                  href={result.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-800 transition"
                >
                  Live Courier Tracking <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Items in this Shipment
            </h4>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              {result.items.map((it: any) => (
                <div key={it.id} className="p-3.5 flex justify-between items-center text-xs bg-white">
                  <div>
                    <span className="font-bold text-slate-900 block">{it.productName}</span>
                    <span className="text-slate-500">{it.variantTitle} × {it.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{it.totalPrice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
