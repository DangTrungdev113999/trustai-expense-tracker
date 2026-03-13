import { randomUUID } from 'crypto'
import type { CreateTransactionParams, CreateTransactionResult } from '../types'
import { AppError } from '../../../lib/AppError'
import { db } from '../../../lib/db'

const VALID_TYPES: string[] = ['income', 'expense']
const VALID_CATEGORIES: string[] = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Salary', 'Freelance', 'Other']

export async function createTransaction(params: CreateTransactionParams): Promise<CreateTransactionResult> {
  const { userId, type, category, amount, date, note } = params

  if (!VALID_TYPES.includes(type)) {
    throw new AppError('Invalid transaction type', 400, 'invalid_type')
  }

  if (!VALID_CATEGORIES.includes(category)) {
    throw new AppError('Invalid category', 400, 'invalid_category')
  }

  if (!amount || amount <= 0) {
    throw new AppError('Amount must be greater than 0', 400, 'invalid_amount')
  }

  const transaction = {
    id: randomUUID(),
    userId,
    type,
    category,
    amount,
    date,
    note,
    createdAt: new Date().toISOString(),
  }

  db.transactions.create(userId, transaction)

  return { transaction }
}
