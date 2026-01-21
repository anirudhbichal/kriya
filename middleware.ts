import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Add pathname to headers for tenant resolution
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  
  // Create response with pathname header
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set('x-pathname', request.nextUrl.pathname)

  // Skip Supabase session management if not configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    // Supabase not configured - continue without session management
    // This allows the app to work in demo mode with mock data
    return response
  }

  // Only import and use Supabase middleware if configured
  try {
    const { updateSession } = await import('@/lib/supabase/middleware')
    return updateSession(request)
  } catch (error) {
    console.error('Supabase middleware error:', error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
