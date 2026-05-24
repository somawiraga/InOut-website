/**
 * Build-time script: merges products.json summary with individual product
 * detail JSONs from html/data/products/ into src/data/products-merged.json.
 * Run via `tsx scripts/merge-products.ts` (called by predev / prebuild hooks).
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const htmlDataDir = join(__dirname, '../../html/data')
const summaryFile = join(htmlDataDir, 'products.json')
const detailDir = join(htmlDataDir, 'products')
const outDir = join(__dirname, '../src/data')
const outFile = join(outDir, 'products-merged.json')

interface ProductSummary {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  category: string
  subcategory: string
  specifications: string
  pdf: string | null
  images: string[]
}

interface ProductDetail {
  id: string
  stock?: string
  inStock?: string
  packaging?: string
  detail?: string
  download?: string
}

type MergedProduct = ProductSummary & Omit<ProductDetail, 'id'>

mkdirSync(outDir, { recursive: true })

const summaries: ProductSummary[] = JSON.parse(readFileSync(summaryFile, 'utf-8'))

// Index detail files by id
const detailById = new Map<string, ProductDetail>()
for (const file of readdirSync(detailDir).filter((f) => f.endsWith('.json'))) {
  const detail: ProductDetail = JSON.parse(readFileSync(join(detailDir, file), 'utf-8'))
  detailById.set(detail.id, detail)
}

const merged: MergedProduct[] = summaries.map((summary) => {
  const detail = detailById.get(summary.id)
  return {
    ...summary,
    stock: detail?.stock,
    inStock: detail?.inStock,
    packaging: detail?.packaging,
    detail: detail?.detail,
    download: detail?.download,
  }
})

merged.sort((a, b) => a.name.localeCompare(b.name))
writeFileSync(outFile, JSON.stringify(merged, null, 2))
console.log(`✓ merge-products: wrote ${merged.length} products → ${outFile}`)
