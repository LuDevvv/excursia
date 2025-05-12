'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Excursion } from '@/payload-types'
import { Loader2, Check } from 'lucide-react'
import Modal from './Modal'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  excursion: Excursion
  onSuccess: () => void
}

// ya ese quedo bien ahora vamos a mejorar el BookingModal. mejora la UI distribucion de los inputs, usa los iconos de lucide etc.

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

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      setSubmitSuccess(true)

      // Call onSuccess after a delay to show success message
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (error) {
      console.error('Error submitting booking:', error)
      setSubmitError(t('submitError'))
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="md">
      {submitSuccess ? (
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">{t('success')}</h3>
          <p className="text-gray-500 mb-6">{t('successMessage')}</p>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={onClose}
          >
            {t('close')}
          </button>
        </div>
      ) : (
        <form className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {t('personalInfo')}
              </h3>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone')} *
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  {t('next')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {t('bookingDetails')}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adults')} *
                  </label>
                  <input
                    type="number"
                    id="adults"
                    name="adults"
                    min="1"
                    value={formData.adults}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.adults ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.adults && <p className="mt-1 text-sm text-red-600">{errors.adults}</p>}
                </div>

                <div>
                  <label
                    htmlFor="children"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t('children')}
                  </label>
                  <input
                    type="number"
                    id="children"
                    name="children"
                    min="0"
                    value={formData.children}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="arrivalDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t('arrivalDate')} *
                  </label>
                  <input
                    type="date"
                    id="arrivalDate"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.arrivalDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.arrivalDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.arrivalDate}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="arrivalTime"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t('arrivalTime')} *
                  </label>
                  <select
                    id="arrivalTime"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.arrivalTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{t('selectTime')}</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.arrivalTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.arrivalTime}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('additionalInfo')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={t('additionalInfoPlaceholder')}
                ></textarea>
              </div>

              {submitError && (
                <div className="bg-red-50 p-3 rounded text-red-700 text-sm">{submitError}</div>
              )}

              <div className="pt-4 border-t mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                >
                  {t('back')}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-1/2 bg-primary text-white font-medium py-2 px-4 rounded transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin mr-2" />
                      {t('submitting')}
                    </span>
                  ) : (
                    t('submit')
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </Modal>
  )
}
