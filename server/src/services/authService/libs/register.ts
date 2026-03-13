import { randomUUID } from 'crypto'
import type { RegisterParams, RegisterResult } from '../types'
import { AppError } from '../../../lib/AppError'
import { db } from '../../../lib/db'
import { signToken } from '../../../lib/jwt'
import { hashPassword } from '../../../lib/password'

export async function register(params: RegisterParams): Promise<RegisterResult> {
  const { email, password } = params

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400, 'password_too_weak')
  }

  if (db.users.findByEmail(email)) {
    throw new AppError('Email already exists', 400, 'email_exists')
  }

  const id = randomUUID()
  const createdAt = new Date().toISOString()
  const passwordHash = hashPassword(password)

  db.users.create({ id, email, passwordHash, createdAt })

  return {
    user: { id, email, createdAt },
    token: signToken(id),
  }
}
