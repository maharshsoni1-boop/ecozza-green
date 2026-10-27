"use client";

import React, { useState } from "react";
import { saveDoseRuleAction, deleteDoseRuleAction } from "@/app/actions/admin-dose";
import { Calculator, Plus, Trash2, Edit2, Check, AlertCircle } from "lucide-react";

interface DoseRule {
  id: string;
  plantCategory: string;
  cropName: string;
  unitType: string;
  soilType: string;
  recommendedDoseGrams: number;
  bagRecommendationText: string | null;
  notes: string | null;
}

export function AdminDoseTableManager({ initialRules }: { initialRules: DoseRule[] }) {
  const [rules, setRules] = useState(initialRules);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<DoseRule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    plantCategory: "Potted Plants",
    cropName: "",
    unitType: "POT",
    soilType: "Sandy Soil",
    recommendedDoseGrams: 100,
    bagRecommendationText: "",
    notes: "Starting recommendation. Results vary by soil.",
  });

  const handleOpenAdd = () => {
    setEditingRule(null);
    setForm({
      plantCategory: "Potted Plants",
      cropName: "",
      unitType: "POT",
      soilType: "Sandy Soil",
      recommendedDoseGrams: 100,
      bagRecommendationText: "",
      notes: "Starting recommendation. Results vary by soil.",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (rule: DoseRule) => {
    setEditingRule(rule);
    setForm({
      plantCategory: rule.plantCategory,
      cropName: rule.cropName,
      unitType: rule.unitType,
      soilType: rule.soilType,
      recommendedDoseGrams: rule.recommendedDoseGrams,
      bagRecommendationText: rule.bagRecommendationText || "",
      notes: rule.notes || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await saveDoseRuleAction({
      id: editingRule?.id,
      ...form,
    });

    if (res.success) {
      setShowModal(false);
      window.location.reload();
    } else {
      setError(res.error || "Failed to save rule");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dose rule?")) return;
    const res = await deleteDoseRuleAction(id);
    if (res.success) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-xs text-[#58635B]">
          Showing <strong>{rules.length}</strong> dynamic dose rules. No formulas are hardcoded.
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dose Rule</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E0D6] overflow-hidden divide-y divide-[#EFEBE1]">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#EFEBE1] text-left text-[#58635B] bg-[#FAF8F5]">
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Crop / Plant</th>
              <th className="p-4 font-semibold">Unit</th>
              <th className="p-4 font-semibold">Soil Type</th>
              <th className="p-4 font-semibold">Dose (Grams)</th>
              <th className="p-4 font-semibold">Recommendation</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF8F5]">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-[#FAF8F5]/80">
                <td className="p-4 font-semibold text-[#121614]">{rule.plantCategory}</td>
                <td className="p-4 font-bold text-[#121614]">{rule.cropName}</td>
                <td className="p-4">{rule.unitType}</td>
                <td className="p-4">{rule.soilType}</td>
                <td className="p-4 font-bold text-[#2E6B47]">{rule.recommendedDoseGrams}g</td>
                <td className="p-4 text-[#58635B] max-w-xs">{rule.bagRecommendationText}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(rule)}
                      className="p-1.5 text-[#58635B] hover:text-[#121614] hover:bg-[#EFEBE1] rounded-lg"
                      title="Edit rule"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4">
            <h3 className="text-base font-bold font-heading text-[#121614]">
              {editingRule ? "Edit Dose Recommendation Rule" : "Add New Dose Recommendation Rule"}
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#121614]">Plant Category *</label>
                  <select
                    value={form.plantCategory}
                    onChange={(e) => setForm({ ...form, plantCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  >
                    <option value="Potted Plants">Potted Plants</option>
                    <option value="Fruit Orchards">Fruit Orchards</option>
                    <option value="Vegetables & Greens">Vegetables & Greens</option>
                    <option value="Nursery Beds">Nursery Beds</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#121614]">Unit Type *</label>
                  <select
                    value={form.unitType}
                    onChange={(e) => setForm({ ...form, unitType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  >
                    <option value="POT">Per Pot</option>
                    <option value="TREE">Per Tree</option>
                    <option value="ACRE">Per Acre</option>
                    <option value="SQFT">Per Sq. Ft.</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#121614]">Crop / Plant Name *</label>
                <input
                  type="text"
                  required
                  value={form.cropName}
                  onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                  placeholder="e.g. Tomatoes & Chilli"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#121614]">Soil Type *</label>
                  <select
                    value={form.soilType}
                    onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  >
                    <option value="Sandy Soil">Sandy Soil</option>
                    <option value="Clayey / Heavy Soil">Clayey / Heavy Soil</option>
                    <option value="Loamy Soil">Loamy Soil</option>
                    <option value="Degraded / Low Carbon">Degraded / Low Carbon</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#121614]">Recommended Dose (Grams) *</label>
                  <input
                    type="number"
                    required
                    value={form.recommendedDoseGrams}
                    onChange={(e) => setForm({ ...form, recommendedDoseGrams: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#121614]">Application Instructions</label>
                <input
                  type="text"
                  value={form.bagRecommendationText}
                  onChange={(e) => setForm({ ...form, bagRecommendationText: e.target.value })}
                  placeholder="e.g. Mix 2 scoops into top 2 inches of potting mix"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D6] mt-1 bg-[#FAF8F5]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white font-bold"
                >
                  {loading ? "Saving..." : "Save Dose Rule"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E0D6] text-[#58635B]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
