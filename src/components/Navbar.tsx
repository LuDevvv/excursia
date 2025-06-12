'use client'

import { useEffect } from 'react'
import { HelpCircle, MapPinned, ThumbsUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import LanguageSelector from './LanguageSelector'
import { useNavbarScroll, useScrollTo } from '@/hooks'
import React from 'react'

interface NavItem {
  href: string
  translationKey: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export default function Navbar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useNavbarScroll()
  const { scrollToSection, scrollToTop } = useScrollTo()
  const t = useTranslations('navbar')

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const navItems: NavItem[] = [
    { href: 'excursions', translationKey: 'excursions', icon: MapPinned },
    { href: 'why-choose-us', translationKey: 'whyChooseUs', icon: ThumbsUp },
    { href: 'faq', translationKey: 'faq', icon: HelpCircle },
  ]

  const handleNavClick = (sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToSection(sectionId)
    setMobileMenuOpen(false)
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToTop()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo - Preparado para imagen */}
            <a
              href="#"
              className="text-primary hover:text-primary-dark transition-colors duration-200"
              onClick={handleLogoClick}
            >
              <div className="flex items-center">
                {/* Logo de la empresa - Tamaño más grande */}
                <Image
                  src="/images/logo.png"
                  alt="Excursia Logo"
                  width={180}
                  height={80}
                  className="h-12 lg:h-14 w-auto"
                />
                {/* 
                  Texto de respaldo si no tienes logo:
                  <span className="text-2xl lg:text-3xl font-bold tracking-tight">EXCURSIA</span>
                */}
              </div>
            </a>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              {/* Desktop Navigation */}
              <nav className="hidden lg:block">
                <ul className="flex items-center space-x-8 xl:space-x-10">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={`#${item.href}`}
                        className="relative font-medium text-gray-700 hover:text-primary uppercase text-sm tracking-wide flex items-center gap-2 py-2 px-1 group transition-colors duration-200"
                        onClick={(e) => handleNavClick(item.href, e)}
                      >
                        <span className="text-primary group-hover:text-primary-dark transition-colors duration-200">
                          <item.icon size={20} />
                        </span>
                        <span>{t(item.translationKey)}</span>
                        {/* Underline effect */}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
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
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <div className="relative w-5 h-5">
                  <span
                    className={`absolute left-0 block w-5 h-0.5 bg-gray-600 transition-all duration-200 ${
                      mobileMenuOpen ? 'top-2.5 rotate-45' : 'top-0.5'
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-2 block w-5 h-0.5 bg-gray-600 transition-all duration-200 ${
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute left-0 block w-5 h-0.5 bg-gray-600 transition-all duration-200 ${
                      mobileMenuOpen ? 'top-2.5 -rotate-45' : 'top-3.5'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-0 bottom-0 z-40 transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{
          paddingTop: '64px',
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="h-full flex flex-col container mx-auto px-4 sm:px-6 pb-6">
          <nav className="flex-1 pt-6">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.href}`}
                    className="font-medium text-gray-700 hover:text-primary py-4 px-4 rounded-xl hover:bg-primary/5 flex items-center gap-3 transition-all duration-200 group border border-transparent hover:border-primary/10"
                    onClick={(e) => handleNavClick(item.href, e)}
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200 group-hover:scale-105">
                      <item.icon size={20} />
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
          <div className="mt-auto border-t border-gray-200/70 pt-6">
            <LanguageSelector isMobile={true} />
          </div>
        </div>
      </div>
    </>
  )
}
