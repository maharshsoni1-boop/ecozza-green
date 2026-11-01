import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /api/dose/rules - List all dose rules
router.get('/rules', async (req: Request, res: Response) => {
  try {
    const rules = await prisma.doseRule.findMany({
      orderBy: [{ plantCategory: 'asc' }, { cropName: 'asc' }],
    })
    res.json({ success: true, data: rules })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch dose rules', details: err.message })
  }
})

// POST /api/dose/rules - Create or update dose rule (Admin)
router.post('/rules', async (req: Request, res: Response) => {
  try {
    const {
      id,
      plantCategory,
      cropName,
      unitType,
      soilType = 'General Soil',
      recommendedDoseGrams,
      bagRecommendationText,
      notes,
    } = req.body

    if (!plantCategory || !cropName || !unitType || recommendedDoseGrams === undefined) {
      return res.status(400).json({ success: false, error: 'Missing required dose rule fields' })
    }

    const payload = {
      plantCategory: plantCategory.trim(),
      cropName: cropName.trim(),
      unitType: unitType.trim(),
      soilType: soilType.trim(),
      recommendedDoseGrams: Number(recommendedDoseGrams),
      bagRecommendationText: bagRecommendationText?.trim() || null,
      notes: notes?.trim() || null,
    }

    let rule
    if (id) {
      rule = await prisma.doseRule.update({
        where: { id },
        data: payload,
      })
    } else {
      rule = await prisma.doseRule.create({
        data: payload,
      })
    }

    res.json({ success: true, data: rule })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to save dose rule', details: err.message })
  }
})

// DELETE /api/dose/rules/:id
router.delete('/rules/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    await prisma.doseRule.delete({ where: { id } })
    res.json({ success: true, message: 'Dose rule deleted successfully' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to delete dose rule', details: err.message })
  }
})

export default router
