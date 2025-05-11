'use client'

import Image from 'next/image'
import { Excursion } from '@/payload-types'
import { MapPin, Clock, Languages, Car } from 'lucide-react'
import { motion } from 'framer-motion'

interface ExcursionCardProps {
  excursion: Excursion
  onClick: () => void
}

export default function ExcursionCard({ excursion, onClick }: ExcursionCardProps) {
  // Get the image URL safely
  const imageUrl =
    typeof excursion.image === 'object' && excursion.image?.url ? excursion.image.url : ''

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Top with Image */}
      <div className="relative h-64">
        <Image
          src={imageUrl || '/images/placeholder.jpg'}
          alt={excursion.title || 'Excursion'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-primary text-white font-bold py-1 px-3 rounded-full">
          ${excursion.price}
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 text-black py-1 px-3 rounded-full flex items-center space-x-1">
          <MapPin size={16} className="text-primary" />
          <span className="text-sm font-medium truncate max-w-[150px]">{excursion.location}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 truncate">{excursion.title}</h3>

        {/* Card Footer - Basic Info */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-600">
          {excursion.duration && (
            <div className="flex items-center space-x-1">
              <Clock size={16} className="text-primary" />
              <span className="text-sm">{excursion.duration}</span>
            </div>
          )}

          {excursion.languages && excursion.languages.length > 0 && (
            <div className="flex items-center space-x-1">
              <Languages size={16} className="text-primary" />
              <span className="text-sm truncate max-w-[100px]">
                {excursion.languages.map((lang) => lang.language).join(', ')}
              </span>
            </div>
          )}

          {excursion.pickup && (
            <div className="flex items-center space-x-1">
              <Car size={16} className="text-primary" />
              <span className="text-sm">{excursion.pickup}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
