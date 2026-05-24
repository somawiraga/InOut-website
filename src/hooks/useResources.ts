import type { Resource } from '../types'
import resourcesData from '../data/resources.json'

const resources = resourcesData as Resource[]

export function useResources() {
  return resources
}
