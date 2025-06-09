'use client'

import Image from 'next/image'
import { Excursion } from '@/payload-types'
import { Clock, MapPin, Languages } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ExcursionCardProps {
  excursion: Excursion
  onClick: () => void
}

export default function ExcursionCard({ excursion, onClick }: ExcursionCardProps) {
  const t = useTranslations('homepage')
  const tExcursion = useTranslations('excursion')

  // Extract image URL
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

  // Format languages with translations
  const formatLanguages = () => {
    if (excursion.languages && excursion.languages.length > 0) {
      const languageNames = excursion.languages
        .map((lang) => {
          if (typeof lang.language === 'string') {
            const langName = tExcursion(`languages.${lang.language}`)
            const level =
              lang.level && lang.level !== 'fluent'
                ? ` (${tExcursion(`languageLevels.${lang.level}`)})`
                : ''
            return langName + level
          }
          return ''
        })
        .filter(Boolean)

      if (languageNames.length === 1) {
        return languageNames[0]
      } else if (languageNames.length === 2) {
        return languageNames.join(' & ')
      } else if (languageNames.length > 2) {
        return `${languageNames.length} ${tExcursion('languages')}`
      }
    }
    return null
  }

  // Get short description
  const getShortDescription = () => {
    if (excursion.shortDescription) {
      return excursion.shortDescription
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

  // Format price
  const formatPrice = () => `$${excursion.price}`

  const imageUrl = getImageUrl()
  const imageAlt = getImageAlt()
  const languages = formatLanguages()
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
          {excursion.duration && (
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-1.5 text-primary flex-shrink-0" />
              <span className="truncate">{excursion.duration}</span>
            </div>
          )}

          {/* Languages */}
          {languages && (
            <div className="flex items-center text-gray-600 col-span-2">
              <Languages size={14} className="mr-1.5 text-primary flex-shrink-0" />
              <span className="truncate">{languages}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{description}</p>

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
