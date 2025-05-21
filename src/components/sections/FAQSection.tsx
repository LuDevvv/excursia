'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function FAQSection() {
  const t = useTranslations('faq')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // FAQ data
  const faqs = [
    {
      question: t('weatherQuestion'),
      answer: t('weatherAnswer'),
    },
    {
      question: t('bookingQuestion'),
      answer: t('bookingAnswer'),
    },
    {
      question: t('paymentQuestion'),
      answer: t('paymentAnswer'),
    },
    {
      question: t('cancellationQuestion'),
      answer: t('cancellationAnswer'),
    },
    {
      question: t('pickupQuestion'),
      answer: t('pickupAnswer'),
    },
    {
      question: t('kidsQuestion'),
      answer: t('kidsAnswer'),
    },
    {
      question: t('whatToBringQuestion'),
      answer: t('whatToBringAnswer'),
    },
    {
      question: t('groupDiscountQuestion'),
      answer: t('groupDiscountAnswer'),
    },
  ]

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3">{t('title')}</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-5"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                className={`flex justify-between items-center w-full p-4 text-left ${
                  openIndex === index ? 'bg-gray-50' : 'bg-white'
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180 text-primary' : 'text-gray-400'
                  }`}
                />
              </button>

              <div
                className={`px-4 py-3 bg-gray-50 transition-all duration-200 ${
                  openIndex === index ? 'block' : 'hidden'
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
