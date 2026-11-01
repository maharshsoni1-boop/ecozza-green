import React from 'react'
import {
  Droplets,
  Sprout,
  ShieldCheck,
  TrendingDown,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react'

export function WhyBiochar() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
          <Award className="w-3.5 h-3.5" />
          Agronomy & Climate Science
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Why Certified Biochar Transforms Soil
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Pure pyrolyzed agricultural biomass engineered with massive micro-porosity to lock moisture and permanently store carbon for centuries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">40% Higher Water Retention</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Acts like a subterranean sponge. Reduces watering frequency in terrace gardens and shields orchard trees during severe summer heatwaves.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Microbial Coral Reef</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Billions of microscopic pores create a safe shelter for mycorrhizae and beneficial nitrogen-fixing soil bacteria against heat and chemical leaching.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Permanently Carbon Negative</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every 1 kg of Ecozza Biochar prevents biomass from rotting into greenhouse gases, safely locking over 2.5 kg of CO₂ equivalent in your soil forever.
          </p>
        </div>
      </div>

      {/* Statutory Regulatory Disclaimer */}
      <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1.5 leading-relaxed">
        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          Fertilizer Control Order (FCO) Statutory Notice
        </div>
        <p>
          Ecozza Green is a granular biochar soil conditioner designed to improve soil moisture and nutrient retention. It is NOT a chemical fertilizer and does NOT replace fertilizers. Results vary by soil type, existing organic carbon, and agricultural practices.
        </p>
      </div>
    </div>
  )
}
