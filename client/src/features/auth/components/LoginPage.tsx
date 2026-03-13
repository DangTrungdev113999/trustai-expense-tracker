import { LoginForm } from './LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-[400px] px-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-[var(--color-text)]">Login</h1>
        <div className="bg-[var(--color-surface)] rounded-lg shadow-sm border border-[var(--color-border)] p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
