import React from 'react'
import { X, ShieldCheck } from 'lucide-react'

export type PolicyKey = 'privacy' | 'terms' | 'shipping' | 'returns'

const POLICIES: Record<PolicyKey, { title: string; subtitle: string; content: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How Ecozza Green handles customer details, deliveries, and payment data.',
    content: [
      '1. Information We Collect: Name, mobile phone number, shipping address, email, and optional GSTIN (for tax invoicing).',
      '2. Purpose of Collection: Information is used exclusively for order delivery via logistics partners (Shiprocket), sending transaction SMS/email updates, and generating GST invoices.',
      '3. Payment Data Security: All transactions are processed directly by Razorpay through encrypted 256-bit SSL sessions. Ecozza Green never stores card numbers or UPI PINs.',
      '4. Cookies: We use functional session cookies to store your cart contents and order preferences.',
    ],
  },
  terms: {
    title: 'Terms and Conditions of Sale',
    subtitle: 'Standard legal conditions governing orders and purchases from Ecozza Green.',
    content: [
      '1. Product Classification: Ecozza Green products are sold as granular biochar soil conditioners under FCO guidelines. They enhance soil moisture and nutrient retention and do not substitute fertilizers.',
      '2. Starting Recommendations: Agronomy recommendations are starting guidelines. Results vary by soil organic carbon, moisture, and agricultural practices.',
      '3. Pricing & Taxes: All consumer prices are inclusive of 5% concessional GST under HSN code 31059090.',
      '4. Legal Jurisdiction: Any disputes arising from transactions on this site shall be subject to the exclusive jurisdiction of the competent courts in Gujarat, India.',
    ],
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    subtitle: 'Pan-India courier logistics, delivery timelines, and heavy freight rates.',
    content: [
      '1. Delivery Coverage: Pan-India delivery across all serviceable postal pincodes via express courier network.',
      '2. Free Shipping: Orders over ₹1,499 qualify for 100% FREE courier delivery.',
      '3. Delivery Timelines: Gujarat and neighboring states: 2-3 business days. Other major states: 4-6 business days.',
      '4. Damaged Bags: If packaging arrives punctured in transit, contact care@ecozza.green or WhatsApp within 48 hours for immediate replacement.',
    ],
  },
  returns: {
    title: 'Returns & Refund Policy',
    subtitle: 'Guidelines for order cancellations, replacements, and Razorpay refunds.',
    content: [
      '1. Cancellations: Orders can be cancelled free of charge before dispatch from our warehouse.',
      '2. Returns: Unopened, sealed bags may be returned within 7 days of delivery.',
      '3. Defective Product: In the unlikely event of receiving damaged goods, we issue a free replacement or 100% refund.',
      '4. Refund Timelines: Approved refunds are processed back to the original source (UPI, Card, or Netbanking) via Razorpay within 5 to 7 business days.',
    ],
  },
}

export function PolicyModal({
  policyKey,
  onClose,
}: {
  policyKey: PolicyKey | null
  onClose: () => void
}) {
  if (!policyKey) return null
  const policy = POLICIES[policyKey]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">{policy.title}</h3>
            <p className="text-[11px] text-slate-500">{policy.subtitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="py-4 space-y-3 overflow-y-auto text-xs text-slate-600 leading-relaxed flex-1">
          {policy.content.map((point, idx) => (
            <p key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              {point}
            </p>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition mt-2"
        >
          Close
        </button>
      </div>
    </div>
  )
}
