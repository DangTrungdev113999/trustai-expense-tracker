import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({
      error: { code: 'unauthorized', message: 'Missing or invalid token' },
    })
    return
  }

  try {
    const { userId } = verifyToken(header.slice(7))
    req.userId = userId
    next()
  } catch {
    res.status(401).json({
      error: { code: 'unauthorized', message: 'Invalid token' },
    })
  }
}
