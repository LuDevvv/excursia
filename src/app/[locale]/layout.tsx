import '../globals.css'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { locales } from '@/i18n'

const inter = Inter({ subsets: ['latin'] })

// Tipo derivado de tu array de locales
type Locale = (typeof locales)[number]

// Función para que TS sepa que, tras el guard, locale es Locale
function isLocale(l: string): l is Locale {
  return locales.includes(l as Locale)
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Si no es uno de los dos, devolvemos 404
  if (!isLocale(locale)) {
    notFound()
  }

  // Ahora TS sabe que locale es 'en'|'es'
  const messages = await getMessages({ locale })

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="America/Santo_Domingo"
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
