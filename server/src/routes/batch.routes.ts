import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /api/batches - List verified batch lab reports
router.get('/', async (req: Request, res: Response) => {
  try {
    const { all } = req.query
    const where: any = all === 'true' ? {} : { isVerified: true }

    const batches = await prisma.batchLabReport.findMany({
      where,
      orderBy: { testDate: 'desc' },
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    })
    res.json({ success: true, data: batches })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch lab reports', details: err.message })
  }
})

// POST /api/batches - Create or update lab report
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      id,
      batchNumber,
      productId,
      testDate,
      labName,
      labReportPdfUrl,
      carbonPercentage,
      phValue,
      moisturePercentage,
      granuleSizeMm,
      bulkDensity,
      heavyMetalsSummary,
      notes,
      isVerified,
    } = req.body

    if (!batchNumber) {
      return res.status(400).json({ success: false, error: 'Batch Number is required' })
    }

    const payload = {
      batchNumber: batchNumber.trim(),
      productId: productId || null,
      testDate: testDate ? new Date(testDate) : new Date(),
      labName: labName?.trim() || 'NABL Accredited Testing Lab',
      labReportPdfUrl: labReportPdfUrl?.trim() || null,
      carbonPercentage: carbonPercentage !== undefined ? Number(carbonPercentage) : null,
      phValue: phValue !== undefined ? Number(phValue) : null,
      moisturePercentage: moisturePercentage !== undefined ? Number(moisturePercentage) : null,
      granuleSizeMm: granuleSizeMm?.trim() || '2 mm - 5 mm',
      bulkDensity: bulkDensity !== undefined ? Number(bulkDensity) : null,
      heavyMetalsSummary: heavyMetalsSummary?.trim() || 'Below detection limits (FCO Compliant)',
      notes: notes?.trim() || null,
      isVerified: Boolean(isVerified),
    }

    let batch
    if (id) {
      batch = await prisma.batchLabReport.update({
        where: { id },
        data: payload,
      })
    } else {
      batch = await prisma.batchLabReport.create({
        data: payload,
      })
    }

    res.json({ success: true, data: batch })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to save batch report', details: err.message })
  }
})

// DELETE /api/batches/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    await prisma.batchLabReport.delete({ where: { id } })
    res.json({ success: true, message: 'Batch report deleted successfully' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to delete batch report', details: err.message })
  }
})

export default router
