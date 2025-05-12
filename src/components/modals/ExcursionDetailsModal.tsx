'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Excursion } from '@/payload-types'
import { MapPin, Clock, Languages, Car } from 'lucide-react'
import Modal from './Modal'
import { useState } from 'react'
import ImageGallery from '../ImageGallery'

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
  const [showGallery, setShowGallery] = useState(false)
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0)

  // Get all images (main + gallery)
  const mainImage =
    typeof excursion.image === 'object' && excursion.image?.url
      ? { url: excursion.image.url, alt: excursion.image.alt || excursion.title }
      : null

  const galleryImages =
    excursion.gallery
      ?.filter((item) => typeof item.image === 'object' && item.image?.url)
      .map((item) => {
        const img = item.image as any
        return { url: img.url, alt: img.alt || `${excursion.title} - gallery image` }
      }) || []

  const allImages = mainImage ? [mainImage, ...galleryImages] : galleryImages

  // Handle main image click
  const handleMainImageClick = () => {
    if (allImages.length > 0) {
      setGalleryInitialIndex(0)
      setShowGallery(true)
    }
  }

  // Handle gallery thumbnail click
  const handleThumbnailClick = (index: number) => {
    setGalleryInitialIndex(index + 1) // +1 because main image is at index 0
    setShowGallery(true)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={excursion.title} size="lg">
        <div className="flex flex-col h-full">
          {/* Content area with scroll */}
          <div
            className="flex-grow overflow-y-auto px-6 py-4"
            style={{ maxHeight: 'calc(80vh - 160px)' }}
          >
            <div className="space-y-8">
              {/* Main Image with badge */}
              <div
                className="relative h-72 sm:h-96 rounded-lg overflow-hidden bg-gray-50 group cursor-pointer"
                onClick={handleMainImageClick}
              >
                <Image
                  src={mainImage?.url || '/images/placeholder.jpg'}
                  alt={excursion.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1.5 rounded-full font-bold shadow text-sm">
                  ${excursion.price}
                </div>
              </div>

              {/* Info Panel */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm text-gray-500 mb-0.5">Location</div>
                      <div>{excursion.location}</div>
                    </div>
                  </div>

                  {excursion.duration && (
                    <div className="flex items-start space-x-3">
                      <Clock size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-0.5">Duration</div>
                        <div>{excursion.duration}</div>
                      </div>
                    </div>
                  )}

                  {excursion.languages && excursion.languages.length > 0 && (
                    <div className="flex items-start space-x-3">
                      <Languages size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-0.5">Languages</div>
                        <div>{excursion.languages.map((lang) => lang.language).join(', ')}</div>
                      </div>
                    </div>
                  )}

                  {excursion.pickup && (
                    <div className="flex items-start space-x-3">
                      <Car size={18} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-0.5">Transport</div>
                        <div>{excursion.pickup}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xl font-bold mb-3 text-gray-800">{t('description')}</h4>
                {excursion.description ? (
                  <div className="prose max-w-none text-gray-600">
                    {typeof excursion.description === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: excursion.description }} />
                    ) : (
                      // Handle structured content
                      <p>
                        {excursion.description?.root?.children &&
                        Array.isArray(excursion.description.root.children) &&
                        excursion.description.root.children.length > 0 &&
                        excursion.description.root.children[0]?.children &&
                        Array.isArray(excursion.description.root.children[0].children) &&
                        excursion.description.root.children[0].children.length > 0 &&
                        'text' in excursion.description.root.children[0].children[0]
                          ? excursion.description.root.children[0].children[0].text
                          : t('noDescription')}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">{t('noDescription')}</p>
                )}
              </div>

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold mb-3 text-gray-800">{t('gallery')}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || `Gallery image ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with Book Now button */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 mt-auto sticky bottom-0">
            <button
              onClick={onBookNow}
              className="w-full bg-amber-500 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-sm text-base uppercase tracking-wide"
            >
              {t('bookNow')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Image Gallery Modal */}
      <Modal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        showCloseButton={false}
        size="xl"
        className="bg-black/90 backdrop-blur-xl"
        showOverlay={false}
      >
        <div className="h-[85vh]">
          <ImageGallery
            images={allImages}
            initialIndex={galleryInitialIndex}
            onClose={() => setShowGallery(false)}
          />
        </div>
      </Modal>
    </>
  )
}
