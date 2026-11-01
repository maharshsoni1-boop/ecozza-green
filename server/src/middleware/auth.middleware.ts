import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabase.js'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email?: string
    role?: string
  }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token', details: error?.message })
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: (user.user_metadata?.role as string) || 'customer',
    }

    next()
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to authenticate user', details: err.message })
  }
}
