import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Define locales
export const locales = ['en', 'es']
export const defaultLocale = 'en'

// Configuration for next-intl to implement locale-based routing
export default getRequestConfig(async ({ locale }) => {
  // Validate if the locale is supported
  if (!locales.includes(locale as any)) notFound()

  try {
    // Load the messages for the locale
    const messages = (await import(`../messages/${locale}.json`)).default

    // Ensure locale is never undefined by casting it
    const safeLocale: string = locale as string

    return {
      locale: safeLocale, // Now we guarantee it's a string
      messages,
      // Use string manipulation instead of JSX
      defaultTranslationValues: {
        strong: (chunks: string) => `<strong>${chunks}</strong>`,
        br: () => '<br/>',
      },
    }
  } catch (error) {
    // If messages file doesn't exist, return notFound
    console.error(`Failed to load messages for locale: ${locale}`, error)
    notFound()
  }
})

// No export here to avoid duplicate declarations
