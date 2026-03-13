import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TransactionsList } from './TransactionsList'

describe('TransactionsList', () => {
  it('should render heading', () => {
    render(
      <MemoryRouter>
        <TransactionsList />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /transactions/i })).toBeInTheDocument()
  })

  it('should render add transaction button', () => {
    render(
      <MemoryRouter>
        <TransactionsList />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument()
  })

  it('should render transaction list container', () => {
    render(
      <MemoryRouter>
        <TransactionsList />
      </MemoryRouter>,
    )

    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})
