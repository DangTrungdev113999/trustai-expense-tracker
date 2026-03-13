import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import React from 'react'

vi.mock('@testing-library/react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@testing-library/react')>()
  const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query')

  return {
    ...mod,
    render: (ui: React.ReactElement, options?: Parameters<typeof mod.render>[1]) => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })

      const AllProviders = ({ children }: { children: React.ReactNode }) => {
        return React.createElement(QueryClientProvider, { client: queryClient }, children)
      }

      return mod.render(ui, { wrapper: AllProviders, ...options })
    },
  }
})
