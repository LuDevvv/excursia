'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import SkullDecoration from './SkullDecoration'

interface HeroBannerProps {
  videoSrc?: string
  posterSrc?: string
  overlayOpacity?: number
  titleKey?: string
  buttonTextKey?: string
  buttonLink?: string
  animationDuration?: number
  waterEffect?: boolean
}

export default function HeroBanner({
  videoSrc = '/videos/hero-video.mp4',
  posterSrc = '/images/hero-poster.jpg',
  overlayOpacity = 0.4,
  titleKey = 'title',
  buttonTextKey = 'bookNow',
  buttonLink = '/booking',
  animationDuration = 0.8,
  waterEffect = true,
}: HeroBannerProps) {
  const t = useTranslations('header')
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  // Check if it's a mobile device
  useEffect(() => {
    setIsMobileDevice(window.innerWidth <= 768)

    // Optional: Handle resize
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle video loaded event
  const handleVideoLoaded = () => {
    setVideoLoaded(true)
  }

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationDuration,
        ease: 'easeOut',
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: animationDuration,
        delay: animationDuration * 0.3,
        ease: 'easeOut',
      },
    },
  }

  const waterAnimation = waterEffect
    ? {
        from: { transform: 'translateY(0)' },
        to: { transform: 'translateY(-3%)' },
      }
    : {}

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video or Image Background */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {!isMobileDevice ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            poster={posterSrc}
            onLoadedData={handleVideoLoaded}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <img
            src={posterSrc}
            alt="Hero Background"
            className="w-full h-full object-cover"
            onLoad={() => setVideoLoaded(true)}
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black z-10" style={{ opacity: overlayOpacity }}></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full w-full flex flex-col items-center justify-center text-center px-4">
        <div className="container mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg"
            variants={titleVariants}
            initial="hidden"
            animate={videoLoaded ? 'visible' : 'hidden'}
          >
            {t(titleKey)}
          </motion.h1>

          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate={videoLoaded ? 'visible' : 'hidden'}
          >
            <Link
              href={buttonLink}
              className="inline-block bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-10 rounded-lg transition-colors transform hover:scale-105 text-lg uppercase tracking-wide"
            >
              {t(buttonTextKey)}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Skull Rock Element */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-7xl">
        <SkullDecoration waterEffect={waterEffect} />
      </div>
    </div>
  )
}
