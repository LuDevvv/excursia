'use client'

import { useTranslations } from 'next-intl'
import { BadgeCheck, Mail, Phone, Calendar, MapPin, Clock } from 'lucide-react'
import { Excursion } from '@/payload-types'
import Image from 'next/image'

interface BookingSuccessProps {
  excursion: Excursion
  bookingData: {
    fullName: string
    email: string
    phone: string
    adults: number
    children: number
    arrivalDate: string
    arrivalTime: string
  }
  emailSent?: boolean
  onClose: () => void
}

export default function BookingSuccess({
  excursion,
  bookingData,
  emailSent = true,
  onClose,
}: BookingSuccessProps) {
  const t = useTranslations('booking')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)

    if (hourNum === 0) {
      return `12:${minute} AM`
    } else if (hourNum < 12) {
      return `${hourNum}:${minute} AM`
    } else if (hourNum === 12) {
      return `12:${minute} PM`
    } else {
      return `${hourNum - 12}:${minute} PM`
    }
  }

  const excursionImage =
    typeof excursion.image === 'object' && excursion.image?.url
      ? excursion.image.url
      : '/images/placeholder.jpg'

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Success Icon */}
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <BadgeCheck size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('success')}</h3>
        <p className="text-gray-600 text-sm">{t('successMessage')}</p>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={excursionImage} alt={excursion.title} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{excursion.title}</h4>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              <span className="truncate">{excursion.location}</span>
            </div>
            <div className="text-blue-600 font-bold text-lg mt-1">${excursion.price}</div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Guest:</span>
            <span className="font-medium">{bookingData.fullName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(bookingData.arrivalDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{formatTime(bookingData.arrivalTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">
              {bookingData.adults} adults
              {bookingData.children > 0 ? `, ${bookingData.children} children` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Email Status */}
      <div
        className={`p-4 rounded-lg mb-6 ${
          emailSent
            ? 'bg-green-50 border border-green-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}
      >
        <div className="flex items-start space-x-3">
          <Mail size={20} className={emailSent ? 'text-green-600' : 'text-yellow-600'} />
          <div>
            <h5 className={`font-medium ${emailSent ? 'text-green-800' : 'text-yellow-800'}`}>
              {emailSent ? 'Confirmation Email Sent!' : 'Booking Confirmed'}
            </h5>
            <p className={`text-sm mt-1 ${emailSent ? 'text-green-700' : 'text-yellow-700'}`}>
              {emailSent
                ? `A detailed confirmation has been sent to ${bookingData.email}`
                : 'Your booking is confirmed. You will receive an email confirmation shortly.'}
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h5 className="font-medium text-gray-900 mb-3">What happens next?</h5>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span>We'll contact you within 2 hours to confirm details</span>
          </li>
          <li className="flex items-start">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span>Pickup location and exact time will be provided</span>
          </li>
          <li className="flex items-start">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span>Please arrive 15 minutes before scheduled time</span>
          </li>
        </ul>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h5 className="font-medium text-blue-900 mb-3">Need to contact us?</h5>
        <div className="space-y-2">
          <div className="flex items-center text-blue-800 text-sm">
            <Phone size={14} className="mr-2" />
            <a href="tel:+18095551234" className="hover:underline">
              +1 (809) 555-1234
            </a>
          </div>
          <div className="flex items-center text-blue-800 text-sm">
            <Mail size={14} className="mr-2" />
            <a href="mailto:info@excursia.com" className="hover:underline">
              info@excursia.com
            </a>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        {t('close')}
      </button>
    </div>
  )
}
