import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Product } from '../types'

interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
}

const ProductsContext = createContext<ProductsState>({
  products: [],
  loading: true,
  error: null,
})

function mapRow(row: Record<string, unknown>, imagesByProduct: Map<string, string[]>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    shortDescription: (row.short_description ?? '') as string,
    description: (row.description ?? '') as string,
    category: (row.category ?? '') as string,
    subcategory: (row.subcategory ?? '') as string,
    specifications: (row.specifications ?? '') as string,
    pdf: (row.pdf ?? '') as string,
    images: imagesByProduct.get(row.id as string) ?? [],
    stock: row.stock as string | undefined,
    inStock: row.in_stock as string | boolean | undefined,
    packaging: row.packaging as string | undefined,
    detail: row.detail as string | undefined,
    download: row.download as string | undefined,
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*'),
      supabase.from('product_images').select('product_id, image_url, sort_order').order('sort_order'),
    ]).then(([{ data: productsData, error: productsErr }, { data: imagesData, error: imagesErr }]: [
      { data: Record<string, unknown>[] | null; error: { message: string } | null },
      { data: { product_id: string; image_url: string; sort_order: number }[] | null; error: { message: string } | null },
    ]) => {
      if (productsErr) { setError(productsErr.message); setLoading(false); return }
      if (imagesErr) { setError(imagesErr.message); setLoading(false); return }

      const imagesByProduct = new Map<string, string[]>()
      for (const img of imagesData ?? []) {
        const list = imagesByProduct.get(img.product_id) ?? []
        list.push(img.image_url)
        imagesByProduct.set(img.product_id, list)
      }

      setProducts((productsData ?? []).map((row) => mapRow(row, imagesByProduct)))
      setLoading(false)
    })
  }, [])

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProductsContext() {
  return useContext(ProductsContext)
}
