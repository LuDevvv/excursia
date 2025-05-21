'use client'

import { useTranslations } from 'next-intl'
import { MapPin, Calendar, Compass, Ticket, ChevronRight, Shield, Star, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'

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
      icon: <MapPin className="h-6 w-6 text-white" />,
      title: t('localAgency'),
      description: t('localAgencyText'),
      color: 'from-blue-600 to-indigo-700',
      iconBg: 'bg-blue-600',
      accent: 'bg-blue-500',
    },
    {
      icon: <Calendar className="h-6 w-6 text-white" />,
      title: t('quickBooking'),
      description: t('quickBookingText'),
      color: 'from-purple-600 to-purple-800',
      iconBg: 'bg-purple-600',
      accent: 'bg-purple-500',
    },
    {
      icon: <Compass className="h-6 w-6 text-white" />,
      title: t('guidedTours'),
      description: t('guidedToursText'),
      color: 'from-emerald-600 to-emerald-700',
      iconBg: 'bg-emerald-600',
      accent: 'bg-emerald-500',
    },
    {
      icon: <Ticket className="h-6 w-6 text-white" />,
      title: t('bestPrice'),
      description: t('bestPriceText'),
      color: 'from-orange-500 to-orange-700',
      iconBg: 'bg-orange-500',
      accent: 'bg-orange-400',
    },
  ]

  // Performance-optimized animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  }

  const trustItemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="why-choose-us" className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mb-16 text-center"
        >
          <p className="text-blue-600 font-medium italic mb-2">{t('unforgettableExperiences')}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-5">
            {t('whyChooseUs')}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t('whyChooseUsSubtitle')}</p>
        </motion.div>

        {/* Connected dotted path between features */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 border-t-2 border-dashed border-gray-200 z-0">
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-2/4 w-3 h-3 bg-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`rounded-xl overflow-hidden transition-all duration-300 h-full transform ${
                activeFeature === index ? 'shadow-xl scale-105' : 'shadow-md hover:shadow-lg'
              }`}
              variants={itemVariants}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Icon circle with pulse effect */}
              <div className="relative bg-white p-8 flex flex-col items-center text-center">
                <div
                  className={`relative mb-5 ${activeFeature === index ? 'scale-110' : ''} transition-transform duration-300`}
                >
                  <div
                    className={`w-16 h-16 rounded-full ${feature.iconBg} flex items-center justify-center shadow-lg relative z-10`}
                  >
                    {feature.icon}
                  </div>

                  {/* Subtle pulse effect on hover */}
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

                <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* Accent bar that animates on hover */}
                <div className="mt-5 w-full">
                  <div
                    className={`h-1 rounded-full transition-all duration-500 ease-out ${feature.accent}`}
                    style={{
                      width: activeFeature === index ? '80%' : '20%',
                      opacity: activeFeature === index ? 1 : 0.5,
                      margin: '0 auto',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced trust indicators */}
        <motion.div
          className="mt-16 lg:mt-24 max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 lg:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <motion.div
              className="flex items-center"
              variants={trustItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-full">
                <Shield className="text-blue-600 h-6 w-6" />
              </div>
              <span className="ml-3 text-gray-700 font-medium">{t('secureBooking')}</span>
            </motion.div>

            <motion.div
              className="flex items-center"
              variants={trustItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex-shrink-0 p-2 bg-amber-50 rounded-full">
                <Star className="text-amber-500 h-6 w-6" />
              </div>
              <span className="ml-3 text-gray-700 font-medium">{t('fiveStarExperiences')}</span>
            </motion.div>

            <motion.div
              className="flex items-center"
              variants={trustItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex-shrink-0 p-2 bg-emerald-50 rounded-full">
                <Clock className="text-emerald-600 h-6 w-6" />
              </div>
              <span className="ml-3 text-gray-700 font-medium">{t('freeCancellation')}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
