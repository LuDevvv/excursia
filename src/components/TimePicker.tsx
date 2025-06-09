'use client'

import { useState, useRef, useEffect } from 'react'
import { Clock, ChevronDown } from 'lucide-react'

interface TimeOption {
  value: string
  display: string
  searchable: string
}

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  locale: string
  className?: string
  placeholder?: string
  disabled?: boolean
}

export default function TimePicker({
  value,
  onChange,
  locale,
  className = '',
  placeholder,
  disabled = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate time options (30 minute intervals from 6 AM to 6 PM)
  const timeOptions: TimeOption[] = []
  for (let hour = 6; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const displayTime = formatTimeDisplay(timeString, locale)
      timeOptions.push({
        value: timeString,
        display: displayTime,
        searchable: `${timeString} ${displayTime}`.toLowerCase(),
      })
    }
  }

  // Filter options based on search term
  const filteredOptions = timeOptions.filter((option) =>
    option.searchable.includes(searchTerm.toLowerCase()),
  )

  function formatTimeDisplay(time: string, locale: string): string {
    const [hour, minute] = time.split(':').map(Number)

    if (locale === 'es') {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    }

    // English format with AM/PM
    if (hour === 0) {
      return `12:${minute.toString().padStart(2, '0')} AM`
    } else if (hour < 12) {
      return `${hour}:${minute.toString().padStart(2, '0')} AM`
    } else if (hour === 12) {
      return `12:${minute.toString().padStart(2, '0')} PM`
    } else {
      return `${hour - 12}:${minute.toString().padStart(2, '0')} PM`
    }
  }

  const handleTimeSelect = (timeValue: string) => {
    onChange(timeValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setSearchTerm(inputValue)

    // Try to find exact match
    const exactMatch = timeOptions.find(
      (option) => option.value === inputValue || option.display === inputValue,
    )

    if (exactMatch) {
      onChange(exactMatch.value)
    }
  }

  const displayValue = value ? formatTimeDisplay(value, locale) : ''

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredOptions.length === 1) {
        handleTimeSelect(filteredOptions[0].value)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchTerm('')
      inputRef.current?.blur()
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock size={16} className="text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (locale === 'es' ? 'Seleccionar hora' : 'Select time')}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm transition-colors ${
            disabled
              ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed'
              : 'border-gray-300 focus:ring-primary focus:border-primary bg-white'
          }`}
          autoComplete="off"
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

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTimeSelect(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    value === option.value
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'text-gray-700'
                  }`}
                >
                  {option.display}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {locale === 'es' ? 'No se encontraron horarios' : 'No times found'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
