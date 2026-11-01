import crypto from 'crypto'

export interface RazorpayOrderResponse {
  id: string
  amount: number // in paise
  currency: string
  receipt: string
  status: string
}

export async function createRazorpayOrder(
  orderNumber: string,
  amountInInr: number
): Promise<RazorpayOrderResponse> {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_ecozza'
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_ecozza'
  const amountInPaise = Math.round(amountInInr * 100)

  // If mock keys or local dev without live credentials, return simulated order
  if (keyId.includes('mock') || keySecret.includes('mock') || !keySecret) {
    return {
      id: `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderNumber,
      status: 'created',
    }
  }

  // Real Razorpay API Call
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        brand: 'Ecozza Green',
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Razorpay order creation failed:', errorText)
    throw new Error(`Razorpay API error: ${response.statusText}`)
  }

  return (await response.json()) as RazorpayOrderResponse
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key_ecozza'

  if (keySecret.includes('mock')) {
    return true // Allow simulated payments in local development
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  return generatedSignature === signature
}
