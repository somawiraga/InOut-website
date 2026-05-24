import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { ThemeProvider } from '../contexts/ThemeContext'
import { EnquiryModalProvider } from '../contexts/EnquiryModalContext'
import { CartProvider } from '../contexts/CartContext'
import App from '../App'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <EnquiryModalProvider>
          <CartProvider>{children}</CartProvider>
        </EnquiryModalProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('App smoke test', () => {
  it('renders without crashing', () => {
    render(<App />, { wrapper: Wrapper })
    expect(document.body).toBeTruthy()
  })

  it('renders main element', () => {
    render(<App />, { wrapper: Wrapper })
    expect(screen.getByRole('main')).toBeTruthy()
  })
})
