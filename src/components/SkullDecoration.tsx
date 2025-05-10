'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface SkullDecorationProps {
  className?: string
  waterEffect?: boolean
  waterOpacity?: number
}

export default function SkullDecoration({
  className = '',
  waterEffect = true,
  waterOpacity = 0.3,
}: SkullDecorationProps) {
  const waterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (waterEffect && waterRef.current) {
      const animateWater = () => {
        if (!waterRef.current) return

        const water = waterRef.current
        water.animate(
          [
            { transform: 'translateY(0)' },
            { transform: 'translateY(-8px)' },
            { transform: 'translateY(0)' },
          ],
          {
            duration: 3000,
            iterations: Infinity,
            easing: 'ease-in-out',
          },
        )
      }

      animateWater()
    }
  }, [waterEffect])

  return (
    <div className={`relative ${className}`}>
      {/* SVG Skull Rock Element */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 550 480"
        className="w-full h-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Rock Formation */}
        <path
          d="M50,480 C50,480 120,400 200,380 C280,360 350,380 400,350 C450,320 500,250 500,200 C500,150 480,100 430,80 C380,60 300,70 250,100 C200,130 180,200 150,220 C120,240 50,220 50,220 L50,480 Z"
          fill="#d9c8a0"
          stroke="#9a8c6b"
          strokeWidth="3"
        />

        {/* Skull Face */}
        <path
          d="M200,280 C200,230 250,200 300,200 C350,200 400,230 400,280 C400,330 370,380 300,380 C230,380 200,330 200,280 Z"
          fill="#e8dfc1"
          stroke="#c4b79c"
          strokeWidth="2"
        />

        {/* Eye Sockets */}
        <ellipse cx="250" cy="260" rx="25" ry="35" fill="#31291d" />
        <ellipse cx="350" cy="260" rx="25" ry="35" fill="#31291d" />

        {/* Nose Cavity */}
        <path
          d="M290,280 C290,280 300,300 310,280 L310,310 C310,310 300,320 290,310 L290,280 Z"
          fill="#31291d"
        />

        {/* Mouth */}
        <path
          d="M250,320 C250,320 300,340 350,320 L350,340 C350,340 300,360 250,340 L250,320 Z"
          fill="#31291d"
        />

        {/* Teeth */}
        <rect x="265" y="330" width="15" height="20" fill="#f5f2e9" rx="2" />
        <rect x="285" y="330" width="15" height="20" fill="#f5f2e9" rx="2" />
        <rect x="305" y="330" width="15" height="20" fill="#f5f2e9" rx="2" />
        <rect x="325" y="330" width="15" height="20" fill="#f5f2e9" rx="2" />
      </motion.svg>

      {/* Water Effect */}
      {waterEffect && (
        <div
          ref={waterRef}
          className="absolute bottom-0 left-0 w-full"
          style={{ opacity: waterOpacity }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a85d1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0a85d1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#waterGradient)"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  )
}
