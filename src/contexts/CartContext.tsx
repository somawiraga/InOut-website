/**
 * CartContext — stub implementation.
 * Cart display UX is pending Design Manager sign-off.
 * Provides the context shape so downstream components can import safely.
 */
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  count: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  // Stub: no persistence until Design Manager approves cart UX
  const stub: CartContextValue = {
    items: [],
    count: 0,
    addItem: () => undefined,
    removeItem: () => undefined,
    clearCart: () => undefined,
  }

  return <CartContext.Provider value={stub}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
