import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { RegisterRequest, LoginRequest, AuthResponse } from '@shared/types'

interface AuthApiResponse {
  data: AuthResponse
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => api.post<AuthApiResponse>('/api/auth/register', data),
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => api.post<AuthApiResponse>('/api/auth/login', data),
  })
}
