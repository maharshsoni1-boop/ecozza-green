import React, { useState } from 'react'
import {
  Building2,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function B2BEnquiry() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    gstin: '',
    phone: '',
    email: '',
    locationState: 'Gujarat',
    locationCity: '',
    cropType: '',
    quantityText: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess(json.data)
      } else {
        setError(json.error || 'Failed to submit quote enquiry.')
      }
    } catch {
      setError('Unable to reach server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Commercial Quote Request Received</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Thank you, <span className="font-bold text-slate-800">{success.name}</span>. Our agronomy commercial division has received your requirement for <span className="font-bold text-emerald-800">{success.quantityText}</span>.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
          Enquiry Reference ID: {success.id}
        </div>
        <Button
          onClick={() => {
            setSuccess(null)
            setFormData({
              name: '',
              companyName: '',
              gstin: '',
              phone: '',
              email: '',
              locationState: 'Gujarat',
              locationCity: '',
              cropType: '',
              quantityText: '',
              message: '',
            })
          }}
          className="bg-emerald-700 text-white font-bold text-xs"
        >
          Submit Another Enquiry
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-900/5">
      <div className="pb-6 border-b border-slate-100">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <Building2 className="w-3.5 h-3.5" />
          Commercial & Farm Estates
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          B2B Bulk Biochar Quote Request
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Special factory-direct pricing for 1-Tonne Jumbo Bulk Bags, FCO compliant state tenders, tea gardens & orchard plantations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Contact Person Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Patel"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Company / Farm Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Patel Organic Agro Farms Ltd"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Phone Number (WhatsApp) *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 9876543210"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              GSTIN (for Input Tax Credit)
            </label>
            <input
              type="text"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              placeholder="24AAAAA0000A1Z5"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              State *
            </label>
            <input
              type="text"
              required
              value={formData.locationState}
              onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              City / District
            </label>
            <input
              type="text"
              value={formData.locationCity}
              onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
              placeholder="e.g. Rajkot"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
              Required Quantity *
            </label>
            <input
              type="text"
              required
              value={formData.quantityText}
              onChange={(e) => setFormData({ ...formData, quantityText: e.target.value })}
              placeholder="e.g. 5 Tonnes / 200 Sacks"
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
            Application Notes / Crop Details
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about your soil type, acreage, or delivery requirements..."
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 text-sm shadow-md shadow-emerald-700/20"
        >
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Submitting Quotation Request...' : 'Submit Commercial Quote Request'}
        </Button>
      </form>
    </div>
  )
}
