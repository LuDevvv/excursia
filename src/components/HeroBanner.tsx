'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface HeroBannerProps {
  videoSrc?: string
  posterSrc?: string
  titleKey?: string
  subtitleKey?: string
  buttonTextKey?: string
  buttonLink?: string
}

export default function HeroBanner({
  videoSrc = '/videos/hero-video.mp4',
  posterSrc = '/images/hero-poster.jpg',
  titleKey = 'title',
  subtitleKey = 'subtitle',
  buttonTextKey = 'bookNow',
  buttonLink = '/booking',
}: HeroBannerProps) {
  const t = useTranslations('header')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Scroll to next section function
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  // Handle video loop
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleEnded = () => {
        video.play().catch((error) => {
          console.error('Error replaying video:', error)
        })
      }

      video.addEventListener('ended', handleEnded)
      return () => {
        video.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black" style={{ opacity: 0.6 }}></div>
      </div>

      {/* Content */}
      <div className="relative z-30 h-full w-full flex flex-col items-center justify-center text-center px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Text Content */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {t(titleKey)}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white mb-10 max-w-3xl mx-auto"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
          >
            {t(subtitleKey)}
          </motion.p>

          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              href={buttonLink}
              className="inline-block bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-12 rounded-lg transition-all text-lg uppercase tracking-wider shadow-lg"
            >
              {t(buttonTextKey)}
            </Link>
          </motion.div>
        </div>

        {/* Scroll Down Arrow */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-30"
          onClick={scrollToNextSection}
          animate={{
            y: [0, -8, 0],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            },
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="flex flex-col items-center">
            <ChevronDown className="text-white h-6 w-6" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
