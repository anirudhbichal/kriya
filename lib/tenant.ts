import { headers } from 'next/headers'
import { createClient } from './supabase/server'
import { Store } from './database.types'
import { mockStoreConfig } from './mock-data'
import { StoreConfig, ThemeType } from './types'

// Cache for store lookups (in-memory, per-request in serverless)
const storeCache = new Map<string, { store: Store | null; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute

/**
 * Extract store identifier from the request
 * Supports: subdomains, custom domains, and path-based routing for development
 */
export async function getStoreIdentifier(): Promise<{ type: 'slug' | 'domain' | 'demo'; value: string }> {
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const pathname = headersList.get('x-pathname') || '/'
  
  // Development mode: use query param or path
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    // Check for store in path: /store/[slug]/...
    const pathMatch = pathname.match(/^\/store\/([^\/]+)/)
    if (pathMatch) {
      return { type: 'slug', value: pathMatch[1] }
    }
    // Default to demo store in development
    return { type: 'demo', value: 'demo' }
  }

  // Production: Check for custom domain first
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'kriya.store'
  
  if (!host.endsWith(baseDomain)) {
    // Custom domain
    return { type: 'domain', value: host.replace(/:\d+$/, '') }
  }
  
  // Subdomain: [slug].kriya.store
  const subdomain = host.replace(`.${baseDomain}`, '').replace(/:\d+$/, '')
  if (subdomain && subdomain !== 'www' && subdomain !== baseDomain) {
    return { type: 'slug', value: subdomain }
  }
  
  // Main domain - show landing page or demo
  return { type: 'demo', value: 'demo' }
}

/**
 * Resolve store from database based on identifier
 */
export async function resolveStore(identifier: { type: 'slug' | 'domain' | 'demo'; value: string }): Promise<Store | null> {
  // Demo mode returns null (will use mock data)
  if (identifier.type === 'demo') {
    return null
  }

  // Check cache
  const cacheKey = `${identifier.type}:${identifier.value}`
  const cached = storeCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.store
  }

  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .single()

    if (identifier.type === 'slug') {
      query = supabase
        .from('stores')
        .select('*')
        .eq('slug', identifier.value)
        .eq('is_active', true)
        .single()
    } else if (identifier.type === 'domain') {
      query = supabase
        .from('stores')
        .select('*')
        .eq('custom_domain', identifier.value)
        .eq('is_active', true)
        .single()
    }

    const { data, error } = await query

    if (error || !data) {
      storeCache.set(cacheKey, { store: null, timestamp: Date.now() })
      return null
    }

    storeCache.set(cacheKey, { store: data, timestamp: Date.now() })
    return data
  } catch (error) {
    console.error('Error resolving store:', error)
    return null
  }
}

/**
 * Get current store for the request
 */
export async function getCurrentStore(): Promise<Store | null> {
  const identifier = await getStoreIdentifier()
  return resolveStore(identifier)
}

/**
 * Convert database Store to StoreConfig for frontend
 */
export function storeToConfig(store: Store | null): StoreConfig {
  if (!store) {
    return mockStoreConfig
  }

  return {
    name: store.name,
    tagline: store.tagline || '',
    theme: store.theme as ThemeType,
    logo: store.logo_url || undefined,
    currency: store.currency,
    currencySymbol: store.currency_symbol,
    announcement: store.announcement || undefined,
    socialLinks: {
      instagram: store.instagram_url || undefined,
      twitter: store.twitter_url || undefined,
      tiktok: store.tiktok_url || undefined,
    },
    googleSheetId: store.google_sheet_id || undefined,
  }
}

/**
 * Clear store cache (useful after updates)
 */
export function clearStoreCache(storeSlug?: string) {
  if (storeSlug) {
    storeCache.delete(`slug:${storeSlug}`)
  } else {
    storeCache.clear()
  }
}
