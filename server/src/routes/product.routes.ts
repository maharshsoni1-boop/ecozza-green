import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /api/products - List products with optional search & category filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, limit = '50', page = '1' } = req.query

    const take = parseInt(limit as string, 10)
    const skip = (parseInt(page as string, 10) - 1) * take

    const where: any = { isPublished: true }
    if (category && typeof category === 'string') {
      where.category = { contains: category }
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { shortDescription: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take,
        skip,
        include: {
          variants: true,
          reviews: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    // Parse image JSON strings safely
    const formatted = products.map((p) => {
      let parsedImages: string[] = []
      try {
        parsedImages = JSON.parse(p.images)
      } catch {
        parsedImages = p.images ? [p.images] : []
      }
      return {
        ...p,
        imagesList: parsedImages,
      }
    })

    res.json({
      success: true,
      data: formatted,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch products', details: err.message })
  }
})

// GET /api/products/:idOrSlug
router.get('/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const idOrSlug = req.params.idOrSlug as string

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        variants: true,
        batchReports: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }

    let parsedImages: string[] = []
    try {
      parsedImages = JSON.parse(product.images)
    } catch {
      parsedImages = product.images ? [product.images] : []
    }

    res.json({
      success: true,
      data: {
        ...product,
        imagesList: parsedImages,
      },
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch product', details: err.message })
  }
})

export default router
