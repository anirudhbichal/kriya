import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStore } from '@/lib/tenant'
import { getStoreProducts, getProductsByCategory, searchProducts } from '@/lib/store-service'

// GET /api/store/products - Get products for current store (multi-tenant)
export async function GET(request: NextRequest) {
  try {
    const store = await getCurrentStore()
    const storeId = store?.id || null

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let products

    if (search) {
      products = await searchProducts(storeId, search)
    } else if (category) {
      products = await getProductsByCategory(storeId, category)
    } else {
      products = await getStoreProducts(storeId)
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// Revalidate every 60 seconds
export const revalidate = 60
