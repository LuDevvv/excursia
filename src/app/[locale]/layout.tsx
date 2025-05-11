import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { locales } from '@/i18n'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // First, await params
  const locale = params.locale

  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Load messages
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
