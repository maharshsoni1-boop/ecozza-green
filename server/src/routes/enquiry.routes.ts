import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// GET /api/enquiries - List all B2B leads (Admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const leads = await prisma.leadEnquiry.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, data: leads })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch enquiries', details: err.message })
  }
})

// POST /api/enquiries - Submit commercial bulk quote enquiry
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      companyName,
      gstin,
      phone,
      email,
      locationState,
      locationCity,
      cropType,
      quantityText,
      message,
    } = req.body

    if (!name || !phone || !locationState || !quantityText) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in Name, Phone, State, and Expected Quantity',
      })
    }

    const lead = await prisma.leadEnquiry.create({
      data: {
        name: name.trim(),
        companyName: companyName?.trim() || null,
        gstin: gstin?.trim() || null,
        phone: phone.trim(),
        email: email?.trim() || null,
        locationState: locationState.trim(),
        locationCity: locationCity?.trim() || null,
        cropType: cropType?.trim() || null,
        quantityText: quantityText.trim(),
        message: message?.trim() || null,
        status: 'NEW',
      },
    })

    res.status(201).json({ success: true, data: lead, message: 'Enquiry received. Our agronomy team will contact you within 24 hours.' })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to submit enquiry', details: err.message })
  }
})

// PATCH /api/enquiries/:id/status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const { status, adminNotes } = req.body

    const updated = await prisma.leadEnquiry.update({
      where: { id },
      data: {
        status: status || undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    })
    res.json({ success: true, data: updated })
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to update enquiry', details: err.message })
  }
})

export default router
