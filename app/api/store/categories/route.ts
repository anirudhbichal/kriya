import { NextResponse } from 'next/server'
import { getCurrentStore } from '@/lib/tenant'
import { getStoreCategories } from '@/lib/store-service'

// GET /api/store/categories - Get categories for current store (multi-tenant)
export async function GET() {
  try {
    const store = await getCurrentStore()
    const storeId = store?.id || null

    const categories = await getStoreCategories(storeId)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// Revalidate every 60 seconds
export const revalidate = 60
