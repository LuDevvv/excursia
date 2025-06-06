'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, HelpCircle, MapPinned, ThumbsUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LanguageSelector from './LanguageSelector'

interface NavItem {
  href: string
  translationKey: string
  icon: React.ReactNode
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const t = useTranslations('navbar')
  const navRef = useRef<HTMLElement>(null)

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navItems: NavItem[] = [
    { href: '#excursions', translationKey: 'excursions', icon: <MapPinned size={20} /> },
    { href: '#why-choose-us', translationKey: 'whyChooseUs', icon: <ThumbsUp size={20} /> },
    { href: '#faq', translationKey: 'faq', icon: <HelpCircle size={20} /> },
  ]

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 150)
  }

  return (
    <>
      <header
        ref={navRef}
        className={`bg-white fixed top-0 left-0 right-0 z-50 ${
          isScrolled
            ? 'py-4 shadow-md transition-all duration-300'
            : 'py-6 transition-all duration-300'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="relative z-10">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary">EXCURSIA</span>
              </div>
            </a>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-6">
              {/* Desktop Navigation */}
              <nav className="hidden lg:block">
                <ul className="flex items-center space-x-10">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="relative font-medium text-gray-700 transition-colors uppercase text-sm tracking-wide flex items-center gap-1.5 py-2 px-1 group"
                      >
                        <span className="text-primary group-hover:text-primary-dark transition-colors">
                          {item.icon}
                        </span>
                        <span className="group-hover:text-primary transition-colors">
                          {t(item.translationKey)}
                        </span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Language Selector - Desktop */}
              <div className="hidden lg:block">
                <LanguageSelector />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors relative z-50"
              >
                {isOpen ? (
                  <X size={24} className="text-gray-500" />
                ) : (
                  <Menu size={24} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-0 bottom-0 z-40 bg-white shadow-md transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          paddingTop: isScrolled ? '88px' : '104px',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        <div className="h-full flex flex-col container mx-auto px-4 pb-6">
          <nav className="flex-1">
            <ul className="space-y-3">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="font-medium text-gray-700 hover:text-primary py-3 px-3 rounded-md hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                      {item.icon}
                    </div>
                    <span className="uppercase text-sm tracking-wide group-hover:text-primary group-hover:font-medium transition-all duration-200">
                      {t(item.translationKey)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Language Selector for Mobile */}
          <div className="mt-auto">
            <LanguageSelector isMobile={true} />
          </div>
        </div>
      </div>
    </>
  )
}
