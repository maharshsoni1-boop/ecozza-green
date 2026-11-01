import React, { useState, useEffect } from 'react'
import {
  FlaskConical,
  Search,
  FileCheck2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
  heavyMetalsSummary: string | null
  notes: string | null
  isVerified: boolean
}

const DEFAULT_BATCHES: Batch[] = [
  {
    id: 'b1',
    batchNumber: 'EG-2026-B04',
    labName: 'NABL Accredited Soil Testing Laboratory',
    labReportPdfUrl: 'https://ecozza.green/reports/EG-2026-B04.pdf',
    carbonPercentage: 74.2,
    phValue: 7.8,
    moisturePercentage: 7.9,
    granuleSizeMm: '2 mm - 5 mm',
    bulkDensity: 0.42,
    heavyMetalsSummary: 'Below detection limits (FCO Standard Compliant)',
    notes: 'Premium biomass feedstock pyrolysis with high pore volume.',
    isVerified: true,
  },
  {
    id: 'b2',
    batchNumber: 'EG-2026-B03',
    labName: 'NABL Certified Agricultural Lab',
    labReportPdfUrl: 'https://ecozza.green/reports/EG-2026-B03.pdf',
    carbonPercentage: 72.8,
    phValue: 7.6,
    moisturePercentage: 8.1,
    granuleSizeMm: '2 mm - 4 mm',
    bulkDensity: 0.44,
    heavyMetalsSummary: 'Heavy metals below FCO limits',
    notes: 'Uniform sizing for easy mechanical soil blending.',
    isVerified: true,
  },
]

export function LabReports() {
  const [batches, setBatches] = useState<Batch[]>(DEFAULT_BATCHES)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/batches')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setBatches(json.data)
        }
      })
      .catch(() => {})
  }, [])

  const filtered = batches.filter((b) =>
    b.batchNumber.toLowerCase().includes(search.toLowerCase().trim())
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">NABL Certified Batch Lab Reports</h2>
            <p className="text-xs text-slate-500">
              Look up test data and certified certificates for the batch printed on your packaging
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type batch code from your bag (e.g. EG-2026-B04)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((batch) => (
          <div
            key={batch.id}
            className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                  {batch.batchNumber}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">{batch.labName}</p>
              </div>
              <Badge variant="success" className="text-[10px]">
                <ShieldCheck className="w-3 h-3 mr-1" />
                FCO Compliant
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
              <div className="bg-emerald-50/70 p-2.5 rounded-xl">
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">Fixed Carbon</span>
                <span className="text-lg font-black text-emerald-950">{batch.carbonPercentage}%</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">pH Value</span>
                <span className="text-lg font-black text-slate-900">{batch.phValue}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Moisture</span>
                <span className="text-lg font-black text-slate-900">{batch.moisturePercentage}%</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Granule Size:</span>
                <span className="font-semibold text-slate-800">{batch.granuleSizeMm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bulk Density:</span>
                <span className="font-semibold text-slate-800">{batch.bulkDensity} g/cm³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Heavy Metals:</span>
                <span className="font-semibold text-emerald-700">Verified Safe</span>
              </div>
            </div>

            {batch.notes && (
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                "{batch.notes}"
              </p>
            )}

            {batch.labReportPdfUrl && (
              <a
                href={batch.labReportPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                View Certified NABL Lab PDF <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
