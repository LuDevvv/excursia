import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Detect user's preferred locale from request headers
  localeDetection: true,

  // Optional: Use browser's locale detection as fallback
  localePrefix: 'as-needed',
})

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. images, CSS, JS)
  // - API routes
  // - _next paths (Next.js internals)
  // - Font files
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
