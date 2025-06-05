'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Home, Map, HelpCircle, Mail } from 'lucide-react'
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Navigation items with icons
  const navItems: NavItem[] = [
    { href: '#excursions', translationKey: 'attractions', icon: <Map size={16} /> },
    { href: '#why-choose-us', translationKey: 'thePark', icon: <Home size={16} /> },
    { href: '#faq', translationKey: 'planYourVisit', icon: <HelpCircle size={16} /> },
  ]

  return (
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
              <span className="text-2xl font-bold text-primary">LOGO</span>
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

            {/* Language Selector */}
            <LanguageSelector />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-[${isScrolled ? '72px' : '88px'}] left-0 w-full bg-white shadow-md transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          top: isScrolled ? '72px' : '88px',
          borderTop: '1px solid #f3f4f6',
          transform: isOpen ? 'translateY(0)' : 'translateY(-1rem)',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <nav>
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
          <LanguageSelector isMobile={true} />
        </div>
      </div>
    </header>
  )
}
