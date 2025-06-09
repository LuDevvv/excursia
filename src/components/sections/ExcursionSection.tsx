'use client'

import { useTranslations } from 'next-intl'
import { Excursion } from '@/payload-types'
import { useState, useRef, useEffect } from 'react'
import ExcursionCard from '@/components/ExcursionCard'
import BookingModal from '@/components/modals/BookingModal'
import ExcursionDetailsModal from '@/components/modals/ExcursionDetailsModal'
import { ChevronLeft, ChevronRight, Compass, Plus } from 'lucide-react'
import Link from 'next/link'

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
    <div id="excursions" className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('excursionsTitle')}</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">{t('excursionsSubtitle')}</p>
      </div>

      {/* Empty State */}
      {excursions.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
              <Compass className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your Adventure?</h3>

          <p className="text-gray-600 mb-8 leading-relaxed">
            We&apos;re preparing amazing excursions for you. Our team is currently adding new
            adventures to showcase the best of Dominican Republic. Check back soon for incredible
            experiences!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Excursion
            </Link>

            <button
              className="inline-flex items-center justify-center border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
              onClick={() => window.location.reload()}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 flex justify-center space-x-2 opacity-40">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
        </div>
      ) : (
        // Excursions Grid
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className={`absolute top-1/2 left-0 md:-left-4 -translate-y-1/2 z-10 bg-white/90 rounded-full shadow-md p-2 flex items-center justify-center w-10 h-10 border border-gray-100 hover:bg-gray-50 transition-all duration-300 ${
              canScrollLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-6 no-scrollbar snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {excursions.map((excursion) => (
              <div
                key={excursion.id}
                className="flex-none w-[85%] sm:w-[320px] md:w-[340px] snap-start"
              >
                <ExcursionCard
                  excursion={excursion}
                  onClick={() => handleExcursionClick(excursion)}
                />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className={`absolute top-1/2 right-0 md:-right-4 -translate-y-1/2 z-10 bg-white/90 rounded-full shadow-md p-2 flex items-center justify-center w-10 h-10 border border-gray-100 hover:bg-gray-50 transition-all duration-300 ${
              canScrollRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>
      )}

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
    </div>
  )
}
