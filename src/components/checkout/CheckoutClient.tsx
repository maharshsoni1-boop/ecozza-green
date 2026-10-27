"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { checkPincodeServiceability, PincodeCheckResult } from "@/app/actions/pincode";
import { createOrder, confirmRazorpayPayment } from "@/app/actions/order";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, totalWeightKg, clearCart, isFreeShipping } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "Gujarat",
    postalCode: "",
    isB2B: false,
    companyName: "",
    customerGstin: "",
    paymentMethod: "RAZORPAY" as "RAZORPAY" | "COD",
  });

  const [pinResult, setPinResult] = useState<PincodeCheckResult | null>(null);
  const [pinChecking, setPinChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulated Razorpay Modal State for test/mock keys
  const [showRzpModal, setShowRzpModal] = useState(false);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<{
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    amountInr: number;
  } | null>(null);

  // Estimated Shipping
  const shippingFee = isFreeShipping
    ? 0
    : totalWeightKg <= 5
    ? 99
    : totalWeightKg <= 10
    ? 149
    : 249;

  const grandTotal = subtotal + shippingFee;

  // Indian GST Calculation
  // Concessional 5% rate for soil conditioner
  const gstTotal = Math.round((subtotal * 5) / 105);
  const isIntraState = formData.state.toLowerCase() === "gujarat";
  const cgstAmount = isIntraState ? (gstTotal / 2).toFixed(2) : "0.00";
  const sgstAmount = isIntraState ? (gstTotal / 2).toFixed(2) : "0.00";
  const igstAmount = !isIntraState ? gstTotal.toFixed(2) : "0.00";

  // Auto-check PIN when 6 digits are typed
  useEffect(() => {
    if (formData.postalCode.length === 6) {
      setPinChecking(true);
      checkPincodeServiceability(formData.postalCode)
        .then((res) => {
          setPinResult(res);
          if (res.city) setFormData((prev) => ({ ...prev, city: res.city! }));
          if (res.state && res.state !== "India")
            setFormData((prev) => ({ ...prev, state: res.state! }));
          if (!res.isCodAvailable && formData.paymentMethod === "COD") {
            setFormData((prev) => ({ ...prev, paymentMethod: "RAZORPAY" }));
          }
        })
        .finally(() => setPinChecking(false));
    } else {
      setPinResult(null);
    }
  }, [formData.postalCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (formData.postalCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit postal code.");
      return;
    }

    if (formData.isB2B && formData.customerGstin) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(formData.customerGstin.trim())) {
        setErrorMessage("Please enter a valid 15-character Indian GSTIN format.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const result = await createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerGstin: formData.isB2B ? formData.customerGstin : undefined,
        companyName: formData.isB2B ? formData.companyName : undefined,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        billingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      });

      if (!result.success) {
        setErrorMessage(result.error || "Failed to create order.");
        setSubmitting(false);
        return;
      }

      if (formData.paymentMethod === "COD") {
        clearCart();
        router.push(`/order-confirmation/${result.orderId}`);
        return;
      }

      // Razorpay Payment Flow
      setPendingOrderDetails({
        orderId: result.orderId!,
        orderNumber: result.orderNumber!,
        razorpayOrderId: result.razorpayOrderId!,
        amountInr: result.amountInr!,
      });
      setShowRzpModal(true);
      setSubmitting(false);
    } catch (err: any) {
      console.error("Checkout submission error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
      setSubmitting(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!pendingOrderDetails) return;
    setSubmitting(true);
    const mockPaymentId = `pay_mock_${Date.now()}`;
    const mockSignature = `sig_mock_${Date.now()}`;

    const res = await confirmRazorpayPayment({
      orderId: pendingOrderDetails.orderId,
      razorpayOrderId: pendingOrderDetails.razorpayOrderId,
      razorpayPaymentId: mockPaymentId,
      razorpaySignature: mockSignature,
    });

    if (res.success) {
      clearCart();
      router.push(`/order-confirmation/${pendingOrderDetails.orderId}`);
    } else {
      setErrorMessage(res.error || "Payment verification failed.");
      setShowRzpModal(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Delivery & Billing Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] space-y-4">
            <h2 className="text-base font-bold text-[#121614] font-heading flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A2B] text-white text-xs flex items-center justify-center">
                1
              </span>
              <span>Customer Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#121614]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#121614]">Mobile Number (+91) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9825012345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#121614]">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="For invoice and dispatch tracking links"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] space-y-4">
            <h2 className="text-base font-bold text-[#121614] font-heading flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A2B] text-white text-xs flex items-center justify-center">
                2
              </span>
              <span>Courier Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#121614]">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="Flat, House No., Farmhouse, Building name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[#121614]">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Road name, Area, Colony"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#121614]">6-Digit PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, "") })}
                  placeholder="e.g. 380001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
                {pinChecking && (
                  <span className="text-[10px] text-[#58635B]">Validating pincode...</span>
                )}
                {pinResult && (
                  <div className={`text-[11px] font-medium mt-1 ${pinResult.isServiceable ? "text-[#2E6B47]" : "text-red-600"}`}>
                    {pinResult.message}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#121614]">Landmark</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="Near temple, petrol pump, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#121614]">City / District *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Ahmedabad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#121614]">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Gujarat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D6] text-xs bg-[#FAF8F5] focus:outline-hidden focus:border-[#2E6B47]"
                />
              </div>
            </div>

            {/* Optional B2B Business Invoice (GSTIN) */}
            <div className="pt-4 border-t border-[#EFEBE1] space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isB2B}
                  onChange={(e) => setFormData({ ...formData, isB2B: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[#1E3A2B] focus:ring-[#2E6B47]"
                />
                <span className="text-xs font-semibold text-[#121614] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2E6B47]" />
                  <span>I need a B2B Tax Invoice (Input Tax Credit)</span>
                </span>
              </label>

              {formData.isB2B && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D6]">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#121614]">Company / Nursery Name *</label>
                    <input
                      type="text"
                      required={formData.isB2B}
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Sunrise Organic Nursery"
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E0D6] text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#121614]">15-Digit GSTIN *</label>
                    <input
                      type="text"
                      required={formData.isB2B}
                      maxLength={15}
                      value={formData.customerGstin}
                      onChange={(e) => setFormData({ ...formData, customerGstin: e.target.value.toUpperCase() })}
                      placeholder="e.g. 24AAAAE0000A1Z5"
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E0D6] text-xs bg-white uppercase"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] space-y-4">
            <h2 className="text-base font-bold text-[#121614] font-heading flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1E3A2B] text-white text-xs flex items-center justify-center">
                3
              </span>
              <span>Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Razorpay Online */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  formData.paymentMethod === "RAZORPAY"
                    ? "border-[#1E3A2B] bg-[#E9F4EE]/40 ring-1 ring-[#1E3A2B]"
                    : "border-[#E5E0D6] hover:bg-[#FAF8F5]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={formData.paymentMethod === "RAZORPAY"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "RAZORPAY" })}
                  className="mt-1 text-[#1E3A2B] focus:ring-[#2E6B47]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#121614] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#2E6B47]" />
                      <span>Razorpay Secure (UPI, Cards, Netbanking)</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#2E6B47] bg-[#E9F4EE] px-2 py-0.5 rounded-md">
                      Instant
                    </span>
                  </div>
                  <p className="text-[11px] text-[#58635B] mt-1 leading-relaxed">
                    Pay securely using Google Pay, PhonePe, Paytm, BHIM UPI, debit/credit cards, or netbanking.
                  </p>
                </div>
              </label>

              {/* Cash on Delivery (COD) */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  formData.paymentMethod === "COD"
                    ? "border-[#1E3A2B] bg-[#E9F4EE]/40 ring-1 ring-[#1E3A2B]"
                    : "border-[#E5E0D6] hover:bg-[#FAF8F5]"
                } ${pinResult && !pinResult.isCodAvailable ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  disabled={pinResult ? !pinResult.isCodAvailable : false}
                  checked={formData.paymentMethod === "COD"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "COD" })}
                  className="mt-1 text-[#1E3A2B] focus:ring-[#2E6B47]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#121614] flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-[#C06D38]" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    {pinResult && !pinResult.isCodAvailable && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        Not eligible for this PIN
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#58635B] mt-1 leading-relaxed">
                    Pay cash to courier executive upon delivery. Available on select serviced pincodes.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] space-y-5 shadow-xs sticky top-28">
            <h2 className="text-base font-bold font-heading text-[#121614] pb-3 border-b border-[#EFEBE1]">
              Order Summary & GST Breakup
            </h2>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-[#FAF8F5]">
              {items.map((item) => (
                <div key={item.variantId} className="pt-2 flex justify-between items-center text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-[#121614] truncate">{item.productName}</div>
                    <div className="text-[11px] text-[#58635B]">
                      {item.variantTitle} × {item.quantity} ({item.weightKg * item.quantity} kg)
                    </div>
                  </div>
                  <div className="font-bold text-[#121614] shrink-0">
                    ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-3 border-t border-[#EFEBE1] space-y-2 text-xs">
              <div className="flex justify-between text-[#58635B]">
                <span>Total Consignment Weight:</span>
                <span className="font-semibold text-[#121614]">{totalWeightKg} kg</span>
              </div>
              <div className="flex justify-between text-[#58635B]">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#121614]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-[#58635B]">
                <span>Pan-India Courier Delivery:</span>
                <span className="font-semibold text-[#121614]">
                  {shippingFee === 0 ? (
                    <span className="text-[#2E6B47]">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {/* GST Breakup */}
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EFEBE1] space-y-1 text-[11px] text-[#58635B]">
                <div className="font-semibold text-[#121614] flex justify-between">
                  <span>Concessional GST (5% Included):</span>
                  <span>₹{gstTotal}</span>
                </div>
                {isIntraState ? (
                  <>
                    <div className="flex justify-between">
                      <span>• CGST (2.5%):</span>
                      <span>₹{cgstAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• SGST (2.5%):</span>
                      <span>₹{sgstAmount}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>• IGST (5.0% Inter-state):</span>
                    <span>₹{igstAmount}</span>
                  </div>
                )}
                <div className="text-[10px] text-[#8C978F] pt-0.5">
                  HSN 31059090 • GSTIN 24AAAAE0000A1Z5
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-[#EFEBE1] text-base font-extrabold text-[#121614] font-heading">
                <span>Payable Amount:</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#1E3A2B] hover:bg-[#2E6B47] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {submitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#8DE0AD]" />
                  <span>
                    {formData.paymentMethod === "COD"
                      ? `Confirm Cash on Delivery (₹${grandTotal})`
                      : `Pay ₹${grandTotal} via Razorpay`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#58635B] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#2E6B47]" />
              <span>Direct dispatch from Gujarat facility</span>
            </div>
          </div>
        </div>
      </form>

      {/* Test / Mock Razorpay Simulation Modal */}
      {showRzpModal && pendingOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5E0D6] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE1]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1E3A2B] flex items-center justify-center text-[#8DE0AD]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#121614] font-heading">
                    Razorpay Payment Gateway
                  </h3>
                  <div className="text-[10px] text-[#2E6B47] font-semibold">
                    Test Mode Simulation
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-[#121614]">
                  ₹{pendingOrderDetails.amountInr}
                </div>
                <div className="text-[10px] text-[#58635B]">
                  {pendingOrderDetails.orderNumber}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#58635B] leading-relaxed">
              In test mode, click below to simulate an immediate successful UPI / Card authentication and trigger the verified order workflow.
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2E6B47] hover:bg-[#388E5A] text-white text-xs font-bold transition-colors shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate Successful UPI Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRzpModal(false)}
                className="w-full py-2 text-xs font-semibold text-[#58635B] hover:text-[#121614]"
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
