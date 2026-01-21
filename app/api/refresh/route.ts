import { NextResponse } from 'next/server';
import { clearCache, fetchAllSheetData } from '@/lib/google-sheets';

// POST endpoint to force refresh data from Google Sheets
export async function POST() {
  try {
    // Clear cache
    clearCache();
    
    // Fetch fresh data
    const data = await fetchAllSheetData();
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared and data refreshed',
      counts: {
        products: data.products.length,
        categories: data.categories.length,
      },
    });
  } catch (error) {
    console.error('Refresh Error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh data' },
      { status: 500 }
    );
  }
}
