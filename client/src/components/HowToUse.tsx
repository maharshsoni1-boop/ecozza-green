import React from 'react'
import {
  Sprout,
  Droplets,
  Layers,
  Trees,
  Calculator,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react'

export function HowToUse() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
          Field Agronomy Manual
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How to Apply Ecozza Green Granules
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Biochar performs best when integrated into the active root zone alongside compost and water.
        </p>
      </div>

      {/* 4 Core Application Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              METHOD 01
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Potted Plants & Terrace Gardens
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mix 1 to 2 scoops (50g - 100g) into the top 2-4 inches of soil or blend into potting mix at 10-15% by volume before potting. Water thoroughly after application.
          </p>
          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
            ✓ Application frequency: Once every 2 years (biochar does not decompose).
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              METHOD 02
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Fruit Trees & Orchards (Mango, Guava, Citrus)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dig a shallow 6-inch trench around the root canopy drip-line. Spread 500g to 1kg of granules per tree, mix with compost or vermicompost, backfill, and flood-water.
          </p>
          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
            ✓ Increases summer heatwave survival rate by +35%.
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              METHOD 03
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Vegetable Beds & Kitchen Gardens
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Broadcast 250g to 500g per square meter of raised bed. Till or rake into root depth (top 15 cm) prior to transplanting tomato, chilli, or brinjal saplings.
          </p>
          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
            ✓ Eliminates moisture fluctuation and root rot.
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              METHOD 04
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Commercial Acreage & Farmland
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Broadcast 250 kg to 500 kg per acre using a rotavator during pre-monsoon field preparation. Incorporate deep to permanently expand microbial pore volume.
          </p>
          <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
            ✓ Available in 1-Tonne Jumbo Bulk Bags for commercial estates.
          </div>
        </div>
      </div>
    </div>
  )
}
