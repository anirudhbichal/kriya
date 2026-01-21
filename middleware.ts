import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Add pathname to headers for tenant resolution
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  
  // Update Supabase session
  const response = await updateSession(request)
  
  // Copy the pathname header to response
  response.headers.set('x-pathname', request.nextUrl.pathname)

  const host = request.headers.get('host') || ''
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'kriya.store'
  
  // Skip middleware for API routes, static files, etc.
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return response
  }

  // Development mode: allow everything
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return response
  }

  // Main domain (www.kriya.store or kriya.store) - show landing/marketing page
  if (host === baseDomain || host === `www.${baseDomain}`) {
    // Rewrite to landing page
    if (!request.nextUrl.pathname.startsWith('/landing')) {
      // For now, just pass through - we'll add a landing page later
      return response
    }
  }

  // Subdomain or custom domain - this is a store
  // The tenant resolution happens in the page/layout via getCurrentStore()
  
  return response
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
