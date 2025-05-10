'use client'

import { useState } from 'react'
import { Excursion } from '@/payload-types'
import { Loader2 } from 'lucide-react'

interface BookingFormProps {
  excursion: Excursion
  onSuccess?: () => void
}

export default function BookingForm({ excursion, onSuccess }: BookingFormProps) {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (formData.adults < 1) {
      newErrors.adults = 'At least 1 adult is required'
    }

    if (!formData.arrivalDate) {
      newErrors.arrivalDate = 'Arrival date is required'
    }

    if (!formData.arrivalTime) {
      newErrors.arrivalTime = 'Arrival time is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

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
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      setSubmitSuccess(true)

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        adults: 1,
        children: 0,
        arrivalDate: '',
        arrivalTime: '',
        message: '',
      })

      // Call onSuccess after a delay to show success message
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      setSubmitError('Failed to submit booking. Please try again.')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitSuccess ? (
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h4 className="text-green-800 font-medium text-lg mb-2">Booking Successful!</h4>
          <p className="text-green-700">
            Thank you for your booking. We will contact you shortly with confirmation details.
          </p>
        </div>
      ) : (
        <>
          {/* Personal Information */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
                Adults *
              </label>
              <input
                type="number"
                id="adults"
                name="adults"
                min="1"
                value={formData.adults}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.adults ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.adults && <p className="mt-1 text-sm text-red-600">{errors.adults}</p>}
            </div>

            <div>
              <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
                Children
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700 mb-1">
                Arrival Date *
              </label>
              <input
                type="date"
                id="arrivalDate"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md ${errors.arrivalDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.arrivalDate && (
                <p className="mt-1 text-sm text-red-600">{errors.arrivalDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700 mb-1">
                Arrival Time *
              </label>
              <select
                id="arrivalTime"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.arrivalTime ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select time</option>
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
              Additional Information
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Any special requests or information we should know"
            ></textarea>
          </div>

          {submitError && (
            <div className="bg-red-50 p-3 rounded text-red-700 text-sm">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-primary text-white font-medium py-2 px-4 rounded transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 size={20} className="animate-spin mr-2" />
                Submitting...
              </span>
            ) : (
              'Book Now'
            )}
          </button>
        </>
      )}
    </form>
  )
}
