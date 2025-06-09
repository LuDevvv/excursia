'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverProps {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '50px', // Por defecto activar antes
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const targetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = targetRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setIsIntersecting(isVisible)

        if (isVisible && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold,
        rootMargin, // Margen para activar antes
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, hasIntersected])

  // Retornar el estado apropiado basado en triggerOnce
  const shouldShow = triggerOnce ? hasIntersected : isIntersecting

  return { ref: targetRef, isVisible: shouldShow, isIntersecting }
}

// Hook para múltiples elementos
export function useIntersectionObserverMultiple(
  elementCount: number,
  options?: UseIntersectionObserverProps,
) {
  const [visibleElements, setVisibleElements] = useState<Set<number>>(new Set())
  const refs = useRef<(HTMLElement | null)[]>(Array(elementCount).fill(null))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = refs.current.findIndex((ref) => ref === entry.target)
          if (index !== -1) {
            setVisibleElements((prev) => {
              const newSet = new Set(prev)
              if (entry.isIntersecting) {
                newSet.add(index)
              } else if (!options?.triggerOnce) {
                newSet.delete(index)
              }
              return newSet
            })
          }
        })
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '50px',
      },
    )

    // Capturar refs.current en una variable local
    const currentRefs = refs.current
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [elementCount, options])

  const setRef = (index: number) => (element: HTMLElement | null) => {
    refs.current[index] = element
  }

  return { setRef, visibleElements }
}
