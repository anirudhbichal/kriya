import { google } from 'googleapis'
import { ProductInsert, CategoryInsert, Store, SyncLog } from './database.types'
import { v4 as uuidv4 } from 'uuid'

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Sync Google Sheet data to database for a store
 */
export async function syncGoogleSheetToDatabase(store: Store): Promise<{
  success: boolean
  productsCount: number
  categoriesCount: number
  error?: string
}> {
  if (!isSupabaseConfigured()) {
    return { success: false, productsCount: 0, categoriesCount: 0, error: 'Supabase not configured' }
  }

  if (!store.google_sheet_id) {
    return { success: false, productsCount: 0, categoriesCount: 0, error: 'No Google Sheet configured' }
  }

  const startTime = Date.now()
  
  try {
    const { createAdminClient } = await import('./supabase/server')
    const supabase = createAdminClient()

    // Create sync log entry
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({
        store_id: store.id,
        status: 'running',
      } as never)
      .select()
      .single()

    const syncLogData = syncLog as unknown as SyncLog | null

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
          .insert(categories as never)

        if (catError) {
          throw new Error(`Failed to insert categories: ${catError.message}`)
        }
      }

      // Get the inserted categories to map slugs to IDs
      const { data: insertedCategories } = await supabase
        .from('categories')
        .select('id, slug')
        .eq('store_id', store.id)

      const catData = insertedCategories as unknown as Array<{ id: string; slug: string }> | null
      const slugToId = new Map<string, string>()
      catData?.forEach(cat => slugToId.set(cat.slug, cat.id))

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
          .insert(products as never)

        if (prodError) {
          throw new Error(`Failed to insert products: ${prodError.message}`)
        }
      }

      // Update store's last sync time
      await supabase
        .from('stores')
        .update({ google_sheet_last_sync: new Date().toISOString() } as never)
        .eq('id', store.id)

      // Update sync log
      const duration = Date.now() - startTime
      if (syncLogData) {
        await supabase
          .from('sync_logs')
          .update({
            status: 'completed',
            products_synced: products.length,
            categories_synced: categories.length,
            duration_ms: duration,
          } as never)
          .eq('id', syncLogData.id)
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
      if (syncLogData) {
        await supabase
          .from('sync_logs')
          .update({
            status: 'failed',
            error_message: errorMessage,
            duration_ms: Date.now() - startTime,
          } as never)
          .eq('id', syncLogData.id)
      }

      return {
        success: false,
        productsCount: 0,
        categoriesCount: 0,
        error: errorMessage,
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Sync initialization error:', error)
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
  if (!isSupabaseConfigured()) {
    return { total: 0, successful: 0, failed: 0 }
  }

  try {
    const { createAdminClient } = await import('./supabase/server')
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

    const storesData = stores as unknown as Store[]

    let successful = 0
    let failed = 0

    for (const store of storesData) {
      const result = await syncGoogleSheetToDatabase(store)
      if (result.success) {
        successful++
      } else {
        failed++
      }
    }

    return {
      total: storesData.length,
      successful,
      failed,
    }
  } catch (error) {
    console.error('Error in syncAllStores:', error)
    return { total: 0, successful: 0, failed: 0 }
  }
}
