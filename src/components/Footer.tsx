'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  ChevronRight,
  Heart,
} from 'lucide-react'
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubscribeStatus('success')
      setEmail('')
      setTimeout(() => setSubscribeStatus('idle'), 5000)
    } catch (error) {
      setSubscribeStatus('error')
      setTimeout(() => setSubscribeStatus('idle'), 5000)
    }
  }

  const socialLinks = [
    { icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
    { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
    { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
    { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn' },
  ]

  const contactInfo = [
    {
      icon: <MapPin size={18} />,
      content: '123 Beach Road, Punta Cana, Dominican Republic',
    },
    {
      icon: <Phone size={18} />,
      content: '+1 (809) 555-1234',
      href: 'tel:+18095551234',
    },
    {
      icon: <Mail size={18} />,
      content: 'info@medialife.com',
      href: 'mailto:info@medialifee.com',
    },
    {
      icon: <Clock size={18} />,
      content: `${t('openingHoursValue')}`,
    },
  ]

  const quickLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('aboutUs') },
    { href: '/excursions', label: t('excursions') },
    { href: '/contact', label: t('contact') },
    { href: '/faq', label: t('faq') },
    { href: '/privacy-policy', label: t('privacyPolicy') },
  ]

  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* About Column */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold text-white">EXCURSIA</span>
              </Link>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">{t('aboutText')}</p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information Column */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              {t('contactInfo')} <Mail className="ml-2 h-4 w-4" />
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-3 mt-0.5">{item.icon}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <span className="text-gray-400">{item.content}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold text-white mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold text-white mb-6">{t('newsletter')}</h4>
            <p className="text-gray-400 mb-4 leading-relaxed">{t('newsletterText')}</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-primary focus:border-primary focus:outline-none"
                  placeholder={t('emailPlaceholder')}
                  aria-label="Email address"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-primary hover:bg-primary-dark text-white font-medium p-2 rounded-md transition-colors"
                  disabled={subscribeStatus === 'loading'}
                  aria-label="Subscribe"
                >
                  {subscribeStatus === 'loading' ? (
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>

              {subscribeStatus === 'success' && (
                <p className="text-green-400 text-sm">{t('subscribeSuccess')}</p>
              )}

              {subscribeStatus === 'error' && (
                <p className="text-red-400 text-sm">{t('subscribeError')}</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-center md:text-left mb-4 md:mb-0 flex items-center text-sm">
              &copy; {new Date().getFullYear()} Media Life. {t('allRightsReserved')}
              <span className="mx-1 text-gray-600">•</span>
              <span className="flex items-center">
                Made with <Heart className="mx-1 h-3 w-3 text-red-500" /> in Dominican Republic
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-primary transition-colors text-sm"
              >
                {t('termsOfService')}
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-primary transition-colors text-sm"
              >
                {t('privacyPolicy')}
              </Link>
              <Link
                href="/cookies"
                className="text-gray-500 hover:text-primary transition-colors text-sm"
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
