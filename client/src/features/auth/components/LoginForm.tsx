import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../api/mutations'
import { useAuthStore } from '@/lib/auth-store'
import { ApiRequestError } from '@/lib/api'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const login = useLogin()
  const setAuth = useAuthStore((s) => s.setAuth)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    login.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          setAuth(res.data.user, res.data.token)
          navigate('/transactions', { replace: true })
        },
        onError: (err) => {
          if (err instanceof ApiRequestError) {
            if (err.code === 'invalid_credentials') {
              setError('Invalid credentials')
            } else {
              setError(err.message)
            }
          } else {
            setError('Connection failed. Please check your internet.')
          }
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[400px] mx-auto p-4 space-y-4">
      {error && (
        <div
          role="alert"
          className="p-3 rounded-md text-sm bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error)]"
        >
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-medium text-[var(--color-text)]">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="login-password" className="block text-sm font-medium text-[var(--color-text)]">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={login.isPending}
        className="w-full py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {login.isPending && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        Don&apos;t have account?{' '}
        <Link to="/register" className="text-[var(--color-primary)] hover:underline font-medium">
          Register
        </Link>
      </p>
    </form>
  )
}
