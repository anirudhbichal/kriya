import { NextRequest, NextResponse } from 'next/server'
import { StoreInsert } from '@/lib/database.types'

// Check if Supabase is configured
function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// GET /api/stores - Get user's stores
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured. Running in demo mode.' },
      { status: 503 }
    )
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: stores, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch stores' },
        { status: 500 }
      )
    }

    return NextResponse.json(stores)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/stores - Create a new store
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured. Running in demo mode.' },
      { status: 503 }
    )
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, slug, tagline, theme, currency, currencySymbol, googleSheetId } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Validate slug format
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) || slug.length < 3) {
      return NextResponse.json(
        { error: 'Slug must be lowercase alphanumeric with hyphens, at least 3 characters' },
        { status: 400 }
      )
    }

    // Check if slug is available
    const { data: existing } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'This slug is already taken' },
        { status: 409 }
      )
    }

    // Check user's store limit based on plan (free = 1 store)
    const { count } = await supabase
      .from('stores')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    if (count && count >= 1) {
      // For now, limit to 1 store on free plan
      return NextResponse.json(
        { error: 'You have reached your store limit. Upgrade to create more stores.' },
        { status: 403 }
      )
    }

    // Create store
    const storeData: StoreInsert = {
      owner_id: user.id,
      name,
      slug,
      tagline: tagline || null,
      theme: theme || 'neon',
      currency: currency || 'USD',
      currency_symbol: currencySymbol || '$',
      google_sheet_id: googleSheetId || null,
    }

    const { data: store, error } = await supabase
      .from('stores')
      .insert(storeData as never)
      .select()
      .single()

    if (error) {
      console.error('Error creating store:', error)
      return NextResponse.json(
        { error: 'Failed to create store' },
        { status: 500 }
      )
    }

    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
