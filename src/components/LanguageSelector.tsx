'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'framer-motion'

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
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-gray-600 font-medium mb-3 px-1 uppercase text-sm">IDIOMA:</p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={pathname}
            locale="en"
            className={`flex items-center justify-center gap-2 py-3 rounded transition-all duration-200 ${
              locale === 'en'
                ? 'bg-primary text-white font-medium'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <img src="/images/flags/en.svg" alt="English" className="w-5 h-5" />
            <span>English</span>
          </Link>
          <Link
            href={pathname}
            locale="es"
            className={`flex items-center justify-center gap-2 py-3 rounded transition-all duration-200 ${
              locale === 'es'
                ? 'bg-primary text-white font-medium'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <img src="/images/flags/es.svg" alt="Español" className="w-5 h-5" />
            <span>Español</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10" ref={dropdownRef}>
      <button
        className={`flex items-center gap-1 text-gray-700 hover:bg-gray-100 transition-all duration-200 p-2 rounded ${
          isOpen ? 'bg-gray-100' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {locale === 'en' ? (
          <img src="/images/flags/en.svg" alt="English" className="w-6 h-6" />
        ) : (
          <img src="/images/flags/es.svg" alt="Español" className="w-6 h-6" />
        )}
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-7 w-32 bg-white rounded shadow-md py-1 border border-gray-100 z-50"
          >
            <Link
              href={pathname}
              locale="en"
              className={`flex items-center w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-all duration-200 ${
                locale === 'en' ? 'text-primary font-medium' : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <img src="/images/flags/en.svg" alt="English" className="w-5 h-5 mr-2" />
              English
            </Link>
            <Link
              href={pathname}
              locale="es"
              className={`flex items-center w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-all duration-200 ${
                locale === 'es' ? 'text-primary font-medium' : 'text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <img src="/images/flags/es.svg" alt="Español" className="w-5 h-5 mr-2" />
              Español
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
