'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Excursion } from '@/payload-types'
import {
  User,
  Mail,
  Phone,
  Users,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import Modal from './Modal'
import Image from 'next/image'
import BookingSuccess from '../BookingSuccess'
import CalendarInput from '../CalendarInput'
import TimePicker from '../TimePicker'
import { ClientBookingSchema } from '@/lib/types/booking'
import { z } from 'zod'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  excursion: Excursion
  onSuccess: () => void
}

type FormData = {
  fullName: string
  email: string
  phone: string
  adults: number
  children: number
  arrivalDate: Date | null
  arrivalTime: string
  message: string
}

export default function BookingModal({ isOpen, onClose, excursion, onSuccess }: BookingModalProps) {
  const t = useTranslations('booking')
  const locale = useLocale()

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    adults: 1,
    children: 0,
    arrivalDate: null,
    arrivalTime: '',
    message: '',
  })

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [emailSent, setEmailSent] = useState(true)

  const excursionImage =
    typeof excursion.image === 'object' && excursion.image?.url
      ? excursion.image.url
      : '/images/placeholder.jpg'

  const handleInputChange = (field: keyof FormData, value: string | number | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep1 = () => {
    try {
      ClientBookingSchema.pick({
        fullName: true,
        email: true,
        phone: true,
      }).parse({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const validateStep2 = () => {
    try {
      const dateString = formData.arrivalDate
        ? formData.arrivalDate.toISOString().split('T')[0]
        : ''

      ClientBookingSchema.pick({
        adults: true,
        children: true,
        arrivalDate: true,
        arrivalTime: true,
        message: true,
      }).parse({
        adults: formData.adults,
        children: formData.children,
        arrivalDate: dateString,
        arrivalTime: formData.arrivalTime,
        message: formData.message,
      })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            const field = err.path[0] as string
            if (field === 'arrivalDate' && !formData.arrivalDate) {
              newErrors[field] = t('arrivalDateRequired')
            } else {
              newErrors[field] = err.message
            }
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const submissionData = {
        ...formData,
        arrivalDate: formData.arrivalDate?.toISOString().split('T')[0] || '',
        excursion: excursion.id,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (!response.ok) {
        setSubmitError(result.error?.message || t('submitError'))
        return
      }

      if (result.success) {
        setSubmitSuccess(true)
        setEmailSent(result.emailSent)

        if (onSuccess) {
          setTimeout(() => onSuccess(), 3000)
        }
      } else {
        setSubmitError(result.error?.message || t('submitError'))
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      setSubmitError(t('submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateForAPI = (date: Date | null): string => {
    return date ? date.toISOString().split('T')[0] : ''
  }

  const modalTitle = submitSuccess ? t('bookingSuccess') : t('title')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="md">
      {submitSuccess ? (
        <BookingSuccess
          excursion={excursion}
          bookingData={{
            ...formData,
            arrivalDate: formatDateForAPI(formData.arrivalDate),
          }}
          emailSent={emailSent}
          onClose={onClose}
        />
      ) : (
        <div className="max-h-[85vh] flex flex-col">
          {/* Compact Header */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={excursionImage} alt={excursion.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{excursion.title}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="truncate">{excursion.location}</span>
                  <span className="mx-1">•</span>
                  <span className="font-semibold text-primary">${excursion.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex-shrink-0 px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <div className={`h-0.5 w-12 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                    <User size={18} className="text-primary" />
                    {t('personalInfo')}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('fullName')} *
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm ${
                          errors.fullName
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('email')} *
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm ${
                          errors.email
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                        placeholder="email@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('phone')} *
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm ${
                          errors.phone
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        }`}
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                    <Users size={18} className="text-primary" />
                    {t('bookingDetails')}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('adults')} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.adults}
                      onChange={(e) => handleInputChange('adults', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm ${
                        errors.adults ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.adults && <p className="mt-1 text-xs text-red-600">{errors.adults}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('children')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData.children}
                      onChange={(e) => handleInputChange('children', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('arrivalDate')} *
                  </label>
                  <CalendarInput
                    value={formData.arrivalDate}
                    onChange={(date) => handleInputChange('arrivalDate', date)}
                    locale={locale}
                    placeholder={t('arrivalDateRequired')}
                    error={errors.arrivalDate}
                  />
                  {errors.arrivalDate && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {errors.arrivalDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('arrivalTime')} *
                  </label>
                  <TimePicker
                    value={formData.arrivalTime}
                    onChange={(time) => handleInputChange('arrivalTime', time)}
                    locale={locale}
                    placeholder={t('selectTime')}
                  />
                  {errors.arrivalTime && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {errors.arrivalTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('additionalInfo')}
                  </label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute top-3 left-3 text-gray-400" />
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none"
                      placeholder={t('additionalInfoPlaceholder')}
                      maxLength={1000}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {(formData.message || '').length}/1000
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle size={14} />
                      <span className="text-sm font-medium">Error</span>
                    </div>
                    <p className="text-red-700 text-xs mt-1">{submitError}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {t('next')}
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  <ArrowLeft size={16} />
                  {t('back')}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center justify-center gap-2 bg-secondary text-white font-medium py-2.5 px-4 rounded-lg transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary-dark'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      {t('submit')}
                      <Check size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
