'use client'

import { useCallback } from 'react'

export function useScrollTo() {
  const scrollToSection = useCallback((sectionId: string, e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault()
    }

    const section = document.getElementById(sectionId)
    if (section) {
      const rect = section.getBoundingClientRect()
      const offsetPosition = window.pageYOffset + rect.top

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  return { scrollToSection, scrollToTop }
}
