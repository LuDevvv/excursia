'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { locales } from '@/i18n'

interface NavItem {
  href: string
  translationKey: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeLanguageMenu, setActiveLanguageMenu] = useState(false)
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('navbar')

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const switchLanguage = (lang: string) => {
    // Save preference in localStorage for client-side detection
    localStorage.setItem('preferredLocale', lang)
    // Force a refresh to reload the page in the new locale
    window.location.href = lang === 'en' ? '/' : `/${lang}`
  }

  // Navigation items - these will be anchor links in the single page
  const navItems: NavItem[] = [
    { href: '#excursions', translationKey: 'attractions' },
    { href: '#why-choose-us', translationKey: 'thePark' },
    { href: '#faq', translationKey: 'planYourVisit' },
    { href: '#contact', translationKey: 'contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <div className="relative h-14 w-40">
              <span className="text-2xl font-bold text-primary">EXCURSIA</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <div className="flex space-x-6">
              {/* Navigation Links */}
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="font-medium text-gray-800 hover:text-primary transition-colors"
                >
                  {t(item.translationKey)}
                </a>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-800 hover:text-primary transition-colors"
                onClick={() => setActiveLanguageMenu(!activeLanguageMenu)}
              >
                <Globe size={20} />
                <span>{locale === 'en' ? 'EN' : 'ES'}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${activeLanguageMenu ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {activeLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <button
                      onClick={() => switchLanguage('en')}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        locale === 'en'
                          ? 'text-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => switchLanguage('es')}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        locale === 'es'
                          ? 'text-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Español
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Book Now Button */}
            <a
              href="#excursions"
              className="bg-secondary hover:bg-secondary-dark text-white py-2 px-6 rounded-lg transition-colors font-medium"
            >
              {t('bookNow')}
            </a>
          </nav>

          <div className="flex items-center space-x-4 lg:hidden">
            {/* Mobile Book Now */}
            <a
              href="#excursions"
              className="bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
            >
              {t('bookNow')}
            </a>

            {/* Mobile Menu Toggle */}
            <button onClick={toggleMenu} aria-label="Toggle Menu">
              {isOpen ? (
                <X size={24} className="text-gray-800" />
              ) : (
                <Menu size={24} className="text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden py-4 bg-white border-t overflow-hidden"
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="font-medium text-gray-800 hover:text-primary py-2 block"
                  onClick={() => setIsOpen(false)}
                >
                  {t(item.translationKey)}
                </a>
              ))}

              {/* Language Switcher on Mobile */}
              <div className="pt-4 border-t">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-gray-600 font-medium">{t('language')}:</span>
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`${
                      locale === 'en' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
                    } px-3 py-1 rounded-md transition-colors`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => switchLanguage('es')}
                    className={`${
                      locale === 'es' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
                    } px-3 py-1 rounded-md transition-colors`}
                  >
                    ES
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
