export type TransactionType = 'income' | 'expense'

export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Salary' | 'Freelance' | 'Other'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  category: Category
  amount: number // positive number
  date: string // ISO 8601
  note?: string
  createdAt: string // ISO 8601
}

export interface CreateTransactionRequest {
  type: TransactionType
  category: Category
  amount: number
  date: string // ISO 8601
  note?: string
}

export interface GetTransactionsResponse {
  transactions: Transaction[]
}
