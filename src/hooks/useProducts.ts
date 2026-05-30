import { useMemo } from 'react'
import { useProductsContext } from '../contexts/ProductsContext'

export function useProducts() {
  return useProductsContext().products
}

export function useProductsLoading() {
  const { loading, error } = useProductsContext()
  return { loading, error }
}

export function useProductsByGroup(groupName: string) {
  const products = useProducts()
  return useMemo(() => products.filter((p) => p.category === groupName), [products, groupName])
}

export function useProductsBySubcategory(groupName: string, subcategoryName: string) {
  const products = useProducts()
  return useMemo(
    () => products.filter((p) => p.category === groupName && p.subcategory === subcategoryName),
    [products, groupName, subcategoryName],
  )
}

export function useProductBySlug(slug: string | undefined) {
  const products = useProducts()
  return useMemo(() => (slug ? (products.find((p) => p.slug === slug) ?? null) : null), [products, slug])
}
