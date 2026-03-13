import type { GetTransactionsParams, GetTransactionsResult } from '../types'
import { db } from '../../../lib/db'

export async function getTransactions(params: GetTransactionsParams): Promise<GetTransactionsResult> {
  const transactions = db.transactions.findByUserId(params.userId)
  return { transactions }
}
