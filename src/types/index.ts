export interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: string
  subcategory: string
  specifications: string
  pdf: string
  images: string[]
  stock?: string
  inStock?: string | boolean
  packaging?: string
  detail?: string
  download?: string
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  image: string
  description: string
}

export interface ProductGroup {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  subcategories: Subcategory[]
}

export interface Industry {
  id: string
  name: string
  slug: string
  description: string
  icon: string
}

export interface Resource {
  id: string
  type?: string
  title: string
  slug?: string
  description?: string
  tags?: string[]
  url?: string
  content?: string
  date?: string
}
