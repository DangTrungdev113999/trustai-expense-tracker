import { useState } from 'react'
import { ArrowUpCircle, ArrowDownCircle, Plus, AlertCircle, RefreshCw, ListPlus } from 'lucide-react'
import { useTransactions } from '../api/queries'
import { AddTransactionModal } from './AddTransactionModal'
import { useAuthStore } from '@/lib/auth-store'
import { useNavigate } from 'react-router-dom'
import { ApiRequestError } from '@/lib/api'
import { format } from 'date-fns'
import type { Transaction } from '@shared/types'

function TransactionSkeleton() {
  return (
    <li className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="skeleton h-5 w-20" />
      </div>
    </li>
  )
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === 'income'

  return (
    <li className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-50 text-[var(--color-income)]' : 'bg-red-50 text-[var(--color-expense)]'}`}
        >
          {isIncome ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text)]">{transaction.category}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
          {transaction.note && (
            <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">{transaction.note}</p>
          )}
        </div>
        <span className={`text-sm font-semibold ${isIncome ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]'}`}>
          {isIncome ? '+' : '-'}{transaction.amount.toLocaleString()}
        </span>
      </div>
    </li>
  )
}

export function TransactionsList() {
  const [showModal, setShowModal] = useState(false)
  const { data: transactions, isLoading, error, refetch } = useTransactions()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  if (error instanceof ApiRequestError && error.code === 'unauthorized') {
    logout()
    navigate('/login', { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Transactions</h1>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-md text-sm transition-colors"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>

        {isLoading ? (
          <ul className="space-y-3" role="list">
            {Array.from({ length: 4 }).map((_, i) => (
              <TransactionSkeleton key={i} />
            ))}
          </ul>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-[var(--color-expense)]" />
            <p className="text-[var(--color-text)] font-medium mb-2">Failed to load transactions. Retry?</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-md text-sm transition-colors"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        ) : !transactions?.length ? (
          <div className="text-center py-12">
            <ListPlus size={48} className="mx-auto mb-4 text-[var(--color-text-secondary)]" />
            <p className="text-[var(--color-text)] font-medium mb-2">No transactions yet. Add your first transaction!</p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-md text-sm transition-colors"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </ul>
        )}
      </div>

      {/* Floating button - mobile only */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="New transaction"
      >
        <Plus size={24} />
      </button>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
