import type { User } from '@shared/types'

export interface RegisterParams {
  email: string
  password: string
}

export interface RegisterResult {
  user: User
  token: string
}

export interface LoginParams {
  email: string
  password: string
}

export interface LoginResult {
  user: User
  token: string
}
