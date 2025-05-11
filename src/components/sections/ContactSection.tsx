'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactSection() {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
      [name]: value,
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

    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid')
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('subjectRequired')
    }

    if (!formData.message.trim()) {
      newErrors.message = t('messageRequired')
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(t('submitError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: t('address'),
      content: (
        <>
          123 Beach Road, Punta Cana
          <br />
          Dominican Republic
        </>
      ),
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: t('phone'),
      content: (
        <>
          <a href="tel:+18095551234" className="hover:text-primary transition-colors">
            +1 (809) 555-1234
          </a>
          <br />
          <a href="tel:+18095555678" className="hover:text-primary transition-colors">
            +1 (809) 555-5678
          </a>
        </>
      ),
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: t('email'),
      content: (
        <a href="mailto:info@excursia.com" className="hover:text-primary transition-colors">
          info@excursia.com
        </a>
      ),
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: t('hours'),
      content: (
        <>
          {t('monday')} - {t('sunday')}: 8:00 AM - 8:00 PM
        </>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-3">{t('title')}</h2>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">{t('subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Information */}
        <motion.div
          className="lg:col-span-2 p-6 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">{t('contactInfo')}</h2>

          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mr-4">{item.icon}</div>
                <div>
                  <h3 className="font-medium text-lg">{item.title}</h3>
                  <div className="text-gray-600 mt-1">{item.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media Links */}
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-3">{t('followUs')}</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="h-5 w-5 fill-current text-blue-600" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="h-5 w-5 fill-current text-pink-600" viewBox="0 0 24 24">
                  <path d="M12 2c-2.716 0-3.056.012-4.123.06-1.064.049-1.791.218-2.427.465a4.88 4.88 0 0 0-1.77 1.153A4.897 4.897 0 0 0 2.525 5.45c-.247.636-.416 1.363-.465 2.427C2.012 8.944 2 9.284 2 12s.012 3.056.06 4.123c.049 1.064.218 1.791.465 2.427a4.88 4.88 0 0 0 1.153 1.77 4.897 4.897 0 0 0 1.77 1.153c.636.247 1.363.416 2.427.465C8.944 21.988 9.284 22 12 22s3.056-.012 4.123-.06c1.064-.049 1.791-.218 2.427-.465a4.91 4.91 0 0 0 1.77-1.153 4.897 4.897 0 0 0 1.153-1.77c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.049-1.064-.218-1.791-.465-2.427a4.88 4.88 0 0 0-1.153-1.77 4.897 4.897 0 0 0-1.77-1.153c-.636-.247-1.363-.416-2.427-.465C15.056 2.012 14.716 2 12 2zm0 1.802c2.67 0 2.986.01 4.04.058.976.045 1.505.207 1.858.344.466.181.8.397 1.15.748.35.35.566.684.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.041s-.01 2.986-.058 4.04c-.045.976-.207 1.505-.344 1.858-.181.466-.397.8-.748 1.15-.35.35-.684.566-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058s-2.987-.01-4.04-.058c-.976-.045-1.505-.207-1.858-.344a3.098 3.098 0 0 1-1.15-.748 3.098 3.098 0 0 1-.748-1.15c-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041s.01-2.986.058-4.04c.045-.976.207-1.505.344-1.858.181-.466.397-.8.748-1.15.35-.35.684-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.041-.058z" />
                  <path d="M12 15.333a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666zm0-8.468a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27z" />
                  <circle cx="17.334" cy="6.666" r="1.2" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="h-5 w-5 fill-current text-blue-400" viewBox="0 0 24 24">
                  <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="lg:col-span-3 p-6 bg-white rounded-lg shadow-md"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          {submitSuccess ? (
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-xl font-bold text-green-800 mb-2">{t('successTitle')}</h3>
              <p className="text-green-700">{t('successMessage')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">{t('getInTouch')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                    className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('subject')} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              {submitError && (
                <div className="bg-red-50 p-3 rounded-md">
                  <p className="text-red-600 text-sm">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t('sending')}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    {t('send')}
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
