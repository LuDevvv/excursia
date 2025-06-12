'use client'

import { useTranslations } from 'next-intl'
import { Excursion } from '@/payload-types'
import { useState, useRef, useEffect } from 'react'
import ExcursionCard from '@/components/ExcursionCard'
import BookingModal from '@/components/modals/BookingModal'
import ExcursionDetailsModal from '@/components/modals/ExcursionDetailsModal'
import { ChevronLeft, ChevronRight, Compass, MapPin } from 'lucide-react'
import AnimatedSection from '../ui/AnimatedSection'

interface ExcursionSectionProps {
  excursions: Excursion[]
}

export default function ExcursionSection({ excursions }: ExcursionSectionProps) {
  const t = useTranslations('homepage')
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Monitor scroll position to determine arrow visibility
  useEffect(() => {
    if (!scrollContainerRef.current || excursions.length === 0) return

    const checkScrollButtons = () => {
      const container = scrollContainerRef.current
      if (!container) return

      setCanScrollLeft(container.scrollLeft > 20)
      const maxScrollLeft = container.scrollWidth - container.clientWidth - 20
      setCanScrollRight(container.scrollLeft < maxScrollLeft)
    }

    checkScrollButtons()
    const container = scrollContainerRef.current
    container.addEventListener('scroll', checkScrollButtons)
    const resizeObserver = new ResizeObserver(checkScrollButtons)
    resizeObserver.observe(container)
    window.addEventListener('resize', checkScrollButtons)

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollButtons)
        resizeObserver.disconnect()
      }
      window.removeEventListener('resize', checkScrollButtons)
    }
  }, [excursions.length])

  const handleExcursionClick = (excursion: Excursion) => {
    setSelectedExcursion(excursion)
    setShowDetailsModal(true)
  }

  const handleBookNowClick = () => {
    setShowDetailsModal(false)
    setTimeout(() => {
      setShowBookingModal(true)
    }, 300)
  }

  const handleBookingSuccess = () => {
    setShowBookingModal(false)
    setSelectedExcursion(null)
  }

  const handleCloseModals = () => {
    setShowDetailsModal(false)
    setShowBookingModal(false)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.clientWidth < 768 ? scrollContainerRef.current.clientWidth : 340

      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth',
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.clientWidth < 768 ? scrollContainerRef.current.clientWidth : 340

      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section
      id="excursions"
      className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl">
        {/* Header Section */}
        <AnimatedSection
          animation="slideUp"
          delay={100}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-primary font-medium italic mb-3 text-sm sm:text-base flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('discoverParadise') || 'Discover Paradise'}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6 leading-tight">
              {t('excursionsTitle')}
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-primary mx-auto rounded-full mb-4 sm:mb-6" />
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              {t('excursionsSubtitle')}
            </p>
          </div>
        </AnimatedSection>

        {/* Content Section */}
        {excursions.length === 0 ? (
          <AnimatedSection animation="scaleIn" delay={300} className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center border border-blue-100">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-lg mb-6 group hover:scale-105 transition-all duration-300">
                  <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-primary group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                {t('readyToStartAdventure')}
              </h3>

              <p className="text-gray-600 mb-8 sm:mb-10 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
                {t('noExcursions')}
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="relative">
            {/* Excursions Carousel */}
            <AnimatedSection animation="fadeIn" delay={400} className="relative">
              {excursions.length > 1 && (
                <button
                  onClick={scrollLeft}
                  className={`absolute top-1/2 left-0 md:-left-4 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg p-3 flex items-center justify-center w-12 h-12 border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110 transform-gpu ${
                    canScrollLeft
                      ? 'opacity-100 visible translate-x-0'
                      : 'opacity-0 invisible -translate-x-2'
                  }`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
              )}

              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 sm:gap-6 lg:gap-8 pb-6 no-scrollbar snap-x scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {excursions.map((excursion, index) => (
                  <div
                    key={excursion.id}
                    className="flex-none w-[280px] sm:w-[320px] lg:w-[360px] snap-start opacity-0 animate-[slideInFromRight_0.6s_ease-out_forwards] hover:-translate-y-2 transition-transform duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <ExcursionCard
                      excursion={excursion}
                      onClick={() => handleExcursionClick(excursion)}
                    />
                  </div>
                ))}
              </div>

              {/* Right Arrow - Solo mostrar si hay más de una excursión */}
              {excursions.length > 1 && (
                <button
                  onClick={scrollRight}
                  className={`absolute top-1/2 right-0 md:-right-4 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg p-3 flex items-center justify-center w-12 h-12 border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-110 transform-gpu ${
                    canScrollRight
                      ? 'opacity-100 visible translate-x-0'
                      : 'opacity-0 invisible translate-x-2'
                  }`}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              )}
            </AnimatedSection>
          </div>
        )}

        {/* Background Decorations */}
        <div className="absolute top-10 right-4 w-20 h-20 bg-primary/10 rounded-full -z-10" />
        <div className="absolute bottom-10 left-4 w-32 h-32 bg-secondary/10 rounded-full -z-10" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full -z-20" />
      </div>

      {/* Modals */}
      {selectedExcursion && (
        <>
          <ExcursionDetailsModal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            excursion={selectedExcursion}
            onBookNow={handleBookNowClick}
          />

          <BookingModal
            isOpen={showBookingModal}
            onClose={handleCloseModals}
            excursion={selectedExcursion}
            onSuccess={handleBookingSuccess}
          />
        </>
      )}
    </section>
  )
}
