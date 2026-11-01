import React, { useState } from 'react'
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Truck,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface CartItem {
  variantId: string
  productName: string
  variantTitle: string
  price: number
  weightKg: number
  quantity: number
  image?: string
}

export function CheckoutDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
}: {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (variantId: string, delta: number) => void
  onClearCart: () => void
}) {
  const [step, setStep] = useState<'cart' | 'shipping' | 'success'>('cart')
  const [pincode, setPincode] = useState('')
  const [pincodeInfo, setPincodeInfo] = useState<any>(null)
  const [pinLoading, setPinLoading] = useState(false)
  const [pinError, setPinError] = useState<string | null>(null)

  // Customer Details
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerGstin, setCustomerGstin] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Gujarat')

  const [orderResult, setOrderResult] = useState<any>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalWeightKg = cart.reduce((acc, item) => acc + item.weightKg * item.quantity, 0)

  // Shipping Fee calculation
  const shippingFee = pincodeInfo?.shippingFee ?? (subtotal >= 1499 ? 0 : 99)
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst + shippingFee

  // Live Pincode Verification
  const checkPincode = async () => {
    if (!pincode.trim() || pincode.trim().length !== 6) {
      setPinError('Please enter a valid 6-digit PIN code')
      return
    }
    setPinLoading(true)
    setPinError(null)
    try {
      const res = await fetch(`/api/pincode/${pincode.trim()}?weightKg=${totalWeightKg}&subtotal=${subtotal}`)
      const json = await res.json()
      if (json.success) {
        setPincodeInfo(json.data)
        setCity(json.data.city)
        setState(json.data.state)
      } else {
        setPinError(json.error || 'Pincode not serviceable')
      }
    } catch {
      setPinError('Failed to check pincode')
    } finally {
      setPinLoading(false)
    }
  }

  // Handle Order Placement & Razorpay
  const handlePlaceOrder = async () => {
    if (!customerName || !customerPhone || !addressLine) {
      alert('Please fill in Name, Phone, and Address Line.')
      return
    }

    setIsPlacingOrder(true)
    try {
      // 1. Create order on server
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          subtotalAmount: subtotal,
          taxAmount: gst,
          shippingAmount: shippingFee,
          totalAmount: total,
          customerName,
          customerPhone,
          customerEmail: customerEmail || 'guest@ecozza.green',
          customerGstin,
          shippingAddress: {
            addressLine,
            city: city || pincodeInfo?.city || 'City',
            state: state || pincodeInfo?.state || 'State',
            pincode,
          },
          billingAddress: {
            addressLine,
            city,
            state,
            pincode,
          },
        }),
      })

      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      const createdOrder = json.data

      // 2. Initialize simulated Razorpay checkout
      const rzpRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: createdOrder.id }),
      })
      const rzpJson = await rzpRes.json()

      // 3. Confirm payment verification
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: rzpJson.data.razorpayOrderId,
          razorpayPaymentId: `pay_rzp_${Date.now()}`,
          razorpaySignature: 'simulated_sig',
        }),
      })
      const verifyJson = await verifyRes.json()

      setOrderResult({
        ...createdOrder,
        invoiceNumber: verifyJson.data.invoiceNumber,
      })
      setStep('success')
      onClearCart()
    } catch (err: any) {
      alert(`Order placement error: ${err.message}`)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h3 className="text-lg font-bold text-slate-900">
              {step === 'cart'
                ? `Cart (${cart.reduce((a, b) => a + b.quantity, 0)})`
                : step === 'shipping'
                ? 'Delivery & Checkout'
                : 'Order Confirmed!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART VIEW */}
        {step === 'cart' && (
          <>
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-400 mt-1">
                  Add organic biochar bags to heal your soil.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 gap-3"
                  >
                    <img
                      src={item.image || '/images/product-biochar.jpg'}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-slate-900 truncate">{item.productName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {item.variantTitle} ({item.weightKg} kg)
                      </p>
                      <p className="text-xs font-bold text-emerald-800 mt-0.5">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.variantId, -1)}
                          className="p-1.5 hover:text-emerald-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.variantId, 1)}
                          className="p-1.5 hover:text-emerald-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => onUpdateQuantity(item.variantId, -item.quantity)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalWeightKg} kg)</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5% Organic Soil Amendment)</span>
                    <span className="font-semibold text-slate-900">₹{gst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-700">
                      {subtotal >= 1499 ? 'FREE (Orders > ₹1499)' : 'Calculated at checkout'}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 shadow-md shadow-emerald-700/20"
                  onClick={() => setStep('shipping')}
                >
                  Proceed to Delivery Details
                </Button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: SHIPPING & PAYMENT */}
        {step === 'shipping' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
            {/* Pincode Check */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <label className="font-bold text-emerald-950 uppercase block text-[10px]">
                Delivery Postal Pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 380015"
                  className="flex-1 p-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={checkPincode}
                  disabled={pinLoading}
                  className="text-xs border-emerald-300 text-emerald-800"
                >
                  {pinLoading ? 'Checking...' : 'Check TAT'}
                </Button>
              </div>

              {pincodeInfo && (
                <div className="text-[11px] text-emerald-800 font-medium pt-1">
                  ✓ Delivering to {pincodeInfo.city}, {pincodeInfo.state} in approx. {pincodeInfo.deliveryTatDays} days via {pincodeInfo.carrierName} ({pincodeInfo.isFreeShipping ? 'FREE' : `₹${pincodeInfo.shippingFee}`}).
                </div>
              )}
              {pinError && <div className="text-[11px] text-red-600 font-medium">{pinError}</div>}
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 uppercase block text-[10px] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ananya Patel"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block text-[10px] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block text-[10px] mb-1">
                    Email (for Tax Invoice)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block text-[10px] mb-1">
                  Complete Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Plot/Flat number, Street name, Landmark"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block text-[10px] mb-1">
                  GSTIN (Optional for Farm / B2B Input Tax Credit)
                </label>
                <input
                  type="text"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value)}
                  placeholder="24AAAAA0000A1Z5"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-semibold text-slate-900">₹{gst}</span>
              </div>
              <div className="flex justify-between">
                <span>Freight Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Final Payable</span>
                <span className="text-emerald-800">₹{total}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep('cart')}
                className="w-1/3 text-xs"
              >
                Back to Cart
              </Button>
              <Button
                disabled={isPlacingOrder}
                onClick={handlePlaceOrder}
                className="w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 text-xs shadow-md shadow-emerald-700/20"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isPlacingOrder ? 'Processing Payment...' : `Pay ₹${total} (Razorpay)`}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {step === 'success' && orderResult && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-600">
              Payment confirmed via Razorpay. Your certified biochar is being prepared for dispatch.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 w-full text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-bold text-slate-900">{orderResult.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tax Invoice:</span>
                <span className="font-bold text-emerald-800">{orderResult.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Paid:</span>
                <span className="font-bold text-slate-900">₹{orderResult.totalAmount}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setStep('cart')
                onClose()
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
