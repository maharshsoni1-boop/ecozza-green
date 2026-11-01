import React, { useState, useEffect } from 'react'
import {
  Calculator,
  ShoppingBag,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Check,
  Scale,
  Sprout,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DoseRule {
  id: string
  plantCategory: string
  cropName: string
  unitType: string
  soilType: string
  recommendedDoseGrams: number
  bagRecommendationText: string | null
  notes: string | null
}

const DEFAULT_RULES: DoseRule[] = [
  {
    id: '1',
    plantCategory: 'Potted & Terrace Garden',
    cropName: 'Indoor Ornamental & Houseplants',
    unitType: 'POT',
    soilType: 'General Potting Soil',
    recommendedDoseGrams: 50,
    bagRecommendationText: '1 Bag of 3kg / 5kg',
    notes: 'Mix 1 scoop (50g) into top 2 inches of soil.',
  },
  {
    id: '2',
    plantCategory: 'Potted & Terrace Garden',
    cropName: 'Flowering Plants (Roses, Hibiscus)',
    unitType: 'POT',
    soilType: 'General Potting Soil',
    recommendedDoseGrams: 100,
    bagRecommendationText: '1 Bag of 5kg',
    notes: 'Apply 2 scoops (100g) around root zone.',
  },
  {
    id: '3',
    plantCategory: 'Vegetable Beds & Kitchen Garden',
    cropName: 'Tomatoes, Chillies & Brinjal',
    unitType: 'POT',
    soilType: 'Loamy Soil',
    recommendedDoseGrams: 150,
    bagRecommendationText: '1 Bag of 10kg',
    notes: 'Mix thoroughly into seedling hole before transplanting.',
  },
  {
    id: '4',
    plantCategory: 'Fruit Trees & Orchards',
    cropName: 'Mango, Guava, Citrus & Pomegranate',
    unitType: 'TREE',
    soilType: 'Sandy Loam',
    recommendedDoseGrams: 750,
    bagRecommendationText: '25kg Farm Sack',
    notes: 'Dig a shallow 1-foot ring at drip line and blend with compost.',
  },
  {
    id: '5',
    plantCategory: 'Commercial Agriculture',
    cropName: 'Open Field Farming & Cereals',
    unitType: 'ACRE',
    soilType: 'All Soil Types',
    recommendedDoseGrams: 250000, // 250kg per acre
    bagRecommendationText: '10 Sacks of 25kg (or 1-Tonne Jumbo)',
    notes: 'Broadcast and till into root-depth (top 15cm) before sowing.',
  },
]

export function DoseCalculator({
  onAddRecommended,
}: {
  onAddRecommended: (title: string, weightKg: number, price: number) => void
}) {
  const [rules, setRules] = useState<DoseRule[]>(DEFAULT_RULES)
  const [selectedCrop, setSelectedCrop] = useState(DEFAULT_RULES[0].cropName)
  const [unitCount, setUnitCount] = useState<number>(10)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch('/api/dose/rules')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setRules(json.data)
          setSelectedCrop(json.data[0].cropName)
        }
      })
      .catch(() => {})
  }, [])

  const currentRule = rules.find((r) => r.cropName === selectedCrop) || rules[0]

  // Total biochar recommendation in kg
  const totalKg = ((currentRule.recommendedDoseGrams * unitCount) / 1000).toFixed(1)

  // Recommended bag selection
  const recommendedBags = () => {
    const kg = parseFloat(totalKg)
    if (kg <= 5) return { name: 'Ecozza Premium Biochar (5 kg Bag)', weightKg: 5, price: 499 }
    if (kg <= 10) return { name: 'Ecozza Premium Biochar (10 kg Pack)', weightKg: 10, price: 899 }
    return { name: 'Ecozza Farm Sack (25 kg)', weightKg: 25, price: 1899 }
  }

  const handleAddCart = () => {
    const bag = recommendedBags()
    onAddRecommended(bag.name, bag.weightKg, bag.price)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-900/5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            <Sprout className="w-3.5 h-3.5" />
            Agronomic Dose Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Scientific Soil Dose Calculator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Calculate exact biochar requirements based on crop and plant count to maximize microbial root colonisation.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
          <Calculator className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Input Parameters */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Crop or Plant Category
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {rules.map((r) => (
                <option key={r.id} value={r.cropName}>
                  {r.cropName} ({r.plantCategory})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {currentRule.unitType === 'POT'
                  ? 'Number of Pots / Planters'
                  : currentRule.unitType === 'TREE'
                  ? 'Number of Trees'
                  : 'Number of Half-Acres'}
              </label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {unitCount} units
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={unitCount}
              onChange={(e) => setUnitCount(parseInt(e.target.value) || 1)}
              className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1</span>
              <span>25</span>
              <span>50</span>
              <span>100+</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              Standard Application Rate
            </div>
            <p>
              {currentRule.recommendedDoseGrams >= 1000
                ? `${(currentRule.recommendedDoseGrams / 1000).toFixed(0)} kg per ${currentRule.unitType.toLowerCase()}`
                : `${currentRule.recommendedDoseGrams} grams per ${currentRule.unitType.toLowerCase()}`}
            </p>
            {currentRule.notes && (
              <p className="text-[11px] text-emerald-800 italic pt-1 border-t border-slate-200/60">
                Tip: {currentRule.notes}
              </p>
            )}
          </div>
        </div>

        {/* Calculation Result & Recommended Bag */}
        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex justify-between items-center text-xs text-emerald-400 font-medium">
              <span>Calculated Biomass Requirement</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> High Bio-Porosity
              </span>
            </div>

            <div className="mt-4">
              <span className="text-5xl font-black text-white tracking-tight">{totalKg}</span>
              <span className="text-xl font-bold text-emerald-300 ml-2">kg</span>
            </div>

            <div className="mt-6 pt-5 border-t border-emerald-800/80">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300/80 font-bold block mb-1">
                Recommended Product Pack
              </span>
              <h4 className="font-bold text-base text-white">{recommendedBags().name}</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Conveniently covers your requirement of {totalKg} kg with zero wastage.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Button
              onClick={handleAddCart}
              className={`w-full font-bold py-3 transition ${
                added
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Recommended Pack Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add Recommended Pack to Cart (₹{recommendedBags().price})
                </>
              )}
            </Button>

            <p className="text-[10px] text-slate-400 text-center mt-2.5">
              *Starting agronomy recommendation. Results vary by existing soil organic carbon and soil texture.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
