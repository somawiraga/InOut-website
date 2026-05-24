import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { Product } from '../types'
import { useProducts } from './useProducts'

export function useProductDetail(): Product | null {
  const { productId } = useParams<{ productId: string }>()
  const products = useProducts()

  return useMemo(() => {
    if (!productId) return null
    const decoded = decodeURIComponent(productId)
    return products.find((p) => p.slug === decoded || p.id === decoded) ?? null
  }, [productId, products])
}
