'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'

// FAQ interface
interface FAQ {
  question: string
  answer: string
}

export default function FAQSection() {
  const t = useTranslations('faq')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // FAQ data
  const faqs: FAQ[] = [
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
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-3">{t('title')}</h2>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">{t('subtitle')}</p>

      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="flex justify-between items-center w-full p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-medium text-lg">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="flex-shrink-0 text-primary" />
              ) : (
                <ChevronDown className="flex-shrink-0 text-gray-400" />
              )}
            </button>

            <div
              className={`px-5 py-4 bg-gray-50 transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 hidden'
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold mb-3">{t('stillHaveQuestions')}</h3>
        <p className="text-gray-600 mb-6">{t('contactUs')}</p>
        <a
          href="#contact"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {t('contactButton')}
        </a>
      </div>
    </div>
  )
}
