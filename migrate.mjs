// migrate.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// ── Config ──────────────────────────────────────────────
const SUPABASE_URL = 'https://abashecjvmhuwvygwbch.supabase.co'
const SUPABASE_SERVICE_KEY = ' '   // ⚠️ NOT the anon key
const JSON_FILE_PATH = './src/data/products-merged.json'               // path to your JSON file
// ────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function migrate() {
  // 1. Load JSON
  const raw = readFileSync(JSON_FILE_PATH, 'utf-8')
  const products = JSON.parse(raw)
  console.log(`📦 Found ${products.length} products to migrate`)

  let successCount = 0
  let errorCount = 0

  for (const product of products) {
    // 2. Insert into products table
    const { error: productError } = await supabase
      .from('products')
      .upsert({
        id:                product.id,
        slug:              product.slug,
        name:              product.name,
        short_description: product.shortDescription,
        description:       product.description,
        category:          product.category,
        subcategory:       product.subcategory,
        specifications:    product.specifications,
        packaging:         product.packaging,
        detail:            product.detail,
        pdf:               product.pdf,
        download:          product.download,
        stock:             parseInt(product.stock) || 0,
        in_stock:          product.inStock === '1',
      })

    if (productError) {
      console.error(`❌ Failed product: ${product.id}`, productError.message)
      errorCount++
      continue  // skip images if product failed
    }

    // 3. Insert into product_images table
    if (product.images && product.images.length > 0) {
      const imageRows = product.images.map((url, index) => ({
        product_id: product.id,
        image_url:  url,
        sort_order: index,
      }))

      const { error: imageError } = await supabase
        .from('product_images')
        .upsert(imageRows)

      if (imageError) {
        console.error(`❌ Failed images for: ${product.id}`, imageError.message)
        errorCount++
        continue
      }
    }

    console.log(`✅ Migrated: ${product.name}`)
    successCount++
  }

  console.log(`\n🎉 Done! ${successCount} succeeded, ${errorCount} failed.`)
}

migrate()