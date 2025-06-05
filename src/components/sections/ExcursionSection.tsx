'use client'

import { useTranslations } from 'next-intl'
import { Excursion } from '@/payload-types'
import { useState, useRef, useEffect } from 'react'
import ExcursionCard from '@/components/ExcursionCard'
import BookingModal from '@/components/modals/BookingModal'
import ExcursionDetailsModal from '@/components/modals/ExcursionDetailsModal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    if (!scrollContainerRef.current) return

    const checkScrollButtons = () => {
      const container = scrollContainerRef.current
      if (!container) return

      // Check if can scroll left
      setCanScrollLeft(container.scrollLeft > 20)

      // Check if can scroll right
      const maxScrollLeft = container.scrollWidth - container.clientWidth - 20
      setCanScrollRight(container.scrollLeft < maxScrollLeft)
    }

    // Initial check
    checkScrollButtons()

    // Add event listener for scroll
    const container = scrollContainerRef.current
    container.addEventListener('scroll', checkScrollButtons)

    // Add resize observer to check on resize
    const resizeObserver = new ResizeObserver(checkScrollButtons)
    resizeObserver.observe(container)

    // Also check on window resize
    window.addEventListener('resize', checkScrollButtons)

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollButtons)
        resizeObserver.disconnect()
      }
      window.removeEventListener('resize', checkScrollButtons)
    }
  }, [])

  const handleExcursionClick = (excursion: Excursion) => {
    setSelectedExcursion(excursion)
    setShowDetailsModal(true)
  }

  const handleBookNowClick = () => {
    // Close details modal and open booking modal
    setShowDetailsModal(false)
    setTimeout(() => {
      setShowBookingModal(true)
    }, 300)
  }

  const handleBookingSuccess = () => {
    // Close booking modal after successful submission
    setShowBookingModal(false)
    setSelectedExcursion(null)
  }

  const handleCloseModals = () => {
    setShowDetailsModal(false)
    setShowBookingModal(false)
  }

  // Handle scrolling for carousel
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

  // Don't render if no excursions
  if (!excursions.length) return null

  return (
    <div id="excursions" className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('excursionsTitle')}</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">{t('excursionsSubtitle')}</p>
      </div>

      {/* Carousel wrapper - Avoid hover effects on cards from container hover */}
      <div className="relative">
        {/* Left Arrow - Dynamically shown based on scroll position */}
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

        {/* Right Arrow - Dynamically shown based on scroll position */}
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

      {/* Excursion Details Modal */}
      {selectedExcursion && (
        <ExcursionDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          excursion={selectedExcursion}
          onBookNow={handleBookNowClick}
        />
      )}

      {/* Booking Modal */}
      {selectedExcursion && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={handleCloseModals}
          excursion={selectedExcursion}
          onSuccess={handleBookingSuccess}
        />
      )}

      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
