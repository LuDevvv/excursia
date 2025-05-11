'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Excursion } from '@/payload-types'
import { MapPin, Clock, Languages, Car } from 'lucide-react'
import Modal from './Modal'
import { useState } from 'react'

interface ExcursionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  excursion: Excursion
  onBookNow: () => void
}

export default function ExcursionDetailsModal({
  isOpen,
  onClose,
  excursion,
  onBookNow,
}: ExcursionDetailsModalProps) {
  const t = useTranslations('excursion')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Get the main image URL safely
  const mainImageUrl =
    typeof excursion.image === 'object' && excursion.image?.url ? excursion.image.url : ''

  // Handle gallery image click
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  // Close image preview
  const closeImagePreview = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={excursion.title} size="lg">
        <div className="flex flex-col h-full">
          {/* Content area with scroll */}
          <div
            className="flex-grow overflow-y-auto px-6 py-4"
            style={{ maxHeight: 'calc(80vh - 180px)' }}
          >
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
                <Image
                  src={mainImageUrl || '/images/placeholder.jpg'}
                  alt={excursion.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />
              </div>

              {/* Excursion Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin size={20} className="text-primary" />
                  <span>{excursion.location}</span>
                </div>

                {excursion.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock size={20} className="text-primary" />
                    <span>{excursion.duration}</span>
                  </div>
                )}

                {excursion.languages && excursion.languages.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Languages size={20} className="text-primary" />
                    <span>{excursion.languages.map((lang) => lang.language).join(', ')}</span>
                  </div>
                )}

                {excursion.pickup && (
                  <div className="flex items-center space-x-2">
                    <Car size={20} className="text-primary" />
                    <span>{excursion.pickup}</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">{t('price')}</span>
                  <span className="text-2xl font-bold text-primary">${excursion.price}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-bold mb-2">{t('description')}</h4>
                {excursion.description ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: excursion.description }}
                  />
                ) : (
                  <p className="text-gray-600">{t('noDescription')}</p>
                )}
              </div>

              {/* Gallery */}
              {excursion.gallery && excursion.gallery.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold mb-2">{t('gallery')}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {excursion.gallery.map(
                      (item, index) =>
                        typeof item.image === 'object' &&
                        item.image.url && (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => {
                              if (typeof item.image === 'object' && item.image?.url) {
                                handleImageClick(item.image.url)
                              }
                            }}
                          >
                            <Image
                              src={item.image.url}
                              alt={`Gallery image ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with fixed Book Now button */}
          <div className="sticky bottom-0 left-0 right-0 px-6 py-4 bg-white border-t mt-auto">
            <button
              onClick={onBookNow}
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {t('bookNow')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Full Image Preview Modal */}
      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onClose={closeImagePreview}
          showCloseButton={true}
          size="xl"
        >
          <div className="relative h-[80vh]">
            <Image
              src={selectedImage}
              alt="Gallery preview"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </Modal>
      )}
    </>
  )
}
