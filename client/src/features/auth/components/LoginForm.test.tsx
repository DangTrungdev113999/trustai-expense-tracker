import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('should render email input', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('should render password input', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should render submit button with login text', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('should render link to register page', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument()
  })
})
