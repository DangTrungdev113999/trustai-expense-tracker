import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useCreateTransaction } from '../api/queries'
import { ApiRequestError } from '@/lib/api'
import type { TransactionType, Category } from '@shared/types'

const EXPENSE_CATEGORIES: Category[] = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Other']
const INCOME_CATEGORIES: Category[] = ['Salary', 'Freelance', 'Other']

interface AddTransactionModalProps {
  onClose?: () => void
}

export function AddTransactionModal({ onClose }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('income')
  const [category, setCategory] = useState<Category | ''>('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const createTransaction = useCreateTransaction()

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const hasChanges = !!(category || amount || note)

  const handleClose = useCallback(() => {
    if (onClose) {
      if (hasChanges) {
        if (window.confirm('You have unsaved changes. Discard?')) {
          onClose()
        }
      } else {
        onClose()
      }
    }
  }, [onClose, hasChanges])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  function handleTypeChange(newType: TransactionType) {
    setType(newType)
    setCategory('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (!category) {
      setError('Please select a category')
      return
    }

    createTransaction.mutate(
      {
        type,
        category,
        amount: parsedAmount,
        date: new Date(date).toISOString(),
        note: note.trim() || undefined,
      },
      {
        onSuccess: () => {
          onClose?.()
        },
        onError: (err) => {
          if (err instanceof ApiRequestError) {
            setError(err.message)
          } else {
            setError('Something went wrong. Please try again.')
          }
        },
      },
    )
  }

  const modalContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="p-3 rounded-md text-sm bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error)]"
        >
          {error}
        </div>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[var(--color-text)]">Type</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="income"
              checked={type === 'income'}
              onChange={() => handleTypeChange('income')}
              className="text-[var(--color-income)]"
            />
            <span className="text-sm text-[var(--color-text)]">Income</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={type === 'expense'}
              onChange={() => handleTypeChange('expense')}
              className="text-[var(--color-expense)]"
            />
            <span className="text-sm text-[var(--color-text)]">Expense</span>
          </label>
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="tx-category" className="block text-sm font-medium text-[var(--color-text)]">
          Category
        </label>
        <select
          id="tx-category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-surface)]"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="tx-amount" className="block text-sm font-medium text-[var(--color-text)]">
          Amount
        </label>
        <input
          id="tx-amount"
          type="number"
          name="amount"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          placeholder="0"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="tx-date" className="block text-sm font-medium text-[var(--color-text)]">
          Date
        </label>
        <input
          id="tx-date"
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="tx-note" className="block text-sm font-medium text-[var(--color-text)]">
          Note
        </label>
        <textarea
          id="tx-note"
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
          placeholder="Optional"
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={createTransaction.isPending}
          className="flex-1 py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {createTransaction.isPending && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {createTransaction.isPending ? 'Saving...' : 'Add Transaction'}
        </button>
      </div>
    </form>
  )

  if (!onClose) {
    return modalContent
  }

  return (
    <div className="fixed inset-0 z-50 modal-overlay" onClick={handleClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative flex items-center justify-center min-h-screen p-4 sm:p-0">
        <div
          className="modal-content bg-[var(--color-surface)] w-full sm:max-w-[500px] sm:rounded-lg shadow-xl max-h-screen overflow-y-auto fixed inset-0 sm:static sm:inset-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Add Transaction</h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors text-[var(--color-text-secondary)]"
            >
              <X size={20} />
            </button>
          </div>
          {modalContent}
        </div>
      </div>
    </div>
  )
}
