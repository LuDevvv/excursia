'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone, Clock } from 'lucide-react'
import { useState } from 'react'

interface FooterProps {
  popularExcursions?: Array<{
    id: string | number
    title: string
    slug?: string
  }>
}

export default function Footer({ popularExcursions = [] }: FooterProps) {
  const t = useTranslations('footer')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      return
    }

    setSubscribeStatus('loading')

    try {
      // This would be replaced with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubscribeStatus('success')
      setEmail('')
      setTimeout(() => setSubscribeStatus('idle'), 5000)
    } catch (error) {
      setSubscribeStatus('error')
      setTimeout(() => setSubscribeStatus('idle'), 5000)
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-xl font-bold mb-4">{t('about')}</h4>
            <p className="text-gray-400 mb-4">{t('aboutText')}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xl font-bold mb-4">{t('contactInfo')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Beach Road, Punta Cana
                  <br />
                  Dominican Republic
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-primary mr-3 flex-shrink-0" />
                <a
                  href="tel:+18095551234"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +1 (809) 555-1234
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-primary mr-3 flex-shrink-0" />
                <a
                  href="mailto:info@excursia.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@excursia.com
                </a>
              </li>
              <li className="flex items-start">
                <Clock size={20} className="text-primary mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">
                  {t('openingHours')}:<br />
                  {t('openingHoursValue')}
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/excursions"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {t('excursions')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-bold mb-4">{t('newsletter')}</h4>
            <p className="text-gray-400 mb-4">{t('newsletterText')}</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-primary focus:border-primary"
                  placeholder={t('emailPlaceholder')}
                  aria-label="Email address"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors"
                disabled={subscribeStatus === 'loading'}
              >
                {subscribeStatus === 'loading' ? t('subscribing') : t('subscribe')}
              </button>

              {subscribeStatus === 'success' && (
                <p className="text-green-400 text-sm mt-2">{t('subscribeSuccess')}</p>
              )}

              {subscribeStatus === 'error' && (
                <p className="text-red-400 text-sm mt-2">{t('subscribeError')}</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Excursia. {t('allRightsReserved')}
            </p>
            <div className="flex space-x-6">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-primary transition-colors text-sm"
              >
                {t('termsOfService')}
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-primary transition-colors text-sm"
              >
                {t('privacyPolicy')}
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-primary transition-colors text-sm"
              >
                {t('cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
