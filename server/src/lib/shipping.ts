import { prisma } from './prisma.js'

export interface ShippingRateResult {
  shippingFee: number
  isFreeShipping: boolean
  serviceable: boolean
  isCodAvailable: boolean
  deliveryTatDays: number
  carrierName: string
  city?: string
  state?: string
  localities?: string[]
}

export interface ShippingProvider {
  getShippingRate(pincode: string, weightKg: number, subtotal: number): Promise<ShippingRateResult>
  createShipment(order: any): Promise<{ trackingNumber: string; carrierName: string; trackingUrl: string; shipmentId?: string | number; orderId?: string | number } | null>
  trackShipment?(trackingNumber: string): Promise<any>
}

class ShiprocketShippingProvider implements ShippingProvider {
  private token: string | null = null
  private tokenExpiresAt: number = 0

  private async getToken(): Promise<string | null> {
    const email = process.env.SHIPROCKET_EMAIL
    const password = process.env.SHIPROCKET_PASSWORD

    if (!email || !password) {
      console.warn('[Shiprocket] Missing SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD')
      return null
    }

    // Reuse valid token if available
    if (this.token && Date.now() < this.tokenExpiresAt) {
      return this.token
    }

    try {
      const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('[Shiprocket Auth Error]', res.status, errText)
        return null
      }

      const json = (await res.json()) as any
      if (json.token) {
        this.token = json.token
        // Cache token for 9 days (Shiprocket tokens expire in 10 days)
        this.tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000
        return this.token
      }
      return null
    } catch (err: any) {
      console.error('[Shiprocket Auth Network Error]', err.message)
      return null
    }
  }

  async getShippingRate(pincode: string, weightKg: number, _subtotal: number): Promise<ShippingRateResult> {
    const pin = pincode.trim()
    const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '385001'

    // Attempt live Shiprocket serviceability & postcode details in parallel
    const token = await this.getToken()
    if (token) {
      try {
        const serviceUrl = `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${pickupPincode}&delivery_postcode=${pin}&weight=${Math.max(weightKg, 0.5)}&cod=0`
        const postcodeUrl = `https://apiv2.shiprocket.in/v1/external/open/postcode/details?postcode=${pin}`

        const [serviceRes, postcodeRes] = await Promise.all([
          fetch(serviceUrl, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }),
          fetch(postcodeUrl, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          }).catch(() => null),
        ])

        let officialLocalities: string[] = []
        let postCity: string | undefined
        let postState: string | undefined

        if (postcodeRes && postcodeRes.ok) {
          try {
            const postJson = (await postcodeRes.json()) as any
            if (postJson.success && postJson.postcode_details) {
              const loc = postJson.postcode_details.locality
              officialLocalities = Array.isArray(loc) ? loc : loc ? [loc] : []
              postCity = postJson.postcode_details.city
              postState = postJson.postcode_details.state
            }
          } catch {}
        }

        if (serviceRes.ok) {
          const json = (await serviceRes.json()) as any
          const couriers = json.data?.available_courier_companies || []

          if (couriers.length > 0) {
            // Pick lowest rate among available couriers (most cost-effective for customer)
            const sortedCouriers = [...couriers].sort((a: any, b: any) => parseFloat(a.rate) - parseFloat(b.rate))
            const recommended = sortedCouriers[0]
            const carrierName = `Shiprocket (${recommended.courier_name})`
            const tatDays = recommended.estimated_delivery_days ? parseInt(recommended.estimated_delivery_days, 10) : 4
            // Live shipping cost directly from Shiprocket API response
            const liveShippingFee = Math.round(parseFloat(recommended.rate))

            return {
              shippingFee: liveShippingFee,
              isFreeShipping: false,
              serviceable: true,
              isCodAvailable: Boolean(recommended.is_cod),
              deliveryTatDays: tatDays || 4,
              carrierName,
              city: postCity || recommended.city || undefined,
              state: postState || recommended.state || undefined,
              localities: officialLocalities,
            }
          }
        }
      } catch (err: any) {
        console.warn('[Shiprocket Serviceability Fallback]', err.message)
      }
    }

    // Fallback if Shiprocket API unconfigured or no courier found
    const pinRecord = await prisma.pincodeServiceability.findUnique({
      where: { pincode: pin },
    }).catch(() => null)

    let fallbackFee = 99
    if (weightKg <= 5) fallbackFee = 99
    else if (weightKg <= 10) fallbackFee = 149
    else if (weightKg <= 25) fallbackFee = 249
    else fallbackFee = 249 + Math.ceil(weightKg - 25) * 15

    return {
      shippingFee: fallbackFee,
      isFreeShipping: false,
      serviceable: pinRecord ? pinRecord.isServiceable : true,
      isCodAvailable: false,
      deliveryTatDays: pinRecord ? pinRecord.deliveryTatDays : 4,
      carrierName: 'Shiprocket Surface Express',
    }
  }

  async createShipment(order: any): Promise<{ trackingNumber: string; carrierName: string; trackingUrl: string; shipmentId?: string | number; orderId?: string | number } | null> {
    const maxRetries = 2
    let attempt = 0

    while (attempt <= maxRetries) {
      attempt++
      try {
        const token = await this.getToken()
        if (!token) {
          console.error('[Shiprocket] Cannot create shipment: Authentication token unavailable (Attempt ' + attempt + ')')
          if (attempt <= maxRetries) {
            await new Promise((r) => setTimeout(r, 1500))
            continue
          }
          return null
        }

        let shippingAddress: any = {}
        try {
          shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : (order.shippingAddress || {})
        } catch {
          shippingAddress = { addressLine1: order.shippingAddress }
        }

        const orderItems = (order.orderItems || []).map((item: any) => ({
          name: item.productName || 'Ecozza Green Biochar',
          sku: item.variantTitle || 'EG-BIOCHAR',
          units: item.quantity || 1,
          selling_price: item.unitPrice || item.price || 449,
          tax: 5,
        }))

        const nameParts = (order.customerName || 'Customer').trim().split(/\s+/)
        const firstName = nameParts[0] || 'Customer'
        const lastName = nameParts.slice(1).join(' ') || '.'
        const cleanPhone = (order.customerPhone || '9876543210').replace(/\D/g, '').slice(-10)

        // Sanitize state: if state is 'India' or missing, derive from pincode or city
        let stateName = (shippingAddress.state || '').trim()
        if (!stateName || stateName.toLowerCase() === 'india') {
          const pin = (shippingAddress.postalCode || shippingAddress.pincode || '385001').toString()
          if (pin.startsWith('38') || pin.startsWith('39')) stateName = 'Gujarat'
          else if (pin.startsWith('82') || pin.startsWith('83')) stateName = 'Jharkhand'
          else if (pin.startsWith('11')) stateName = 'Delhi'
          else if (pin.startsWith('40') || pin.startsWith('41') || pin.startsWith('42')) stateName = 'Maharashtra'
          else if (pin.startsWith('56')) stateName = 'Karnataka'
          else stateName = 'Gujarat'
        }

        const rawAddress = (shippingAddress.addressLine1 || shippingAddress.addressLine || 'Plot 1, Ecozza Green Delivery').trim()
        const billingAddress = rawAddress.length >= 10 ? rawAddress : `${rawAddress}, Ecozza Farm Delivery`

        const payload = {
          order_id: order.orderNumber,
          order_date: new Date(order.createdAt || Date.now()).toISOString().split('T')[0],
          pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
          channel_id: '',
          billing_customer_name: firstName,
          billing_last_name: lastName,
          billing_address: billingAddress,
          billing_address_2: shippingAddress.addressLine2 || (shippingAddress.landmark ? `Near: ${shippingAddress.landmark}` : ''),
          billing_city: shippingAddress.city || 'Palanpur',
          billing_pincode: shippingAddress.postalCode || shippingAddress.pincode || '385001',
          billing_state: stateName,
          billing_country: 'India',
          billing_email: order.customerEmail || 'care@ecozzagreen.in',
          billing_phone: cleanPhone || '9876543210',
          shipping_is_billing: true,
          order_items: orderItems.length ? orderItems : [{ name: 'Ecozza Green Biochar', sku: 'EG-BIOCHAR-5KG', units: 1, selling_price: order.totalAmount || 449 }],
          payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
          sub_total: order.subtotalAmount || order.totalAmount || 449,
          length: 25,
          breadth: 20,
          height: 15,
          weight: Math.max(order.orderItems?.reduce((sum: number, it: any) => sum + (it.weightKg || 1) * (it.quantity || 1), 0) || 5, 1),
        }

        const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          const json = (await res.json()) as any
          const shipmentId = json.shipment_id || json.order_id
          const awb = json.awb_code || `SR-${shipmentId}`
          console.log(`[Shiprocket Shipment Created] Order: ${order.orderNumber}, Shipment ID: ${shipmentId}, AWB: ${awb}`)

          return {
            trackingNumber: awb,
            carrierName: json.courier_name || 'Shiprocket Express',
            trackingUrl: `https://shiprocket.co/tracking/${awb}`,
            shipmentId,
            orderId: json.order_id,
          }
        } else {
          const errText = await res.text()
          console.error(`[Shiprocket Create Shipment Failed] Attempt ${attempt}: ${res.status} - ${errText}`)
          if (attempt <= maxRetries) {
            await new Promise((r) => setTimeout(r, 2000))
            continue
          }
        }
      } catch (err: any) {
        console.error(`[Shiprocket Create Shipment Error] Attempt ${attempt}:`, err.message)
        if (attempt <= maxRetries) {
          await new Promise((r) => setTimeout(r, 2000))
          continue
        }
      }
    }

    // Return null when Shiprocket fails so caller knows shipment requires fulfillment retry
    return null
  }

  async trackShipment(trackingNumber: string): Promise<any> {
    const token = await this.getToken()
    if (!token) return null

    try {
      const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(trackingNumber)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        return await res.json()
      }
    } catch (err: any) {
      console.warn('[Shiprocket Tracking Error]', err.message)
    }
    return null
  }
}

export const shippingService: ShippingProvider = new ShiprocketShippingProvider()
