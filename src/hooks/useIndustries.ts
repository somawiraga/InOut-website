import type { Industry } from '../types'
import industriesData from '../data/industries.json'

const industries = industriesData as Industry[]

export function useIndustries() {
  return industries
}

export function useIndustry(slug: string | undefined) {
  return slug ? (industries.find((i) => i.slug === slug) ?? null) : null
}
