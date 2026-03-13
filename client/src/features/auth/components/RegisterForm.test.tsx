import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterForm } from './RegisterForm'

describe('RegisterForm', () => {
  it('should render email input', () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('should render password input', () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should render submit button with register text', () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('should render link to login page', () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })
})
