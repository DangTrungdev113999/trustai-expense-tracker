import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth-store'
import type { ReactNode } from 'react'

export function AuthRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  if (isAuthenticated) {
    return <Navigate to="/transactions" replace />
  }

  return <>{children}</>
}
