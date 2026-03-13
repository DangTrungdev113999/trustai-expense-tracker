import type { Transaction, CreateTransactionRequest } from '@shared/types'

export interface CreateTransactionParams extends CreateTransactionRequest {
  userId: string
}

export interface CreateTransactionResult {
  transaction: Transaction
}

export interface GetTransactionsParams {
  userId: string
}

export interface GetTransactionsResult {
  transactions: Transaction[]
}
