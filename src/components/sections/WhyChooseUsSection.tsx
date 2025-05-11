'use client'

import { useTranslations } from 'next-intl'
import { Users, DollarSign, Calendar, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WhyChooseUsSection() {
  const t = useTranslations('homepage')

  const features = [
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: t('experiencedGuides'),
      description: t('experiencedGuidesText'),
    },
    {
      icon: <DollarSign className="h-12 w-12 text-primary" />,
      title: t('bestValue'),
      description: t('bestValueText'),
    },
    {
      icon: <Calendar className="h-12 w-12 text-primary" />,
      title: t('flexibleScheduling'),
      description: t('flexibleSchedulingText'),
    },
    {
      icon: <Star className="h-12 w-12 text-primary" />,
      title: t('customerSatisfaction'),
      description: t('customerSatisfactionText'),
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-4">{t('whyChooseUs')}</h2>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        {t('whyChooseUsSubtitle')}
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-start"
            variants={itemVariants}
          >
            <div className="mr-4">{feature.icon}</div>
            <div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
