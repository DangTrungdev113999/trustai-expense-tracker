import type { Request, Response } from 'express'
import { authService } from '../services/authService'

export async function registerController(req: Request, res: Response) {
  const { email, password } = req.body
  const result = await authService.register({ email, password })
  res.json({ data: result })
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body
  const result = await authService.login({ email, password })
  res.json({ data: result })
}
