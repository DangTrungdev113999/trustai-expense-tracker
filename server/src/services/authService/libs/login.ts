import type { LoginParams, LoginResult } from '../types'
import { AppError } from '../../../lib/AppError'
import { db } from '../../../lib/db'
import { signToken } from '../../../lib/jwt'
import { verifyPassword } from '../../../lib/password'

export async function login(params: LoginParams): Promise<LoginResult> {
  const { email, password } = params

  if (!email || !password) {
    throw new AppError('Email and password are required', 400, 'missing_fields')
  }

  const userRecord = db.users.findByEmail(email)

  if (!userRecord || !verifyPassword(password, userRecord.passwordHash)) {
    throw new AppError('Invalid credentials', 401, 'invalid_credentials')
  }

  return {
    user: { id: userRecord.id, email: userRecord.email, createdAt: userRecord.createdAt },
    token: signToken(userRecord.id),
  }
}
