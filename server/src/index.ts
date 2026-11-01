import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/product.routes.js'
import authRoutes from './routes/auth.routes.js'
import orderRoutes from './routes/order.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL || '',
    process.env.ADMIN_URL || '',
  ].filter(Boolean),
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ecozza Green Backend API',
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error]', err)
  res.status(500).json({ error: 'Internal Server Error', message: err?.message })
})

app.listen(PORT, () => {
  console.log(`🌿 Ecozza Green API Server running on http://localhost:${PORT}`)
})
