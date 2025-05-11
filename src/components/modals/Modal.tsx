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
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const modalVariants = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2,
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
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const modalContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)

    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'visible'
    }
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
  const positionClass = position === 'top' ? 'mt-20 items-start' : 'items-center'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex justify-center ${positionClass} overflow-y-auto p-4 sm:p-6 md:p-8`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleOutsideClick}
        >
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            ref={modalContentRef}
            className={`bg-white rounded-xl shadow-2xl ${sizeClass} w-full relative z-10 overflow-hidden ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="px-6 py-4 border-b flex justify-between items-center">
                {title && <h3 className="text-xl font-semibold">{title}</h3>}

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    aria-label="Close modal"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={!title && !showCloseButton ? '' : ''}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
