// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for admin, api, and other excluded paths
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return
  }

  // Apply i18n routing only to frontend routes
  return handleI18nRouting(request)
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - admin routes
    // - _next static files
    // - files with extensions
    '/((?!api|admin|_next|.*\\..*).*)',
  ],
}
