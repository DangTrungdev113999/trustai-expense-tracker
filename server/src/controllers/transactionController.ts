import type { Request, Response } from 'express'
import { transactionService } from '../services/transactionService'

export async function createTransactionController(req: Request, res: Response) {
  const { type, category, amount, date, note } = req.body
  const userId = req.userId!
  const result = await transactionService.createTransaction({ userId, type, category, amount, date, note })
  res.status(201).json({ data: result })
}

export async function getTransactionsController(req: Request, res: Response) {
  const userId = req.userId!
  const result = await transactionService.getTransactions({ userId })
  res.json({ data: result })
}
