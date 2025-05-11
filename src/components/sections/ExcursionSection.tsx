'use client'

import { useTranslations } from 'next-intl'
import { Excursion } from '@/payload-types'
import { useState } from 'react'
import ExcursionCard from '@/components/ExcursionCard'
import BookingModal from '@/components/modals/BookingModal'
import ExcursionDetailsModal from '@/components/modals/ExcursionDetailsModal'

interface ExcursionSectionProps {
  excursions: Excursion[]
}

export default function ExcursionSection({ excursions }: ExcursionSectionProps) {
  const t = useTranslations('homepage')
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const handleExcursionClick = (excursion: Excursion) => {
    setSelectedExcursion(excursion)
    setShowDetailsModal(true)
  }

  const handleBookNowClick = () => {
    // Close details modal and open booking modal
    setShowDetailsModal(false)
    setTimeout(() => {
      setShowBookingModal(true)
    }, 300) // Small delay to allow animation to complete
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

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-4">{t('excursionsTitle')}</h2>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">{t('excursionsSubtitle')}</p>

      {excursions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {excursions.map((excursion) => (
            <ExcursionCard
              key={excursion.id}
              excursion={excursion}
              onClick={() => handleExcursionClick(excursion)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('noExcursions')}</p>
        </div>
      )}

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
    </div>
  )
}
