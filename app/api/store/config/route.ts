import { NextResponse } from 'next/server'
import { getCurrentStore, storeToConfig } from '@/lib/tenant'

// GET /api/store/config - Get store config for current store (multi-tenant)
export async function GET() {
  try {
    const store = await getCurrentStore()
    const config = storeToConfig(store)

    return NextResponse.json(config)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    )
  }
}

// Revalidate every 60 seconds
export const revalidate = 60
