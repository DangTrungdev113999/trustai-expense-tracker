import { create } from 'zustand'
import type { User } from '@shared/types'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: (() => {
    const token = localStorage.getItem('auth_token')
    return token
  })(),

  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null })
  },

  isAuthenticated: () => !!get().token,
}))
