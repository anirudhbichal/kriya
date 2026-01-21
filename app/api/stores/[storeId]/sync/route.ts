import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncGoogleSheetToDatabase } from '@/lib/sync-service'

// POST /api/stores/[storeId]/sync - Trigger sync for a store
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params
    const supabase = await createClient()

    // Verify user owns this store
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .eq('owner_id', user.id)
      .single()

    if (storeError || !store) {
      return NextResponse.json(
        { error: 'Store not found or access denied' },
        { status: 404 }
      )
    }

    if (!store.google_sheet_id) {
      return NextResponse.json(
        { error: 'No Google Sheet configured for this store' },
        { status: 400 }
      )
    }

    // Perform sync
    const result = await syncGoogleSheetToDatabase(store)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Sync failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      productsCount: result.productsCount,
      categoriesCount: result.categoriesCount,
    })
  } catch (error) {
    console.error('Sync API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
