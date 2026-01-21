import { Product, Category } from './database.types'
import { mockProducts, mockCategories } from './mock-data'
import { Product as FrontendProduct, Category as FrontendCategory } from './types'

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Type for products with joined categories
type ProductWithCategory = Product & { categories: { slug: string } | null }

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
    variants: product.variants as unknown as FrontendProduct['variants'],
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
    description: category.description || undefined,
    image: category.image_url || undefined,
  }
}

/**
 * Get products for a store
 */
export async function getStoreProducts(storeId: string | null): Promise<FrontendProduct[]> {
  // Demo mode - return mock data
  if (!storeId || !isSupabaseConfigured()) {
    return mockProducts
  }

  try {
    const { createClient } = await import('./supabase/server')
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

    if (error || !products) {
      console.error('Error fetching products:', error)
      return mockProducts
    }

    return (products as unknown as ProductWithCategory[]).map(p => dbProductToFrontend(
      p,
      p.categories?.slug
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
  if (!storeId || !isSupabaseConfigured()) {
    return mockProducts.find(p => p.id === productId) || null
  }

  try {
    const { createClient } = await import('./supabase/server')
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

    const productData = data as unknown as ProductWithCategory
    return dbProductToFrontend(
      productData,
      productData.categories?.slug
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
  if (!storeId || !isSupabaseConfigured()) {
    return mockCategories
  }

  try {
    const { createClient } = await import('./supabase/server')
    const supabase = await createClient()
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !categories) {
      console.error('Error fetching categories:', error)
      return mockCategories
    }

    return (categories as unknown as Category[]).map(dbCategoryToFrontend)
  } catch (error) {
    console.error('Error in getStoreCategories:', error)
    return mockCategories
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(storeId: string | null, categorySlug: string): Promise<FrontendProduct[]> {
  if (!storeId || !isSupabaseConfigured()) {
    return mockProducts.filter(p => p.category === categorySlug)
  }

  try {
    const { createClient } = await import('./supabase/server')
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

    const categoryData = category as unknown as { id: string }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('category_id', categoryData.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error || !products) {
      console.error('Error fetching products by category:', error)
      return []
    }

    return (products as unknown as Product[]).map(p => dbProductToFrontend(p, categorySlug))
  } catch (error) {
    console.error('Error in getProductsByCategory:', error)
    return []
  }
}

/**
 * Search products
 */
export async function searchProducts(storeId: string | null, query: string): Promise<FrontendProduct[]> {
  if (!storeId || !isSupabaseConfigured()) {
    const lowerQuery = query.toLowerCase()
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    )
  }

  try {
    const { createClient } = await import('./supabase/server')
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

    if (error || !products) {
      console.error('Error searching products:', error)
      return []
    }

    return (products as unknown as ProductWithCategory[]).map(p => dbProductToFrontend(
      p,
      p.categories?.slug
    ))
  } catch (error) {
    console.error('Error in searchProducts:', error)
    return []
  }
}
