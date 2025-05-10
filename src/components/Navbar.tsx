'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Globe, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { locales } from '@/i18n'

interface NavLink {
  href: string
  translationKey: string
  label?: {
    en: string
    es: string
  }
  dropdown?: NavLink[]
}

const navLinks: NavLink[] = [
  {
    href: '/the-park',
    translationKey: 'thePark',
    label: {
      en: '',
      es: '',
    },
  },
  {
    href: '/attractions',
    translationKey: 'attractions',
    label: {
      en: '',
      es: '',
    },
  },
  {
    href: '#',
    translationKey: 'planYourVisit',
    dropdown: [
      {
        href: '/tickets',
        translationKey: 'tickets',
        label: {
          en: '',
          es: '',
        },
      },
      {
        href: '/hours',
        translationKey: 'hours',
        label: {
          en: '',
          es: '',
        },
      },
      {
        href: '/directions',
        label: {
          en: '',
          es: '',
        },
        translationKey: '',
      },
    ],
    label: {
      en: '',
      es: '',
    },
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()
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
    // Get the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

    // Navigate to the same page but with the new locale
    router.push(pathWithoutLocale, { locale: lang })

    // Save preference in localStorage for client-side detection
    localStorage.setItem('preferredLocale', lang)
  }

  const toggleDropdown = (key: string) => {
    if (activeDropdown === key) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(key)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-14 w-40">
              <span className="text-2xl font-bold text-primary">EXCURSIA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <div className="flex space-x-6">
              {/* Navigation Links */}
              {navLinks.map((link, index) => (
                <div key={index} className="relative group">
                  {link.dropdown ? (
                    <button
                      onClick={() => toggleDropdown(link.translationKey)}
                      className="flex items-center font-medium text-gray-800 hover:text-primary transition-colors"
                    >
                      {t(link.translationKey)}
                      <ChevronDown size={16} className="ml-1" />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="font-medium text-gray-800 hover:text-primary transition-colors"
                    >
                      {t(link.translationKey)}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {link.dropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      {link.dropdown.map((dropdownLink, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownLink.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t(dropdownLink.translationKey)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-800 hover:text-primary transition-colors">
                <Globe size={20} />
                <span>{locale === 'en' ? 'EN' : 'ES'}</span>
                <ChevronDown size={16} />
              </button>

              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <button
                  onClick={() => switchLanguage('en')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    locale === 'en' ? 'text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => switchLanguage('es')}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    locale === 'es' ? 'text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Español
                </button>
              </div>
            </div>

            {/* Book Now Button */}
            <Link
              href="/booking"
              className="bg-secondary hover:bg-secondary-dark text-white py-2 px-6 rounded-lg transition-colors font-medium"
            >
              {t('bookNow')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4 lg:hidden">
            {/* Mobile Book Now */}
            <Link
              href="/booking"
              className="bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
            >
              {t('bookNow')}
            </Link>

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
      {isOpen && (
        <div className="lg:hidden py-4 bg-white border-t">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <div key={index}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(link.translationKey)}
                      className="flex items-center justify-between w-full font-medium text-gray-800 hover:text-primary py-2"
                    >
                      <span>{t(link.translationKey)}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${activeDropdown === link.translationKey ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {activeDropdown === link.translationKey && (
                      <div className="pl-4 mt-2 border-l-2 border-gray-200 space-y-2">
                        {link.dropdown.map((dropdownLink, dropdownIndex) => (
                          <Link
                            key={dropdownIndex}
                            href={dropdownLink.href}
                            className="block py-2 text-gray-700 hover:text-primary"
                            onClick={() => setIsOpen(false)}
                          >
                            {t(dropdownLink.translationKey)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="font-medium text-gray-800 hover:text-primary py-2 block"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(link.translationKey)}
                  </Link>
                )}
              </div>
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
        </div>
      )}
    </header>
  )
}
