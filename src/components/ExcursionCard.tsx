'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Excursion } from '@/payload-types'
import { MapPin, Clock, Languages, Car } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import BookingForm from './BookingForm'

interface ExcursionCardProps {
  excursion: Excursion
}

export default function ExcursionCard({ excursion }: ExcursionCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Get the image URL safely
  const imageUrl = typeof excursion.image === 'object' ? excursion.image.url : ''

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
        onClick={() => setShowDetailsModal(true)}
      >
        {/* Card Top with Image */}
        <div className="relative h-64">
          <Image
            src={imageUrl || ''}
            alt={excursion.title || 'Excursion'}
            fill
            className="object-cover"
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
                  {excursion.languages.map((lang: any) => lang.language).join(', ')}
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
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={excursion.title || 'Excursion Details'}
      >
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src={imageUrl || ''}
              alt={excursion.title || 'Excursion'}
              fill
              className="object-cover"
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
                <span>{excursion.languages.map((lang: any) => lang.language).join(', ')}</span>
              </div>
            )}

            {excursion.pickup && (
              <div className="flex items-center space-x-2">
                <Car size={20} className="text-primary" />
                <span>{excursion.pickup}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-bold mb-2">Description</h4>
            {excursion.description ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: excursion.description }}
              />
            ) : (
              <p className="text-gray-600">No description available.</p>
            )}
          </div>

          {/* Gallery */}
          {excursion.gallery && excursion.gallery.length > 0 && (
            <div>
              <h4 className="text-lg font-bold mb-2">Gallery</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {excursion.gallery.map(
                  (item: any, index: number) =>
                    typeof item.image === 'object' &&
                    item.image.url && (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={item.image.url}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Book Now Button */}
        <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 bg-white border-t mt-6">
          <button
            onClick={() => {
              setShowDetailsModal(false)
              setShowBookingModal(true)
            }}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Book Now
          </button>
        </div>
      </Modal>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title={`Book ${excursion.title}`}
      >
        <BookingForm excursion={excursion} onSuccess={() => setShowBookingModal(false)} />
      </Modal>
    </>
  )
}
