import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../api/mutations'
import { useAuthStore } from '@/lib/auth-store'
import { ApiRequestError } from '@/lib/api'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const register = useRegister()
  const setAuth = useAuthStore((s) => s.setAuth)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Invalid email format')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    register.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          setAuth(res.data.user, res.data.token)
          navigate('/transactions', { replace: true })
        },
        onError: (err) => {
          if (err instanceof ApiRequestError) {
            if (err.code === 'email_exists') {
              setError('Email already exists')
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
        <label htmlFor="register-email" className="block text-sm font-medium text-[var(--color-text)]">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="register-password" className="block text-sm font-medium text-[var(--color-text)]">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          placeholder="Min 6 characters"
        />
      </div>

      <button
        type="submit"
        disabled={register.isPending}
        className="w-full py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {register.isPending && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {register.isPending ? 'Registering...' : 'Register'}
      </button>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        Already have account?{' '}
        <Link to="/login" className="text-[var(--color-primary)] hover:underline font-medium">
          Login
        </Link>
      </p>
    </form>
  )
}
