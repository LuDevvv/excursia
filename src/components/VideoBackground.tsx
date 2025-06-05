'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

interface VideoBackgroundProps {
  src: string
  poster: string
  title?: string
  className?: string
}

export default function VideoBackground({
  src,
  poster,
  title = '',
  className = '',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  // Evaluar si debe cargar video basado en conexión
  const shouldLoadVideoBasedOnConnection = useCallback((): boolean => {
    // Verificar si está en modo de ahorro de datos del navegador
    if ((navigator as any).connection?.saveData) return false

    // Verificar Network Information API
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection

    if (connection) {
      const { effectiveType, downlink } = connection

      // No cargar en conexiones muy lentas
      if (effectiveType === 'slow-2g' || effectiveType === '2g') return false

      // Para 3G, verificar ancho de banda
      if (effectiveType === '3g' && connection.downlink && connection.downlink < 1.5) return false

      // Si hay información de ancho de banda muy bajo
      if (connection.downlink && connection.downlink < 1) return false
    }

    // Verificar si el usuario está en móvil con datos limitados
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )

    // En móviles, ser más conservativo
    if (isMobile && connection?.effectiveType === '3g') {
      return connection.downlink ? connection.downlink > 2 : false
    }

    return true
  }, [])

  // Verificar preferencias del usuario para movimiento reducido
  const prefersReducedMotion = useCallback((): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Detectar si debe cargar video
  useEffect(() => {
    // No cargar video si el usuario prefiere movimiento reducido
    if (prefersReducedMotion()) {
      return
    }

    const canLoadVideo = shouldLoadVideoBasedOnConnection()

    if (canLoadVideo) {
      // Delay para mejorar el rendimiento inicial de la página
      const timer = setTimeout(() => {
        setShouldLoadVideo(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [shouldLoadVideoBasedOnConnection, prefersReducedMotion])

  // Escuchar cambios en la conexión
  useEffect(() => {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection

    if (!connection) return

    const handleConnectionChange = () => {
      const canLoadVideo = shouldLoadVideoBasedOnConnection()

      // Si la conexión mejora y no estaba cargando video, empezar a cargarlo
      if (canLoadVideo && !shouldLoadVideo && !prefersReducedMotion()) {
        setShouldLoadVideo(true)
      }
    }

    connection.addEventListener('change', handleConnectionChange)
    return () => connection.removeEventListener('change', handleConnectionChange)
  }, [shouldLoadVideoBasedOnConnection, shouldLoadVideo, prefersReducedMotion])

  const handleCanPlay = useCallback(() => {
    setIsLoaded(true)
    const video = videoRef.current
    if (video) {
      // Usar requestAnimationFrame para mejor rendimiento
      requestAnimationFrame(() => {
        video.play().catch((error) => {
          console.warn('Video autoplay blocked:', error)
        })
      })
    }
  }, [])

  useEffect(() => {
    if (!shouldLoadVideo) return

    const video = videoRef.current
    if (!video) return

    // Configurar video para máxima compatibilidad
    video.preload = 'metadata'
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.disablePictureInPicture = true
    video.controls = false

    // Atributos adicionales para compatibilidad móvil
    video.setAttribute('webkit-playsinline', 'true')
    video.setAttribute('x5-playsinline', 'true')
    video.setAttribute('x-webkit-airplay', 'deny')

    // Cargar video
    video.src = src
    video.load()

    // Event listeners
    const handleLoadedData = () => {
      // Video data loaded - optimizar para la reproducción
      if (video.readyState >= 3) {
        // HAVE_FUTURE_DATA
        handleCanPlay()
      }
    }

    const handleError = (e: Event) => {
      console.warn('Video loading error:', e)
      // En caso de error, asegurar que la imagen de fondo sea visible
      setIsLoaded(false)
    }

    const handleLoadStart = () => {
      // Video started loading
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
    }
  }, [shouldLoadVideo, src, handleCanPlay])

  // Pausar video cuando la pestaña no esté visible (ahorro de batería)
  useEffect(() => {
    if (!shouldLoadVideo) return

    const handleVisibilityChange = () => {
      const video = videoRef.current
      if (!video) return

      if (document.hidden) {
        video.pause()
      } else {
        video.play().catch(() => {
          // Silently handle play errors
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [shouldLoadVideo])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Imagen de fondo siempre visible */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{
          backgroundImage: `url(${poster})`,
          opacity: shouldLoadVideo && isLoaded ? 0.3 : 1,
        }}
      />

      {/* Video solo si debe cargarse y está disponible */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          aria-label={title}
          muted
          loop
          playsInline
          disablePictureInPicture
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            // Optimizaciones CSS para mejor rendimiento
            willChange: isLoaded ? 'auto' : 'opacity',
            transform: 'translateZ(0)', // Forzar aceleración de hardware
          }}
        >
          {/* Fuentes de video para mejor compatibilidad */}
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
    </div>
  )
}
