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

  // Get all images for gallery
  const getAllImages = () => {
    const images: Array<{ url: string; alt: string }> = []

    // Add main image
    if (typeof excursion.image === 'object' && excursion.image?.url) {
      images.push({
        url: excursion.image.url,
        alt: excursion.image.alt || excursion.title,
      })
    }

    // Add gallery images if they exist
    if (excursion.gallery) {
      excursion.gallery.forEach((item) => {
        if (typeof item.image === 'object' && item.image?.url) {
          images.push({
            url: item.image.url,
            alt: item.caption || item.image.alt || `${excursion.title} - gallery image`,
          })
        }
      })
    }

    return images
  }

  const allImages = getAllImages()

  // Format languages with translations
  const formatLanguages = () => {
    if (excursion.languages && excursion.languages.length > 0) {
      return excursion.languages
        .map((lang) => {
          if (typeof lang.language === 'string') {
            const langName = t(`languages.${lang.language}`)
            const level =
              lang.level && lang.level !== 'fluent' ? ` (${t(`languageLevels.${lang.level}`)})` : ''
            return langName + level
          }
          return ''
        })
        .filter(Boolean)
        .join(', ')
    }
    return null
  }

  // Format price
  const formatPrice = () => `$${excursion.price}`

  // Format pickup info with translations
  const getPickupInfo = () => {
    if (!excursion.pickup) return null

    switch (excursion.pickup.included) {
      case 'included':
        return excursion.pickup.pickupNote || t('pickupIncluded')
      case 'extra-cost':
        return excursion.pickup.pickupNote || t('pickupExtraCost')
      case 'meet-location':
        return excursion.pickup.meetingPoint || t('pickupMeetLocation')
      default:
        return null
    }
  }

  // Get description text
  const getDescriptionHTML = () => {
    if (!excursion.description) return `<p>${t('noDescription')}</p>`

    try {
      // For rich text content, we need to render it properly
      if (excursion.description.root?.children) {
        const extractText = (
          children: Array<{ type: string; children?: Array<{ text?: string }> }>,
        ): string => {
          return children
            .map((child) => {
              if (child.type === 'paragraph' && child.children) {
                const text = child.children.map((textNode) => textNode.text || '').join('')
                return `<p>${text}</p>`
              }
              return ''
            })
            .join('')
        }

        return extractText(excursion.description.root.children)
      }
    } catch (e) {
      console.warn('Error parsing description:', e)
    }

    return `<p>${t('noDescription')}</p>`
  }

  // Handle image clicks
  const handleMainImageClick = () => {
    if (allImages.length > 0) {
      setGalleryInitialIndex(0)
      setShowGallery(true)
    }
  }

  const handleGalleryImageClick = (index: number) => {
    setGalleryInitialIndex(index + 1) // +1 because featured image is at index 0
    setShowGallery(true)
  }

  const mainImage = allImages[0]
  const galleryImages = allImages.slice(1)
  const pickupInfo = getPickupInfo()
  const languages = formatLanguages()

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
              {/* Main Image */}
              {mainImage && (
                <div
                  className="relative h-72 sm:h-96 rounded-lg overflow-hidden bg-gray-50 group cursor-pointer"
                  onClick={handleMainImageClick}
                >
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-secondary text-white px-4 py-2 rounded-full font-bold shadow-lg text-lg">
                    {formatPrice()}
                  </div>
                </div>
              )}

              {/* Info Panel */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm text-gray-500 mb-1">{t('location')}</div>
                      <div className="text-lg">{excursion.location}</div>
                    </div>
                  </div>

                  {excursion.duration && (
                    <div className="flex items-start space-x-3">
                      <Clock size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">
                          {t('duration')}
                        </div>
                        <div className="text-lg">{excursion.duration}</div>
                      </div>
                    </div>
                  )}

                  {languages && (
                    <div className="flex items-start space-x-3">
                      <Languages size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">
                          {t('languagesLabel')}
                        </div>
                        <div>{languages}</div>
                      </div>
                    </div>
                  )}

                  {pickupInfo && (
                    <div className="flex items-start space-x-3">
                      <Car size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">{t('pickup')}</div>
                        <div>{pickupInfo}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xl font-bold mb-4 text-gray-800">{t('description')}</h4>
                <div
                  className="prose max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: getDescriptionHTML() }}
                />
              </div>

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <div>
                  <h4 className="text-xl font-bold mb-4 text-gray-800">{t('gallery')}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => handleGalleryImageClick(index)}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
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
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-colors shadow-sm text-base uppercase tracking-wide"
            >
              {t('bookNow')} - {formatPrice()}
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
