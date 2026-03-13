import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/AppError'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    })
    return
  }

  console.error(err)
  res.status(500).json({
    error: { code: 'error_system', message: 'Internal server error' },
  })
}
