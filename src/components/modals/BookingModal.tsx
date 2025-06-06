'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Excursion } from '@/payload-types'
import {
  Loader2,
  Check,
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  Clock,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
} from 'lucide-react'
import Modal from './Modal'
import Image from 'next/image'
import BookingSuccess from '../BookingSuccess'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  excursion: Excursion
  onSuccess: () => void
}

export default function BookingModal({ isOpen, onClose, excursion, onSuccess }: BookingModalProps) {
  const t = useTranslations('booking')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    adults: 1,
    children: 0,
    arrivalDate: '',
    arrivalTime: '',
    message: '',
  })

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [emailSent, setEmailSent] = useState(true)

  // Get excursion image
  const excursionImage =
    typeof excursion.image === 'object' && excursion.image?.url
      ? excursion.image.url
      : '/images/placeholder.jpg'

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'adults' || name === 'children' ? parseInt(value) || 0 : value,
    }))

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('fullNameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid')
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('phoneRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (formData.adults < 1) {
      newErrors.adults = t('adultsRequired')
    }

    if (!formData.arrivalDate) {
      newErrors.arrivalDate = t('arrivalDateRequired')
    }

    if (!formData.arrivalTime) {
      newErrors.arrivalTime = t('arrivalTimeRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep2()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          excursion: excursion.id,
          status: 'pending',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle specific error types
        if (result.error?.type === 'VALIDATION_ERROR') {
          setSubmitError('Please check your information and try again.')
        } else if (result.error?.type === 'EXCURSION_NOT_FOUND') {
          setSubmitError('This excursion is no longer available.')
        } else if (result.error?.type === 'EXCURSION_INACTIVE') {
          setSubmitError('This excursion is not currently available for booking.')
        } else {
          setSubmitError(result.error?.message || 'Failed to submit booking. Please try again.')
        }
        return
      }

      if (result.success) {
        setSubmitSuccess(true)
        setEmailSent(result.emailSent)

        // Log email status for debugging
        if (!result.emailSent) {
          console.warn('Booking created but email failed:', result.emailError)
        }

        // Call onSuccess after a delay to show success message
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 3000) // Give more time to read the success message
        }
      } else {
        setSubmitError(result.error?.message || 'Failed to submit booking. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate time options (30 minute intervals)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0')
      const formattedMinute = minute.toString().padStart(2, '0')
      timeOptions.push(`${formattedHour}:${formattedMinute}`)
    }
  }

  const modalTitle = submitSuccess ? t('bookingSuccess') : `${t('bookTitle')} ${excursion.title}`

  // Progress indicators
  const renderProgressSteps = () => (
    <div className="flex items-center justify-center mb-6">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        1
      </div>
      <div className={`h-1 w-12 ${step === 1 ? 'bg-gray-200' : 'bg-primary'}`}></div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        2
      </div>
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="md">
      {submitSuccess ? (
        <BookingSuccess
          excursion={excursion}
          bookingData={formData}
          emailSent={emailSent}
          onClose={onClose}
        />
      ) : (
        <div className="p-6">
          {/* Excursion summary */}
          <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image src={excursionImage} alt={excursion.title} fill className="object-cover" />
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-900">{excursion.title}</h4>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">${excursion.price}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{excursion.duration}</span>
              </div>
            </div>
          </div>

          {renderProgressSteps()}

          <form className="space-y-5">
            {step === 1 ? (
              <div className="space-y-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
                  <User size={18} className="mr-2 text-primary" />
                  {t('personalInfo')}
                </h3>

                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t('fullName')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-primary focus:border-primary`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-primary focus:border-primary`}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')} *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-primary focus:border-primary`}
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="pt-4 mt-8">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {t('next')}
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
                  <Calendar size={18} className="mr-2 text-primary" />
                  {t('bookingDetails')}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="adults"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('adults')} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="adults"
                        name="adults"
                        min="1"
                        value={formData.adults}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${
                          errors.adults ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-primary focus:border-primary`}
                      />
                    </div>
                    {errors.adults && <p className="mt-1 text-sm text-red-600">{errors.adults}</p>}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="children"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('children')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="children"
                        name="children"
                        min="0"
                        value={formData.children}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 border rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="arrivalDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('arrivalDate')} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="arrivalDate"
                        name="arrivalDate"
                        value={formData.arrivalDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg ${
                          errors.arrivalDate ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-primary focus:border-primary`}
                      />
                    </div>
                    {errors.arrivalDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.arrivalDate}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="arrivalTime"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('arrivalTime')} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock size={16} className="text-gray-400" />
                      </div>
                      <select
                        id="arrivalTime"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg appearance-none ${
                          errors.arrivalTime ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-primary focus:border-primary`}
                      >
                        <option value="">{t('selectTime')}</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.arrivalTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.arrivalTime}</p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('additionalInfo')}
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <MessageSquare size={16} className="text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder={t('additionalInfoPlaceholder')}
                    ></textarea>
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 p-4 rounded-lg text-red-700 text-sm">{submitError}</div>
                )}

                <div className="pt-4 mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    {t('back')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center justify-center bg-primary text-white font-medium py-3 px-4 rounded-lg transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        {t('submitting')}
                      </>
                    ) : (
                      <>
                        {t('submit')}
                        <Check size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </Modal>
  )
}
