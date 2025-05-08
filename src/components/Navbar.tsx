"use client"

import { useState, useEffect } from 'react'
import { Facebook, Instagram, Twitter, Menu, X, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [language, setLanguage] = useState('en')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  
  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleLanguageDropdown = () => setShowLanguageDropdown(!showLanguageDropdown)
  
  const switchLanguage = (lang: string) => {
    setLanguage(lang)
    setShowLanguageDropdown(false)
    // Here you would implement language switching logic
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isOpen ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* Replace with your actual logo */}
            <div className="relative w-40 h-12">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${isScrolled || isOpen ? 'text-primary' : 'text-white'}`}>
                  EXCURSIA
                </span>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {/* Navigation Links */}
              <a 
                href="#excursions" 
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'
                }`}
              >
                Excursions
              </a>
              <a 
                href="#faq" 
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'
                }`}
              >
                FAQ
              </a>
              <a 
                href="#contact" 
                className={`font-medium transition-colors ${
                  isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'
                }`}
              >
                Contact
              </a>
            </div>
            
            {/* Social & Language */}
            <div className="flex items-center space-x-4">
              {/* Social Icons */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-colors ${
                  isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'
                }`}
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-colors ${
                  isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'
                }`}
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-colors ${
                  isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'
                }`}
              >
                <Twitter size={20} />
              </a>
              
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={toggleLanguageDropdown}
                  className={`flex items-center space-x-1 transition-colors ${
                    isScrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-gray-200'
                  }`}
                >
                  <Globe size={20} />
                  <span>{language === 'en' ? 'EN' : 'ES'}</span>
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => switchLanguage('en')}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                    <button
                      onClick={() => switchLanguage('en')}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        language === 'en' ? 'text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => switchLanguage('es')}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        language === 'es' ? 'text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Español
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
          
          <button 
            className="md:hidden text-3xl"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
            ) : (
              <Menu size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
            )}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden py-4 bg-white">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <a 
              href="#excursions" 
              className="font-medium text-gray-800 hover:text-primary py-2"
              onClick={() => setIsOpen(false)}
            >
              Excursions
            </a>
            <a 
              href="#faq" 
              className="font-medium text-gray-800 hover:text-primary py-2"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </a>
            <a 
              href="#contact" 
              className="font-medium text-gray-800 hover:text-primary py-2"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            
            {/* Language & Social on Mobile */}
            <div className="flex flex-col space-y-4 pt-4 border-t">
              {/* Language Switcher */}
              <div className="flex space-x-4 items-center">
                <span className="text-gray-600">Language:</span>
                <button
                  onClick={() => switchLanguage('en')}
                  className={`${language === 'en' ? 
                    'bg-primary text-white' : 
                    'bg-gray-200 text-gray-800'
                  } px-3 py-1 rounded-md`}
                >
                  EN
                </button>
                <button
                  onClick={() => switchLanguage('es')}
                  className={`${language === 'es' ? 
                    'bg-primary text-white' : 
                    'bg-gray-200 text-gray-800'
                  } px-3 py-1 rounded-md`}
                >
                  ES
                </button>
              </div>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-primary"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-primary"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-primary"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}