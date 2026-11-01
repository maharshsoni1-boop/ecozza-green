import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth.middleware.js'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /api/auth/me - Return currently authenticated user profile
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    res.json({ success: true, user: user || req.user })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch user profile', details: err.message })
  }
})

export default router
