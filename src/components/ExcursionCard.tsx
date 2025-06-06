'use client'

import Image from 'next/image'
import { Excursion } from '@/payload-types'
import { Clock, MapPin, Languages, Users, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ExcursionCardProps {
  excursion: Excursion
  onClick: () => void
}

export default function ExcursionCard({ excursion, onClick }: ExcursionCardProps) {
  const t = useTranslations('homepage')

  // Extract image URL - using existing 'image' field
  const getImageUrl = () => {
    if (typeof excursion.image === 'object' && excursion.image?.url) {
      return excursion.image.url
    }
    return '/images/placeholder.jpg'
  }

  // Extract image alt text
  const getImageAlt = () => {
    if (typeof excursion.image === 'object' && excursion.image?.alt) {
      return excursion.image.alt
    }
    return excursion.title
  }

  // Format duration - checking for both string and object types
  const formatDuration = () => {
    // If duration is a string (legacy)
    if (typeof excursion.duration === 'string') {
      return excursion.duration
    }
    
    // If duration is an object with new structure (if types are generated)
    if (excursion.duration && typeof excursion.duration === 'object') {
      const durationObj = excursion.duration as any
      if (durationObj.display) {
        return durationObj.display
      }
      if (durationObj.hours || durationObj.minutes) {
        const hours = durationObj.hours || 0
        const minutes = durationObj.minutes || 0
        if (hours > 0 && minutes > 0) {
          return `${hours}h ${minutes}m`
        } else if (hours > 0) {
          return `${hours} hour${hours > 1 ? 's' : ''}`
        } else if (minutes > 0) {
          return `${minutes} min`
        }
      }
    }
    
    return null
  }

  // Format languages
  const formatLanguages = () => {
    if (excursion.languages && excursion.languages.length > 0) {
      const languageNames = excursion.languages.map(lang => {
        if (typeof lang.language === 'string') {
          return lang.language.charAt(0).toUpperCase() + lang.language.slice(1)
        }
        return lang.language || ''
      }).filter(Boolean)
      
      if (languageNames.length === 1) {
        return languageNames[0]
      } else if (languageNames.length === 2) {
        return languageNames.join(' & ')
      } else if (languageNames.length > 2) {
        return `${languageNames.length} languages`
      }
    }
    return null
  }

  // Get capacity info - checking if field exists in types
  const getCapacityInfo = () => {
    // Check if capacity field exists (will be available after types are regenerated)
    const capacity = (excursion as any).capacity
    if (capacity?.maxGuests) {
      return `Up to ${capacity.maxGuests} guests`
    }
    return null
  }

  // Get short description - checking if field exists
  const getShortDescription = () => {
    // Check if shortDescription field exists (will be available after types are regenerated)
    const shortDescription = (excursion as any).shortDescription
    if (shortDescription) {
      return shortDescription
    }
    
    // Try to extract from rich text description
    if (excursion.description) {
      try {
        if (
          excursion.description.root &&
          excursion.description.root.children &&
          Array.isArray(excursion.description.root.children) &&
          excursion.description.root.children.length > 0 &&
          excursion.description.root.children[0] &&
          excursion.description.root.children[0].children &&
          Array.isArray(excursion.description.root.children[0].children) &&
          excursion.description.root.children[0].children.length > 0 &&
          'text' in excursion.description.root.children[0].children[0] &&
          typeof excursion.description.root.children[0].children[0].text === 'string'
        ) {
          const text = excursion.description.root.children[0].children[0].text
          return text.length > 150 ? text.substring(0, 150) + '...' : text
        }
      } catch (e) {
        console.warn('Error extracting description:', e)
      }
    }
    
    return 'Discover an amazing experience in the Dominican Republic.'
  }

  // Format price with currency - checking if priceInfo exists
  const formatPrice = () => {
    const priceInfo = (excursion as any).priceInfo
    const currency = priceInfo?.currency || 'USD'
    const symbol = currency === 'USD' ? ' : currency === 'EUR' ? '€' : '
    return `${symbol}${excursion.price}`
  }

  // Check if excursion is featured or popular
  const isFeatured = (excursion as any).featured
  const isPopular = (excursion as any).popular
  const category = (excursion as any).category
  const transportation = (excursion as any).transportation

  const imageUrl = getImageUrl()
  const imageAlt = getImageAlt()
  const duration = formatDuration()
  const languages = formatLanguages()
  const capacity = getCapacityInfo()
  const description = getShortDescription()

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full cursor-pointer border border-gray-100 hover:border-gray-200"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
          {formatPrice()}
        </div>

        {/* Featured/Popular Badges */}
        <div className="absolute top-3 left-3 space-y-1">
          {isFeatured && (
            <div className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-md">
              Featured
            </div>
          )}
          {isPopular && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-md flex items-center">
              <Star size={12} className="mr-1" />
              Popular
            </div>
          )}
        </div>

        {/* Category Badge */}
        {category && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
            {category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-3 text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
          {excursion.title}
        </h3>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-1.5 text-primary flex-shrink-0" />
            <span className="truncate">{excursion.location}</span>
          </div>

          {/* Duration */}
          {duration && (
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-1.5 text-primary flex-shrink-0" />
              <span className="truncate">{duration}</span>
            </div>
          )}

          {/* Languages */}
          {languages && (
            <div className="flex items-center text-gray-600 col-span-2">
              <Languages size={14} className="mr-1.5 text-primary flex-shrink-0" />
              <span className="truncate">{languages}</span>
            </div>
          )}

          {/* Capacity */}
          {capacity && (
            <div className="flex items-center text-gray-600 col-span-2">
              <Users size={14} className="mr-1.5 text-primary flex-shrink-0" />
              <span className="truncate">{capacity}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Transportation Info */}
        {transportation?.pickup && (
          <div className="mb-4">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              transportation.pickup === 'included' 
                ? 'bg-green-100 text-green-800' 
                : transportation.pickup === 'extra-cost'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {transportation.pickup === 'included' 
                ? 'Hotel pickup included'
                : transportation.pickup === 'extra-cost'
                ? 'Hotel pickup available'
                : 'Meet at location'
              }
            </span>
          </div>
        )}

        {/* Call to Action */}
        <div className="pt-3 border-t border-gray-100">
          <button className="w-full text-primary font-semibold py-2 hover:text-primary-dark hover:bg-blue-50 transition-all text-center rounded-md">
            {t('viewDetails')}
          </button>
        </div>
      </div>
    </div>
  )
}