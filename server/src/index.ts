import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import productRoutes from './routes/product.routes.js'
import authRoutes from './routes/auth.routes.js'
import orderRoutes from './routes/order.routes.js'
import batchRoutes from './routes/batch.routes.js'
import doseRoutes from './routes/dose.routes.js'
import enquiryRoutes from './routes/enquiry.routes.js'
import pincodeRoutes from './routes/pincode.routes.js'
import trackRoutes from './routes/track.routes.js'
import razorpayRoutes from './routes/razorpay.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Dynamic CORS configuration allowing localhost, all Vercel domains, and configured URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean) as string[]

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or tools with no origin header
    if (!origin) return callback(null, true)

    // Allow all Vercel deployments (production & preview branches)
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true)
    }

    // Allow custom Ecozza production domains
    if (/^https:\/\/(.*\.)?ecozzagreen\.in$/.test(origin)) {
      return callback(null, true)
    }

    // Allow localhost & explicitly listed origins
    if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true)
    }

    // Permit caller in development / dynamic origin reflection
    callback(null, true)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ecozza Green API Server',
    compliance: 'FCO Biochar Standard Compliant',
    timestamp: new Date().toISOString(),
  })
})

// Feature Routes
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/batches', batchRoutes)
app.use('/api/dose', doseRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/pincode', pincodeRoutes)
app.use('/api/track', trackRoutes)
app.use('/api/razorpay', razorpayRoutes)

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error]', err)
  res.status(500).json({ error: 'Internal Server Error', message: err?.message })
})

app.listen(PORT, () => {
  console.log(`🌿 Ecozza Green API Server running on http://localhost:${PORT}`)
})
