import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define locales
export const locales = ['en', 'es'];
export const defaultLocale = 'en';

// This is the configuration for next-intl to implement locale-based routing
export default getRequestConfig(async ({ locale }) => {
  // Validate if the locale is supported
  if (!locales.includes(locale as any)) notFound();

  // Load the messages for the locale
  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    messages,
    defaultTranslationValues: {
      strong: (children) => <strong>{children}</strong>,
    },
  };
});