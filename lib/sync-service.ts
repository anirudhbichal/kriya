import { google } from 'googleapis'
import { createAdminClient } from './supabase/server'
import { ProductInsert, CategoryInsert, Store } from './database.types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Sync Google Sheet data to database for a store
 */
export async function syncGoogleSheetToDatabase(store: Store): Promise<{
  success: boolean
  productsCount: number
  categoriesCount: number
  error?: string
}> {
  if (!store.google_sheet_id) {
    return { success: false, productsCount: 0, categoriesCount: 0, error: 'No Google Sheet configured' }
  }

  const startTime = Date.now()
  const supabase = createAdminClient()

  // Create sync log entry
  const { data: syncLog } = await supabase
    .from('sync_logs')
    .insert({
      store_id: store.id,
      status: 'running',
    })
    .select()
    .single()

  try {
    const sheets = google.sheets({
      version: 'v4',
      auth: process.env.GOOGLE_SHEETS_API_KEY,
    })

    // Fetch categories
    const categoriesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: store.google_sheet_id,
      range: 'Categories!A2:D',
    })

    const categoryRows = categoriesResponse.data.values || []
    const categoryMap = new Map<string, string>() // external_id -> db_id

    // Process and upsert categories
    const categories: CategoryInsert[] = categoryRows
      .filter(row => row[0] && row[1])
      .map((row, index) => {
        const id = uuidv4()
        const slug = row[2] || row[1].toLowerCase().replace(/\s+/g, '-')
        categoryMap.set(row[0], id) // Map external ID to new ID
        
        return {
          id,
          store_id: store.id,
          name: row[1],
          slug,
          image_url: row[3] || null,
          sort_order: index,
          is_active: true,
        }
      })

    // Delete existing categories and insert new ones
    await supabase
      .from('categories')
      .delete()
      .eq('store_id', store.id)

    if (categories.length > 0) {
      const { error: catError } = await supabase
        .from('categories')
        .insert(categories)

      if (catError) {
        throw new Error(`Failed to insert categories: ${catError.message}`)
      }
    }

    // Get the inserted categories to map slugs to IDs
    const { data: insertedCategories } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('store_id', store.id)

    const slugToId = new Map<string, string>()
    insertedCategories?.forEach(cat => slugToId.set(cat.slug, cat.id))

    // Fetch products
    const productsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: store.google_sheet_id,
      range: 'Products!A2:I',
    })

    const productRows = productsResponse.data.values || []

    // Process products
    const products: ProductInsert[] = productRows
      .filter(row => row[0] && row[1])
      .map((row, index) => {
        const categorySlug = row[6] || 'uncategorized'
        const categoryId = slugToId.get(categorySlug)

        return {
          id: uuidv4(),
          store_id: store.id,
          external_id: row[0],
          name: row[1],
          slug: row[1].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          description: row[2] || null,
          price: parseFloat(row[3]) || 0,
          compare_at_price: row[4] ? parseFloat(row[4]) : null,
          images: row[5] ? row[5].split(',').map((url: string) => url.trim()) : [],
          category_id: categoryId || null,
          tags: row[7] ? row[7].split(',').map((tag: string) => tag.trim().toLowerCase()) : [],
          in_stock: row[8]?.toLowerCase() !== 'false',
          is_active: true,
          sort_order: index,
        }
      })

    // Delete existing products and insert new ones
    await supabase
      .from('products')
      .delete()
      .eq('store_id', store.id)

    if (products.length > 0) {
      const { error: prodError } = await supabase
        .from('products')
        .insert(products)

      if (prodError) {
        throw new Error(`Failed to insert products: ${prodError.message}`)
      }
    }

    // Update store's last sync time
    await supabase
      .from('stores')
      .update({ google_sheet_last_sync: new Date().toISOString() })
      .eq('id', store.id)

    // Update sync log
    const duration = Date.now() - startTime
    if (syncLog) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'completed',
          products_synced: products.length,
          categories_synced: categories.length,
          duration_ms: duration,
        })
        .eq('id', syncLog.id)
    }

    return {
      success: true,
      productsCount: products.length,
      categoriesCount: categories.length,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Sync error:', error)

    // Update sync log with error
    if (syncLog) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'failed',
          error_message: errorMessage,
          duration_ms: Date.now() - startTime,
        })
        .eq('id', syncLog.id)
    }

    return {
      success: false,
      productsCount: 0,
      categoriesCount: 0,
      error: errorMessage,
    }
  }
}

/**
 * Sync all stores that have Google Sheets configured
 * (For use in cron job)
 */
export async function syncAllStores(): Promise<{
  total: number
  successful: number
  failed: number
}> {
  const supabase = createAdminClient()

  const { data: stores, error } = await supabase
    .from('stores')
    .select('*')
    .not('google_sheet_id', 'is', null)
    .eq('is_active', true)

  if (error || !stores) {
    console.error('Error fetching stores for sync:', error)
    return { total: 0, successful: 0, failed: 0 }
  }

  let successful = 0
  let failed = 0

  for (const store of stores) {
    const result = await syncGoogleSheetToDatabase(store)
    if (result.success) {
      successful++
    } else {
      failed++
    }
  }

  return {
    total: stores.length,
    successful,
    failed,
  }
}
