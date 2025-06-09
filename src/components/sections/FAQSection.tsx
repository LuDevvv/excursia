'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Clock,
  CreditCard,
  MapPin,
  Users,
  Package,
  Heart,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '../ui/AnimatedSection'

export default function FAQSection() {
  const t = useTranslations('faq')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // FAQ data with icons
  const faqs = [
    {
      question: t('weatherQuestion'),
      answer: t('weatherAnswer'),
      icon: <Clock className="h-5 w-5" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-500',
    },
    {
      question: t('bookingQuestion'),
      answer: t('bookingAnswer'),
      icon: <MessageCircle className="h-5 w-5" />,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-500',
    },
    {
      question: t('paymentQuestion'),
      answer: t('paymentAnswer'),
      icon: <CreditCard className="h-5 w-5" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-500',
    },
    {
      question: t('cancellationQuestion'),
      answer: t('cancellationAnswer'),
      icon: <Package className="h-5 w-5" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-500',
    },
    {
      question: t('pickupQuestion'),
      answer: t('pickupAnswer'),
      icon: <MapPin className="h-5 w-5" />,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-500',
    },
    {
      question: t('kidsQuestion'),
      answer: t('kidsAnswer'),
      icon: <Users className="h-5 w-5" />,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconBg: 'bg-pink-500',
    },
    {
      question: t('whatToBringQuestion'),
      answer: t('whatToBringAnswer'),
      icon: <Package className="h-5 w-5" />,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconBg: 'bg-teal-500',
    },
    {
      question: t('groupDiscountQuestion'),
      answer: t('groupDiscountAnswer'),
      icon: <Heart className="h-5 w-5" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-500',
    },
  ]

  return (
    <section
      id="faq"
      className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl">
        {/* Header Section */}
        <AnimatedSection
          animation="slideUp"
          delay={100}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-primary font-medium italic mb-3 text-sm sm:text-base flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4" />
              {t('stillHaveQuestions') || 'Questions & Answers'}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6 leading-tight">
              {t('title')}
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-primary mx-auto rounded-full mb-4 sm:mb-6" />
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </AnimatedSection>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-2 sm:gap-4">
            {faqs.map((faq, index) => (
              <AnimatedSection
                key={index}
                animation="slideUp"
                delay={200 + index * 50}
                duration={500}
                className="group"
              >
                <div
                  className={`border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    openIndex === index
                      ? 'shadow-lg ring-2 ring-primary/10 border-primary/20'
                      : 'hover:border-gray-300'
                  }`}
                >
                  {/* Question Button */}
                  <button
                    className={`flex items-center justify-between w-full p-2 sm:p-4 text-left transition-all duration-300 ${
                      openIndex === index ? faq.bgColor : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${faq.iconBg} flex items-center justify-center text-white transition-all duration-300 ${
                          openIndex === index ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                      >
                        {faq.icon}
                      </div>

                      {/* Question Text */}
                      <span className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg leading-tight">
                        {faq.question}
                      </span>
                    </div>

                    {/* Chevron */}
                    <div className="flex-shrink-0 ml-4">
                      <ChevronDown
                        className={`w-5 h-5 transition-all duration-300 ${
                          openIndex === index
                            ? 'transform rotate-180 text-primary'
                            : 'text-gray-400 group-hover:text-gray-600'
                        }`}
                      />
                    </div>
                  </button>

                  {/* Answer Panel */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-4">
                          <div className="pl-14 sm:pl-16">
                            <div className="prose prose-sm sm:prose-base max-w-none">
                              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
