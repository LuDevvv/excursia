'use client'

import { useEffect, useRef } from 'react'
import { Menu, X, HelpCircle, MapPinned, ThumbsUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LanguageSelector from './LanguageSelector'
import { useNavbarScroll, useScrollTo } from '@/hooks'

interface NavItem {
  href: string
  translationKey: string
  icon: React.ReactNode
}

export default function Navbar() {
  const { scrollPosition, scrollDirection, mobileMenuOpen, setMobileMenuOpen } = useNavbarScroll()
  const { scrollToSection, scrollToTop } = useScrollTo()
  const t = useTranslations('navbar')
  const navRef = useRef<HTMLElement>(null)

  // Enhanced scroll behavior with transparency
  const isAtTop = scrollPosition < 100 // Transparent when at top
  const isScrolled = scrollPosition > 50 // Shows background after 50px
  const hideNavbar = scrollDirection === 'down' && scrollPosition > 150 && !mobileMenuOpen

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
    { href: 'excursions', translationKey: 'excursions', icon: <MapPinned size={20} /> },
    { href: 'why-choose-us', translationKey: 'whyChooseUs', icon: <ThumbsUp size={20} /> },
    { href: 'faq', translationKey: 'faq', icon: <HelpCircle size={20} /> },
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

  // Dynamic classes based on scroll position
  const getNavbarClasses = () => {
    let classes = 'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out '

    if (hideNavbar) {
      classes += '-translate-y-full '
    } else {
      classes += 'translate-y-0 '
    }

    if (isAtTop) {
      // Transparent at top
      classes += 'bg-transparent backdrop-blur-none py-6 '
    } else if (isScrolled) {
      // White background with blur when scrolled
      classes += 'bg-white/95 backdrop-blur-lg shadow-lg py-3 border-b border-gray-100/50 '
    } else {
      // Transition state
      classes += 'bg-white/70 backdrop-blur-md py-4 '
    }

    return classes
  }

  // Dynamic text colors based on background
  const getTextClasses = (isLogo = false) => {
    if (isAtTop) {
      // White text on transparent background
      return isLogo
        ? 'text-white drop-shadow-lg hover:text-white/90'
        : 'text-white/90 hover:text-white drop-shadow-md'
    } else {
      // Dark text on white background
      return isLogo ? 'text-primary hover:text-primary-dark' : 'text-gray-700 hover:text-primary'
    }
  }

  const getIconClasses = () => {
    return isAtTop
      ? 'text-white/80 group-hover:text-white'
      : 'text-primary group-hover:text-primary-dark'
  }

  const getMobileButtonClasses = () => {
    return isAtTop
      ? 'text-white/80 hover:bg-white/10 border-white/20'
      : 'text-gray-500 hover:bg-gray-100 border-gray-200'
  }

  return (
    <>
      <header ref={navRef} className={getNavbarClasses()}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              className={`relative z-10 transition-all duration-300 ${getTextClasses(true)}`}
              onClick={handleLogoClick}
            >
              <div className="flex items-center">
                <span className="text-2xl lg:text-3xl font-bold tracking-tight">EXCURSIA</span>
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
                        className={`relative font-medium transition-all duration-300 uppercase text-sm tracking-wide flex items-center gap-2 py-2 px-1 group ${getTextClasses()}`}
                        onClick={(e) => handleNavClick(item.href, e)}
                      >
                        <span className={`transition-colors duration-300 ${getIconClasses()}`}>
                          {item.icon}
                        </span>
                        <span className="transition-colors duration-300">
                          {t(item.translationKey)}
                        </span>
                        {/* Underline effect */}
                        <span
                          className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                            isAtTop ? 'bg-white' : 'bg-primary'
                          }`}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Language Selector - Desktop */}
              <div className="hidden lg:block">
                <div className={isAtTop ? 'language-selector-dark' : 'language-selector-light'}>
                  <LanguageSelector />
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                className={`lg:hidden p-2 rounded-lg transition-all duration-300 relative z-50 border ${getMobileButtonClasses()}`}
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute left-0 block w-6 h-0.5 transition-all duration-300 ${
                      isAtTop ? 'bg-white' : 'bg-gray-600'
                    } ${mobileMenuOpen ? 'top-3 rotate-45' : 'top-1'}`}
                  />
                  <span
                    className={`absolute left-0 top-3 block w-6 h-0.5 transition-all duration-300 ${
                      isAtTop ? 'bg-white' : 'bg-gray-600'
                    } ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <span
                    className={`absolute left-0 block w-6 h-0.5 transition-all duration-300 ${
                      isAtTop ? 'bg-white' : 'bg-gray-600'
                    } ${mobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-0 bottom-0 z-40 transition-all duration-500 ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{
          paddingTop: isAtTop ? '92px' : isScrolled ? '76px' : '84px',
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
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
                    className="font-medium text-gray-700 hover:text-primary py-4 px-4 rounded-xl hover:bg-primary/5 flex items-center gap-4 transition-all duration-300 group border border-transparent hover:border-primary/10"
                    onClick={(e) => handleNavClick(item.href, e)}
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="uppercase text-sm tracking-wide group-hover:text-primary group-hover:font-semibold transition-all duration-300">
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
