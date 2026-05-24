import type { ProductGroup } from '../types'
import productGroupsData from '../data/product-groups.json'

const productGroups = productGroupsData as ProductGroup[]

export function useProductGroups() {
  return productGroups
}

export function useProductGroup(slug: string | undefined) {
  return slug ? (productGroups.find((g) => g.slug === slug) ?? null) : null
}
