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

  // Extract image URL - ensure it's always a string
  const imageUrl =
    typeof excursion.image === 'object' && excursion.image?.url
      ? excursion.image.url
      : '/images/placeholder.jpg' // Fallback image

  // Count languages
  const languageCount = excursion.languages?.length || 0

  // Safely extract description text
  const descriptionText = (): string => {
    try {
      if (
        excursion.description &&
        excursion.description.root &&
        excursion.description.root.children &&
        Array.isArray(excursion.description.root.children) &&
        excursion.description.root.children.length > 0 &&
        excursion.description.root.children[0] &&
        excursion.description.root.children[0].children &&
        Array.isArray(excursion.description.root.children[0].children) &&
        excursion.description.root.children[0].children.length > 0 &&
        excursion.description.root.children[0].children[0] &&
        'text' in excursion.description.root.children[0].children[0] &&
        typeof excursion.description.root.children[0].children[0].text === 'string'
      ) {
        return excursion.description.root.children[0].children[0].text
      }
      return ''
    } catch (e) {
      return ''
    }
  }

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={imageUrl}
          alt={
            typeof excursion.image === 'object' && excursion.image?.alt
              ? excursion.image.alt
              : excursion.title
          }
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-[#fdaa33] text-white px-2.5 py-1 rounded-md text-sm font-medium">
          ${excursion.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800">{excursion.title}</h3>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-1.5 text-primary" />
            <span className="truncate">{excursion.location}</span>
          </div>

          {/* Duration */}
          {excursion.duration && (
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-1.5 text-primary" />
              <span className="truncate">{excursion.duration}</span>
            </div>
          )}

          {/* Languages - Only show if there's space */}
          {languageCount > 0 && (
            <div className="flex items-center text-gray-600 col-span-2">
              <Languages size={14} className="mr-1.5 text-primary" />
              <span className="truncate">
                {languageCount} {languageCount === 1 ? 'Language' : 'Languages'}
              </span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
          {descriptionText()}
        </p>

        {/* Call to Action - More subtle */}
        <div className="pt-2 border-t border-gray-100">
          <button className="w-full text-primary font-medium py-1.5 hover:text-primary-dark transition-colors text-center">
            {t('viewDetails')}
          </button>
        </div>
      </div>
    </div>
  )
}
