import { NextResponse } from 'next/server';
import { fetchCategories } from '@/lib/google-sheets';

export async function GET() {
  try {
    const categories = await fetchCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Revalidate every 60 seconds
export const revalidate = 60;
