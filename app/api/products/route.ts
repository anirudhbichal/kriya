import { NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/google-sheets';

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Revalidate every 60 seconds
export const revalidate = 60;
