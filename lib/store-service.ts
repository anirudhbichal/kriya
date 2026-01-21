import { createClient } from './supabase/server'
import { createAdminClient } from './supabase/server'
import { Product, Category, Store, ProductInsert, CategoryInsert } from './database.types'
import { mockProducts, mockCategories } from './mock-data'
import { Product as FrontendProduct, Category as FrontendCategory } from './types'

/**
 * Convert database Product to frontend Product type
 */
function dbProductToFrontend(product: Product, categorySlug?: string): FrontendProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    compareAtPrice: product.compare_at_price || undefined,
    images: product.images || [],
    category: categorySlug || 'uncategorized',
    tags: product.tags || [],
    inStock: product.in_stock,
    variants: product.variants as FrontendProduct['variants'],
  }
}

/**
 * Convert database Category to frontend Category type
 */
function dbCategoryToFrontend(category: Category): FrontendCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image_url || undefined,
  }
}

/**
 * Get products for a store
 */
export async function getStoreProducts(storeId: string | null): Promise<FrontendProduct[]> {
  // Demo mode - return mock data
  if (!storeId) {
    return mockProducts
  }

  try {
    const supabase = await createClient()
    
    // Get products with their categories
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (slug)
      `)
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching products:', error)
      return mockProducts
    }

    return products.map(p => dbProductToFrontend(
      p as Product,
      (p.categories as { slug: string } | null)?.slug
    ))
  } catch (error) {
    console.error('Error in getStoreProducts:', error)
    return mockProducts
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(storeId: string | null, productId: string): Promise<FrontendProduct | null> {
  if (!storeId) {
    return mockProducts.find(p => p.id === productId) || null
  }

  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (slug)
      `)
      .eq('store_id', storeId)
      .eq('id', productId)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return null
    }

    return dbProductToFrontend(
      data as Product,
      (data.categories as { slug: string } | null)?.slug
    )
  } catch (error) {
    console.error('Error in getProduct:', error)
    return null
  }
}

/**
 * Get categories for a store
 */
export async function getStoreCategories(storeId: string | null): Promise<FrontendCategory[]> {
  if (!storeId) {
    return mockCategories
  }

  try {
    const supabase = await createClient()
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return mockCategories
    }

    return categories.map(dbCategoryToFrontend)
  } catch (error) {
    console.error('Error in getStoreCategories:', error)
    return mockCategories
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(storeId: string | null, categorySlug: string): Promise<FrontendProduct[]> {
  if (!storeId) {
    return mockProducts.filter(p => p.category === categorySlug)
  }

  try {
    const supabase = await createClient()
    
    // First get category ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('store_id', storeId)
      .eq('slug', categorySlug)
      .single()

    if (!category) {
      return []
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching products by category:', error)
      return []
    }

    return products.map(p => dbProductToFrontend(p, categorySlug))
  } catch (error) {
    console.error('Error in getProductsByCategory:', error)
    return []
  }
}

/**
 * Search products
 */
export async function searchProducts(storeId: string | null, query: string): Promise<FrontendProduct[]> {
  if (!storeId) {
    const lowerQuery = query.toLowerCase()
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    )
  }

  try {
    const supabase = await createClient()
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (slug)
      `)
      .eq('store_id', storeId)
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return products.map(p => dbProductToFrontend(
      p as Product,
      (p.categories as { slug: string } | null)?.slug
    ))
  } catch (error) {
    console.error('Error in searchProducts:', error)
    return []
  }
}

/**
 * Get store statistics
 */
export async function getStoreStats(storeId: string) {
  try {
    const supabase = await createClient()
    
    const [productsCount, categoriesCount, ordersCount] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('store_id', storeId),
      supabase.from('categories').select('id', { count: 'exact', head: true }).eq('store_id', storeId),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('store_id', storeId),
    ])

    return {
      products: productsCount.count || 0,
      categories: categoriesCount.count || 0,
      orders: ordersCount.count || 0,
    }
  } catch (error) {
    console.error('Error getting store stats:', error)
    return { products: 0, categories: 0, orders: 0 }
  }
}

// ============ Admin Functions (for sync and management) ============

/**
 * Upsert products from Google Sheets sync (uses admin client)
 */
export async function upsertProducts(storeId: string, products: ProductInsert[]): Promise<{ success: boolean; count: number }> {
  try {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('products')
      .upsert(
        products.map(p => ({ ...p, store_id: storeId })),
        { onConflict: 'store_id,external_id' }
      )
      .select()

    if (error) {
      console.error('Error upserting products:', error)
      return { success: false, count: 0 }
    }

    return { success: true, count: data?.length || 0 }
  } catch (error) {
    console.error('Error in upsertProducts:', error)
    return { success: false, count: 0 }
  }
}

/**
 * Upsert categories from Google Sheets sync
 */
export async function upsertCategories(storeId: string, categories: CategoryInsert[]): Promise<{ success: boolean; count: number }> {
  try {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from('categories')
      .upsert(
        categories.map(c => ({ ...c, store_id: storeId })),
        { onConflict: 'store_id,slug' }
      )
      .select()

    if (error) {
      console.error('Error upserting categories:', error)
      return { success: false, count: 0 }
    }

    return { success: true, count: data?.length || 0 }
  } catch (error) {
    console.error('Error in upsertCategories:', error)
    return { success: false, count: 0 }
  }
}
