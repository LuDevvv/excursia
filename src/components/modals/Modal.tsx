'use client'

import { useEffect, useState, useRef } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  showCloseButton?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  position?: 'center' | 'top'
  closeOnOutsideClick?: boolean
  showOverlay?: boolean
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'tween',
      duration: 0.25,
      ease: [0.2, 0.0, 0.0, 1.0], // Improved easing curve for lighter feel
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: {
      duration: 0.15,
    },
  },
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  size = 'md',
  className = '',
  position = 'center',
  closeOnOutsideClick = true,
  showOverlay = true,
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const modalContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    // Prevent scrolling on body when modal is open
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalStyle
      }
    }

    return undefined
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle outside click
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      closeOnOutsideClick &&
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      onClose()
    }
  }

  if (!isMounted) return null

  // Determine size class
  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }[size]

  // Determine position class
  const positionClass = position === 'top' ? 'mt-16 items-start' : 'items-center'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Background Overlay - conditionally rendered */}
          {showOverlay && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleOutsideClick}
            />
          )}

          {/* Modal Container */}
          <div
            className={`fixed inset-0 flex justify-center ${positionClass} p-4 sm:p-6 md:p-8 pointer-events-none ${!showOverlay ? 'bg-transparent' : ''}`}
          >
            {/* Modal Content */}
            <motion.div
              ref={modalContentRef}
              className={`${showOverlay ? 'bg-white' : 'bg-transparent'} rounded-lg shadow-lg ${sizeClass} w-full relative z-10 pointer-events-auto ${className}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="px-6 py-4 border-b  border-gray-100 flex justify-between items-center">
                  {title && <h3 className="text-lg font-medium text-gray-800">{title}</h3>}

                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                      aria-label="Close modal"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div>{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
