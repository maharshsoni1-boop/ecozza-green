import React from 'react'
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  Factory,
  ExternalLink,
} from 'lucide-react'

export function AboutContact() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
          <Factory className="w-3.5 h-3.5 text-emerald-700" />
          Gujarat Pyrolysis Facility
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Ecozza Green
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Pioneering organic soil carbon restoration and climate-resilient agriculture from Gujarat, India.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900">
          Restoring Organic Carbon to Indian Farmland
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          In semi-arid agricultural belts across Gujarat, Rajasthan, and Maharashtra, intense summer ground heat oxidizes conventional compost within a single season. This leaves the soil depleted, compacted, and vulnerable to drought stress.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Ecozza Green utilizes closed-chamber, oxygen-depleted thermal carbonization to transform clean agricultural forestry biomass into microscopic honeycomb carbon granules. These porous granules do not wash away or rapidly decay; they remain in the ground for centuries, creating permanent water-holding capacity and habitat for beneficial soil microbes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">100% Clean Biomass</span>
            <p className="text-[11px] text-slate-500">Only clean woody biomass feedstock. Zero municipal waste or sewage sludge.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Gujarat Factory Hub</span>
            <p className="text-[11px] text-slate-500">Calibrated 2-5mm granule grading with minimal fines for uniform root blending.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">NABL Batch Traceability</span>
            <p className="text-[11px] text-slate-500">Every pack carries a batch code traceable to independent NABL lab reports.</p>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">WhatsApp Direct Chat</h4>
          <p className="text-xs text-slate-500">Fastest support for order tracking and plant dosing recommendations.</p>
          <a
            href="https://wa.me/919876543210?text=Hello%20Ecozza%20Green%2C%20I%20have%20an%20inquiry%20regarding%20biochar."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline pt-1"
          >
            <span>+91 98765 43210</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Email Support</h4>
          <p className="text-xs text-slate-500">GST tax invoices, bulk tenders & nursery consignment inquiries.</p>
          <div className="font-mono text-xs text-slate-800 font-bold pt-1">
            care@ecozza.green
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Production & Warehouse</h4>
          <p className="text-xs text-slate-500">Ecozza Green Biochar Facility, Industrial Agro Zone, Gujarat 380015, India.</p>
        </div>
      </div>
    </div>
  )
}
