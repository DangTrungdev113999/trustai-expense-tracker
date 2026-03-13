import type { Transaction } from '@shared/types'

export interface UserRecord {
  id: string
  email: string
  passwordHash: string
  createdAt: string
}

const users = new Map<string, UserRecord>()
const usersByEmail = new Map<string, UserRecord>()
const userTransactions = new Map<string, Transaction[]>()

export const db = {
  users: {
    findByEmail(email: string): UserRecord | undefined {
      return usersByEmail.get(email)
    },
    findById(id: string): UserRecord | undefined {
      return users.get(id)
    },
    create(user: UserRecord): void {
      users.set(user.id, user)
      usersByEmail.set(user.email, user)
    },
  },
  transactions: {
    create(userId: string, txn: Transaction): void {
      const list = userTransactions.get(userId) || []
      list.push(txn)
      userTransactions.set(userId, list)
    },
    findByUserId(userId: string): Transaction[] {
      return userTransactions.get(userId) || []
    },
  },
}
