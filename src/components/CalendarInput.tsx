'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarInputProps {
  value: Date | null
  onChange: (date: Date) => void
  locale: string
  placeholder?: string
  error?: string
}

export default function CalendarInput({
  value,
  onChange,
  locale,
  placeholder,
  error,
}: CalendarInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const dropdownRef = useRef<HTMLDivElement>(null)

  const monthNames =
    locale === 'es'
      ? [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ]
      : [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]

  const dayNames =
    locale === 'es'
      ? ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
      : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return ''
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date < today) return

    onChange(date)
    setIsOpen(false)
  }

  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Empty cells at start
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const isSelected = (day: number) => {
    if (!value) return false
    return (
      day === value.getDate() &&
      currentMonth === value.getMonth() &&
      currentYear === value.getFullYear()
    )
  }

  const isDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const canGoPrevious = () => {
    const now = new Date()
    return (
      currentYear > now.getFullYear() ||
      (currentYear === now.getFullYear() && currentMonth > now.getMonth())
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const calendarDays = generateCalendarDays()

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar size={16} className="text-gray-400" />
        </div>

        <input
          type="text"
          value={formatDisplayDate(value)}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          readOnly
          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg cursor-pointer transition-colors ${
            error
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 focus:ring-primary focus:border-primary bg-white'
          }`}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={goToPreviousMonth}
              disabled={!canGoPrevious()}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <h3 className="font-semibold text-gray-900 text-sm">
              {monthNames[currentMonth]} {currentYear}
            </h3>

            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1.5 rounded hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => day && handleDateSelect(day)}
                disabled={!day || isDisabled(day)}
                className={`
                  h-9 w-9 text-sm flex items-center justify-center rounded transition-colors
                  ${!day ? 'invisible' : ''}
                  ${day && isSelected(day) ? 'bg-primary text-white font-semibold' : ''}
                  ${
                    day && !isSelected(day) && !isDisabled(day)
                      ? 'hover:bg-gray-100 text-gray-900'
                      : ''
                  }
                  ${day && isDisabled(day) ? 'text-gray-300 cursor-not-allowed' : ''}
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
