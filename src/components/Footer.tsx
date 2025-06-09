'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Heart,
} from 'lucide-react'

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
    <footer className="bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* About Section - Logo + Description */}
          <div>
            <div className="mb-6">
              <Link href="/" className="inline-block">
                {/* Logo de la empresa */}
                <Image
                  src="/images/logo.png"
                  alt="Excursia Logo"
                  width={160}
                  height={60}
                  className="h-10 w-auto hover:opacity-80 transition-opacity duration-300"
                />
                {/* 
                  Fallback text si no tienes logo:
                  <span className="text-2xl font-bold text-white">EXCURSIA</span>
                */}
              </Link>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">{t('aboutText')}</p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              {t('contactInfo')}
            </h4>

            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-3 mt-0.5 flex-shrink-0">{item.icon}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <span className="text-gray-300">{item.content}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0 flex items-center text-sm">
              &copy; {new Date().getFullYear()} Media Life. {t('allRightsReserved')}
              <span className="mx-2 text-gray-600">•</span>
              <span className="flex items-center">
                Made with <Heart className="mx-1 h-3 w-3 text-red-500" /> in Dominican Republic
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-6">
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
