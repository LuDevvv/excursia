'use client'

import React, { ReactNode, ElementType } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleIn'
    | 'scaleOut'
  delay?: number
  duration?: number
  threshold?: number
  rootMargin?: string
  as?: ElementType
  triggerOnce?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const animations = {
  fadeIn: {
    initial: 'opacity-0',
    animate: 'opacity-100',
    transition: 'transition-opacity',
  },
  slideUp: {
    initial: 'opacity-0 translate-y-8',
    animate: 'opacity-100 translate-y-0',
    transition: 'transition-all',
  },
  slideDown: {
    initial: 'opacity-0 -translate-y-8',
    animate: 'opacity-100 translate-y-0',
    transition: 'transition-all',
  },
  slideLeft: {
    initial: 'opacity-0 translate-x-8',
    animate: 'opacity-100 translate-x-0',
    transition: 'transition-all',
  },
  slideRight: {
    initial: 'opacity-0 -translate-x-8',
    animate: 'opacity-100 translate-x-0',
    transition: 'transition-all',
  },
  scaleIn: {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100',
    transition: 'transition-all',
  },
  scaleOut: {
    initial: 'opacity-0 scale-105',
    animate: 'opacity-100 scale-100',
    transition: 'transition-all',
  },
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  rootMargin = '100px',
  as: Component = 'div',
  triggerOnce = true,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce,
    rootMargin,
  })

  const animationConfig = animations[animation]

  // Dynamic duration classes
  const getDurationClass = (duration: number) => {
    const durationMap: Record<number, string> = {
      150: 'duration-150',
      200: 'duration-200',
      300: 'duration-300',
      500: 'duration-500',
      700: 'duration-700',
      1000: 'duration-1000',
      1500: 'duration-[1500ms]',
    }
    return durationMap[duration] || 'duration-700'
  }

  // Dynamic delay classes
  const getDelayClass = (delay: number) => {
    const delayMap: Record<number, string> = {
      0: '',
      100: 'delay-100',
      150: 'delay-150',
      200: 'delay-200',
      300: 'delay-300',
      400: 'delay-[400ms]',
      500: 'delay-500',
      600: 'delay-[600ms]',
      700: 'delay-[700ms]',
      800: 'delay-[800ms]',
      1000: 'delay-1000',
    }
    return delayMap[delay] || ''
  }

  const durationClass = getDurationClass(duration)
  const delayClass = getDelayClass(delay)

  return React.createElement(
    Component,
    {
      ref: ref as React.RefObject<HTMLElement>,
      className: `
        ${animationConfig.transition}
        ${durationClass}
        ${delayClass}
        ease-out
        ${isVisible ? animationConfig.animate : animationConfig.initial}
        ${className}
      `.trim(),
      onClick,
      onMouseEnter,
      onMouseLeave,
    },
    children,
  )
}

// Componente para animar elementos hijos con stagger
export function AnimatedList({
  children,
  className = '',
  animation = 'slideUp',
  staggerDelay = 100,
  threshold = 0.1,
  rootMargin = '50px',
  duration = 700,
}: {
  children: ReactNode[]
  className?: string
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleIn'
    | 'scaleOut'
  staggerDelay?: number
  threshold?: number
  rootMargin?: string
  duration?: number
}) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce: true,
    rootMargin,
  })

  const animationConfig = animations[animation]
  const durationClass =
    duration === 300
      ? 'duration-300'
      : duration === 500
        ? 'duration-500'
        : duration === 700
          ? 'duration-700'
          : duration === 1000
            ? 'duration-1000'
            : 'duration-700'

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`
            ${animationConfig.transition}
            ${durationClass}
            ease-out
            ${isVisible ? animationConfig.animate : animationConfig.initial}
          `.trim()}
          style={{
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Hook personalizado para animaciones simples
export function useSimpleAnimation(
  animation:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleIn'
    | 'scaleOut' = 'fadeIn',
  options?: {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
  },
) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: options?.threshold || 0.1,
    triggerOnce: options?.triggerOnce ?? true,
    rootMargin: options?.rootMargin || '100px',
  })

  const animationConfig = animations[animation]

  const className = `
    ${animationConfig.transition}
    duration-700
    ease-out
    ${isVisible ? animationConfig.animate : animationConfig.initial}
  `.trim()

  return { ref: ref as React.RefObject<HTMLElement>, isVisible, className }
}
