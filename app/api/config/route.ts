import { NextResponse } from 'next/server';
import { fetchStoreConfig } from '@/lib/google-sheets';

export async function GET() {
  try {
    const config = await fetchStoreConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

// Revalidate every 60 seconds
export const revalidate = 60;
