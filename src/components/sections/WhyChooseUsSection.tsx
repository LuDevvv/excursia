'use client'

import { useTranslations } from 'next-intl'
import { MapPin, Calendar, Compass, Ticket, Shield, Star, Clock } from 'lucide-react'
import { useState, useCallback } from 'react'
import AnimatedSection from '../ui/AnimatedSection'

export default function WhyChooseUsSection() {
  const t = useTranslations('homepage')
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  // Optimized with useCallback to prevent unnecessary re-renders
  const handleMouseEnter = useCallback((index: number) => {
    setActiveFeature(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setActiveFeature(null)
  }, [])

  const features = [
    {
      icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
      title: t('localAgency'),
      description: t('localAgencyText'),
      color: 'from-blue-600 to-indigo-700',
      iconBg: 'bg-blue-600',
      accent: 'bg-blue-500',
      delay: 0,
    },
    {
      icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
      title: t('quickBooking'),
      description: t('quickBookingText'),
      color: 'from-purple-600 to-purple-800',
      iconBg: 'bg-purple-600',
      accent: 'bg-purple-500',
      delay: 150,
    },
    {
      icon: <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
      title: t('guidedTours'),
      description: t('guidedToursText'),
      color: 'from-emerald-600 to-emerald-700',
      iconBg: 'bg-emerald-600',
      accent: 'bg-emerald-500',
      delay: 300,
    },
    {
      icon: <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
      title: t('bestPrice'),
      description: t('bestPriceText'),
      color: 'from-orange-500 to-orange-700',
      iconBg: 'bg-orange-500',
      accent: 'bg-orange-400',
      delay: 450,
    },
  ]

  const trustItems = [
    {
      icon: <Shield className="text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />,
      text: t('secureBooking'),
      bgColor: 'bg-blue-50',
    },
    {
      icon: <Star className="text-amber-500 h-5 w-5 sm:h-6 sm:w-6" />,
      text: t('fiveStarExperiences'),
      bgColor: 'bg-amber-50',
    },
    {
      icon: <Clock className="text-emerald-600 h-5 w-5 sm:h-6 sm:w-6" />,
      text: t('freeCancellation'),
      bgColor: 'bg-emerald-50',
    },
  ]

  return (
    <section id="why-choose-us" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl">
        {/* Header Section */}
        <AnimatedSection
          animation="slideUp"
          delay={100}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-primary font-medium italic mb-3 text-sm sm:text-base">
              {t('unforgettableExperiences')}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-4 sm:mb-6 leading-tight">
              {t('whyChooseUs')}
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-primary mx-auto rounded-full mb-4 sm:mb-6" />
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              {t('whyChooseUsSubtitle')}
            </p>
          </div>
        </AnimatedSection>

        {/* Features Grid Container */}
        <div className="relative mb-12 sm:mb-16 lg:mb-20">
          {/* Connected dotted path - only on large screens */}
          <div className="hidden xl:block absolute top-1/2 left-8 right-8 h-0.5 border-t-2 border-dashed border-gray-300 z-0">
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-2/4 w-2 h-2 bg-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative z-10">
            {features.map((feature, index) => (
              <AnimatedSection
                key={index}
                animation="slideUp"
                delay={feature.delay}
                duration={600}
                className={`rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 h-full cursor-pointer group ${
                  activeFeature === index
                    ? 'shadow-xl scale-105 -translate-y-2'
                    : 'shadow-md hover:shadow-lg hover:-translate-y-1'
                }`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative bg-white p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center h-full">
                  {/* Icon Container */}
                  <div
                    className={`relative mb-4 sm:mb-6 transition-transform duration-300 ${
                      activeFeature === index ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full ${feature.iconBg} flex items-center justify-center shadow-lg relative z-10 transition-all duration-300`}
                    >
                      {feature.icon}
                    </div>

                    {/* Pulse effect on hover/active */}
                    {activeFeature === index && (
                      <>
                        <div
                          className={`absolute inset-0 ${feature.iconBg} opacity-20 rounded-full animate-ping`}
                        />
                        <div
                          className={`absolute inset-0 ${feature.iconBg} opacity-30 rounded-full animate-pulse`}
                          style={{ animationDelay: '300ms' }}
                        />
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl lg:text-xl font-bold mb-2 sm:mb-3 text-slate-800 transition-colors duration-300 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base flex-1">
                        {feature.description}
                      </p>
                    </div>

                    {/* Accent bar */}
                    <div className="mt-4 sm:mt-6 w-full">
                      <div
                        className={`h-1 rounded-full transition-all duration-500 ease-out ${feature.accent} mx-auto`}
                        style={{
                          width: activeFeature === index ? '80%' : '30%',
                          opacity: activeFeature === index ? 1 : 0.6,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <AnimatedSection animation="slideUp" delay={600} className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {trustItems.map((item, index) => (
                <AnimatedSection
                  key={index}
                  animation="scaleIn"
                  delay={800 + index * 100}
                  duration={500}
                  className="flex items-center justify-center sm:justify-start group"
                >
                  <div
                    className={`flex-shrink-0 p-2 sm:p-3 ${item.bgColor} rounded-full transition-transform duration-200 group-hover:scale-110`}
                  >
                    {item.icon}
                  </div>
                  <span className="ml-3 text-gray-700 font-medium text-sm sm:text-base text-center sm:text-left leading-tight">
                    {item.text}
                  </span>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Background Decorations */}
        <div className="absolute top-10 left-4 w-20 h-20 bg-blue-100 rounded-full opacity-20 -z-10" />
        <div className="absolute bottom-10 right-4 w-32 h-32 bg-purple-100 rounded-full opacity-20 -z-10" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full opacity-30 -z-20" />
      </div>
    </section>
  )
}
