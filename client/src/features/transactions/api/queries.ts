import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CreateTransactionRequest, Transaction } from '@shared/types'

interface TransactionsResponse {
  data: { transactions: Transaction[] }
}

interface CreateTransactionResponse {
  data: { transaction: Transaction }
}

export const transactionKeys = {
  all: ['transactions'] as const,
  list: () => [...transactionKeys.all, 'list'] as const,
}

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.list(),
    queryFn: () => api.get<TransactionsResponse>('/api/transactions'),
    select: (res) => res.data.transactions,
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => api.post<CreateTransactionResponse>('/api/transactions', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.all }),
  })
}
