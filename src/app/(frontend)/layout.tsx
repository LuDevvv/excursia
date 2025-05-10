import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Excursia - Unforgettable Adventures in Dominican Republic',
  description:
    'Book amazing excursions and tours in the Dominican Republic. Experience the best tours with Excursia.',
  keywords: 'dominican republic, excursions, tours, travel, vacation, punta cana, la romana',
  openGraph: {
    title: 'Excursia - Unforgettable Adventures in Dominican Republic',
    description:
      'Book amazing excursions and tours in the Dominican Republic. Experience the best tours with Excursia.',
    url: 'https://excursia.com',
    siteName: 'Excursia',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Excursia - Dominican Republic Tours',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = await getMessages(locale)
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
