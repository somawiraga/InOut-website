import { useMemo } from 'react'
import type { Product } from '../types'
import productsData from '../data/products-merged.json'

const products = productsData as unknown as Product[]

export function useProducts() {
  return products
}

export function useProductsByGroup(groupName: string) {
  return useMemo(() => products.filter((p) => p.category === groupName), [groupName])
}

export function useProductsBySubcategory(groupName: string, subcategoryName: string) {
  return useMemo(
    () => products.filter((p) => p.category === groupName && p.subcategory === subcategoryName),
    [groupName, subcategoryName],
  )
}

export function useProductBySlug(slug: string | undefined) {
  return useMemo(() => (slug ? (products.find((p) => p.slug === slug) ?? null) : null), [slug])
}
