'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Excursion } from '@/payload-types'
import {
  MapPin,
  Clock,
  Languages,
  Car,
  Users,
  Calendar,
  Check,
  X,
  Star,
  AlertCircle,
} from 'lucide-react'
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

  // Get all images for gallery - using existing structure
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
      excursion.gallery.forEach((item: any) => {
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

  // Format duration - checking for both string and object types
  const formatDuration = () => {
    // If duration is a string (legacy)
    if (typeof excursion.duration === 'string') {
      return excursion.duration
    }

    // If duration is an object with new structure
    if (excursion.duration && typeof excursion.duration === 'object') {
      const durationObj = excursion.duration as any
      if (durationObj.display) {
        return durationObj.display
      }
      if (durationObj.hours || durationObj.minutes) {
        const hours = durationObj.hours || 0
        const minutes = durationObj.minutes || 0
        if (hours > 0 && minutes > 0) {
          return `${hours} hours ${minutes} minutes`
        } else if (hours > 0) {
          return `${hours} hour${hours > 1 ? 's' : ''}`
        } else if (minutes > 0) {
          return `${minutes} minutes`
        }
      }
    }

    return null
  }

  // Format languages
  const formatLanguages = () => {
    if (excursion.languages && excursion.languages.length > 0) {
      return excursion.languages
        .map((lang) => {
          const langName =
            typeof lang.language === 'string'
              ? lang.language.charAt(0).toUpperCase() + lang.language.slice(1)
              : lang.language || ''

          // Check if level exists in the object
          const level =
            (lang as any).level && (lang as any).level !== 'fluent'
              ? ` (${(lang as any).level})`
              : ''

          return langName + level
        })
        .join(', ')
    }
    return null
  }

  // Format price
  const formatPrice = () => {
    const priceInfo = (excursion as any).priceInfo
    const currency = priceInfo?.currency || 'USD'
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '$'
    return `${symbol}${excursion.price}`
  }

  // Format transportation
  const getTransportationText = () => {
    const transportation = (excursion as any).transportation
    if (!transportation?.pickup) return null

    switch (transportation.pickup) {
      case 'included':
        return transportation.pickupNote || 'Hotel pickup included'
      case 'extra-cost':
        return transportation.pickupNote || 'Hotel pickup available (additional cost)'
      case 'meet-location':
        return transportation.meetingPoint || 'Meet at designated location'
      default:
        return null
    }
  }

  // Format schedule
  const getScheduleInfo = () => {
    const schedule = (excursion as any).schedule
    if (!schedule) return null

    const parts = []
    if (schedule.departureTime) parts.push(`Departure: ${schedule.departureTime}`)
    if (schedule.returnTime) parts.push(`Return: ${schedule.returnTime}`)

    return parts.join(' • ')
  }

  // Get description text
  const getDescriptionHTML = () => {
    if (!excursion.description) return '<p>No description available.</p>'

    try {
      // For rich text content, we need to render it properly
      // This is a simplified version - you might want to use a proper rich text renderer
      if (excursion.description.root?.children) {
        const extractText = (children: any[]): string => {
          return children
            .map((child) => {
              if (child.type === 'paragraph' && child.children) {
                const text = child.children.map((textNode: any) => textNode.text || '').join('')
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

    return '<p>No description available.</p>'
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

  // Get additional data with type checking
  const isFeatured = (excursion as any).featured
  const isPopular = (excursion as any).popular
  const capacity = (excursion as any).capacity
  const inclusions = (excursion as any).inclusions
  const requirements = (excursion as any).requirements

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

                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {isFeatured && (
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        Featured
                      </div>
                    )}
                    {isPopular && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center">
                        <Star size={14} className="mr-1" />
                        Popular
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Info Panel */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm text-gray-500 mb-1">Location</div>
                      <div className="text-lg">{excursion.location}</div>
                    </div>
                  </div>

                  {formatDuration() && (
                    <div className="flex items-start space-x-3">
                      <Clock size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Duration</div>
                        <div className="text-lg">{formatDuration()}</div>
                      </div>
                    </div>
                  )}

                  {formatLanguages() && (
                    <div className="flex items-start space-x-3">
                      <Languages size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Languages</div>
                        <div>{formatLanguages()}</div>
                      </div>
                    </div>
                  )}

                  {getTransportationText() && (
                    <div className="flex items-start space-x-3">
                      <Car size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Transportation</div>
                        <div>{getTransportationText()}</div>
                      </div>
                    </div>
                  )}

                  {capacity && (
                    <div className="flex items-start space-x-3">
                      <Users size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Capacity</div>
                        <div>
                          {capacity.minGuests && capacity.maxGuests
                            ? `${capacity.minGuests}-${capacity.maxGuests} guests`
                            : capacity.maxGuests
                              ? `Up to ${capacity.maxGuests} guests`
                              : `Min ${capacity.minGuests} guests`}
                        </div>
                      </div>
                    </div>
                  )}

                  {getScheduleInfo() && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <Calendar size={20} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm text-gray-500 mb-1">Schedule</div>
                        <div>{getScheduleInfo()}</div>
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

              {/* Inclusions */}
              {(inclusions?.included?.length || inclusions?.notIncluded?.length) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inclusions.included && inclusions.included.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                        <Check size={18} className="mr-2" />
                        What's Included
                      </h5>
                      <ul className="space-y-2">
                        {inclusions.included.map((item: any, index: number) => (
                          <li key={index} className="text-green-700 flex items-start">
                            <Check size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                            {item.item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {inclusions.notIncluded && inclusions.notIncluded.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-3 flex items-center">
                        <X size={18} className="mr-2" />
                        Not Included
                      </h5>
                      <ul className="space-y-2">
                        {inclusions.notIncluded.map((item: any, index: number) => (
                          <li key={index} className="text-red-700 flex items-start">
                            <X size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                            {item.item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Requirements */}
              {requirements && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-800 mb-3 flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    Important Information
                  </h5>
                  <div className="space-y-3 text-amber-700">
                    {requirements.fitnessLevel && (
                      <div>
                        <strong>Fitness Level:</strong>{' '}
                        {requirements.fitnessLevel.replace('-', ' ')}
                      </div>
                    )}

                    {(requirements.ageRestriction?.minAge ||
                      requirements.ageRestriction?.maxAge) && (
                      <div>
                        <strong>Age Requirement:</strong>{' '}
                        {requirements.ageRestriction.minAge && requirements.ageRestriction.maxAge
                          ? `${requirements.ageRestriction.minAge}-${requirements.ageRestriction.maxAge} years`
                          : requirements.ageRestriction.minAge
                            ? `Minimum ${requirements.ageRestriction.minAge} years`
                            : `Maximum ${requirements.ageRestriction.maxAge} years`}
                      </div>
                    )}

                    {requirements.whatToBring && requirements.whatToBring.length > 0 && (
                      <div>
                        <strong>What to Bring:</strong>{' '}
                        {requirements.whatToBring.map((item: any) => item.item).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
