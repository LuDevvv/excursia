'use client'

import { useTranslations } from 'next-intl'
import { ChevronDown, Star, MapPin } from 'lucide-react'
import VideoBackground from './VideoBackground'
import { useScrollTo } from '@/hooks'
import AnimatedSection from './ui/AnimatedSection'

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
  buttonLink = 'excursions',
}: HeroBannerProps) {
  const t = useTranslations('header')
  const { scrollToSection } = useScrollTo()

  const scrollToNextSection = () => {
    scrollToSection('excursions')
  }

  const handleBookNowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToSection(buttonLink)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <VideoBackground src={videoSrc} poster={posterSrc} title={t(titleKey)} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-20" />

      <div className="relative z-30 h-full w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Main Title */}
          <AnimatedSection
            animation="slideDown"
            delay={200}
            duration={1000}
            className="mb-4 sm:mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] sm:leading-tight">
              <span className="block mb-2 sm:mb-3">{t(titleKey)}</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-secondary via-yellow-400 to-secondary bg-clip-text text-transparent font-extrabold">
                {t('highLightText')}
              </span>
            </h1>
          </AnimatedSection>

          {/* Subtitle */}
          <AnimatedSection
            animation="slideUp"
            delay={400}
            duration={1000}
            className="mb-8 sm:mb-10 lg:mb-12"
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-5xl mx-auto leading-relaxed font-light px-2">
              {t(subtitleKey)}
            </p>
          </AnimatedSection>

          {/* Trust Indicators */}
          <AnimatedSection
            animation="fadeIn"
            delay={600}
            duration={800}
            className="mb-8 sm:mb-10 lg:mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 sm:h-5 sm:w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-base sm:text-base font-medium">{t('rating')}</span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-white/30" />

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 sm:h-5 sm:w-5 text-primary" />
                <span className="text-base sm:text-base font-medium">{t('localExperts')}</span>
              </div>

              <div className="hidden sm:block w-px h-4 bg-white/30" />

              <div className="flex items-center gap-2">
                <span className="text-base sm:text-base font-medium">{t('happyTravelers')}</span>
              </div>
            </div>
          </AnimatedSection>

          {/* CTA Button */}
          <AnimatedSection
            animation="scaleIn"
            delay={800}
            duration={800}
            className="mb-10 sm:mb-14 lg:mb-16"
          >
            <a
              href={`#${buttonLink}`}
              onClick={handleBookNowClick}
              className="group inline-flex items-center justify-center bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-10 sm:py-4 sm:px-12 lg:py-5 lg:px-16 rounded-full transition-all duration-300 text-lg sm:text-lg lg:text-xl uppercase tracking-wider shadow-2xl hover:shadow-3xl hover:scale-105 transform-gpu"
            >
              <span>{t(buttonTextKey)}</span>
            </a>
          </AnimatedSection>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 sm:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-30">
          <AnimatedSection
            animation="fadeIn"
            delay={1000}
            duration={600}
            onClick={scrollToNextSection}
            className="flex flex-col items-center group"
          >
            <div className="animate-bounce">
              <div className="w-6 h-10 sm:w-6 sm:h-10 border-2 border-white/60 rounded-full flex justify-center">
                <div className="w-1 h-3 sm:h-3 bg-white/80 rounded-full mt-2 sm:mt-2 animate-pulse" />
              </div>
            </div>
            <span className="text-white/70 text-sm sm:text-sm mt-3 sm:mt-3 opacity-80 tracking-wider uppercase group-hover:opacity-100 transition-opacity duration-300">
              {t('discoverMore')}
            </span>
            <ChevronDown className="text-white/60 h-4 w-4 sm:h-4 sm:w-4 mt-1 group-hover:text-white/80 group-hover:translate-y-1 transition-all duration-300" />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
