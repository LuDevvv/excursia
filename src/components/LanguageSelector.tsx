'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface LanguageSelectorProps {
  isMobile?: boolean
}

export default function LanguageSelector({ isMobile = false }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('navbar')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isMobile) {
    return (
      <section className="mt-6 pt-5 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4 px-2 text-gray-700 uppercase text-sm font-semibold">
          <Globe className="w-4 h-4" />
          <p>{t('language')}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 px-2">
          <Link
            href={pathname}
            locale="en"
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm transition-all duration-200 ${
              locale === 'en'
                ? 'bg-primary text-white font-semibold'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Image
              src="/images/flags/en.svg"
              alt="English"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span>English</span>
          </Link>

          <Link
            href={pathname}
            locale="es"
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm transition-all duration-200 ${
              locale === 'es'
                ? 'bg-primary text-white font-semibold'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Image
              src="/images/flags/es.svg"
              alt="Español"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span>Español</span>
          </Link>
        </div>
      </section>
    )
  }

  // Desktop version - Simple white styling
  return (
    <div className="relative z-10" ref={dropdownRef}>
      <button
        className={`flex items-center gap-1.5 text-gray-700 hover:bg-gray-50 transition-all duration-200 p-2 rounded-lg ${
          isOpen ? 'bg-gray-50' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {locale === 'en' ? (
          <Image
            src="/images/flags/en.svg"
            alt="English"
            width={22}
            height={22}
            className="w-5.5 h-5.5"
          />
        ) : (
          <Image
            src="/images/flags/es.svg"
            alt="Español"
            width={22}
            height={22}
            className="w-5.5 h-5.5"
          />
        )}
        <ChevronDown
          size={14}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-6 w-36 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50"
          >
            <Link
              href={pathname}
              locale="en"
              className={`flex items-center w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-all duration-200 ${
                locale === 'en' ? 'text-primary font-medium bg-primary/5' : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/images/flags/en.svg"
                alt="English"
                width={18}
                height={18}
                className="w-4.5 h-4.5 mr-2.5"
              />
              <span className="text-sm">English</span>
            </Link>
            <Link
              href={pathname}
              locale="es"
              className={`flex items-center w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-all duration-200 ${
                locale === 'es' ? 'text-primary font-medium bg-primary/5' : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/images/flags/es.svg"
                alt="Español"
                width={18}
                height={18}
                className="w-4.5 h-4.5 mr-2.5"
              />
              <span className="text-sm">Español</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
