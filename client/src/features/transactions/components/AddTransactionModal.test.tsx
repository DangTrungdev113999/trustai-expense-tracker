import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AddTransactionModal } from './AddTransactionModal'

describe('AddTransactionModal', () => {
  it('should render type selection (income/expense)', () => {
    render(
      <MemoryRouter>
        <AddTransactionModal />
      </MemoryRouter>,
    )

    expect(screen.getByRole('radio', { name: /income/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /expense/i })).toBeInTheDocument()
  })

  it('should render category select', () => {
    render(
      <MemoryRouter>
        <AddTransactionModal />
      </MemoryRouter>,
    )

    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument()
  })

  it('should render amount input', () => {
    render(
      <MemoryRouter>
        <AddTransactionModal />
      </MemoryRouter>,
    )

    expect(screen.getByRole('spinbutton', { name: /amount/i })).toBeInTheDocument()
  })

  it('should render date input', () => {
    render(
      <MemoryRouter>
        <AddTransactionModal />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
  })

  it('should render note textarea', () => {
    render(
      <MemoryRouter>
        <AddTransactionModal />
      </MemoryRouter>,
    )

    expect(screen.getByRole('textbox', { name: /note/i })).toBeInTheDocument()
  })

  it('should render submit button', () => {
    render(
      <MemoryRouter>
        <AddTransactionModal />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument()
  })
})
