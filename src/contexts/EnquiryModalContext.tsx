import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface EnquiryItem {
  id: string
  name: string
}

interface EnquiryModalContextValue {
  isOpen: boolean
  product: EnquiryItem | null
  openModal: (product: EnquiryItem) => void
  closeModal: () => void
}

const EnquiryModalContext = createContext<EnquiryModalContextValue | null>(null)

export function EnquiryModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<EnquiryItem | null>(null)

  const openModal = useCallback((item: EnquiryItem) => {
    setProduct(item)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setProduct(null)
  }, [])

  return (
    <EnquiryModalContext.Provider value={{ isOpen, product, openModal, closeModal }}>
      {children}
    </EnquiryModalContext.Provider>
  )
}

export function useEnquiryModal() {
  const ctx = useContext(EnquiryModalContext)
  if (!ctx) throw new Error('useEnquiryModal must be used within EnquiryModalProvider')
  return ctx
}
