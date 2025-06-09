import { z } from 'zod'

export const BookingSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, 'Full name contains invalid characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\+]?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),

  adults: z
    .number()
    .int('Adults must be a whole number')
    .min(1, 'At least 1 adult is required')
    .max(20, 'Maximum 20 adults allowed'),

  children: z
    .number()
    .int('Children must be a whole number')
    .min(0, 'Children cannot be negative')
    .max(20, 'Maximum 20 children allowed'),

  arrivalDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Arrival date must be today or in the future')
    .refine((date) => {
      const selectedDate = new Date(date)
      return selectedDate.getDay() !== 0 // No Sundays
    }, 'Excursions are not available on Sundays'),

  arrivalTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
    .refine((time) => {
      const [hours] = time.split(':').map(Number)
      return hours >= 6 && hours <= 18 // Between 6 AM and 6 PM
    }, 'Arrival time must be between 6:00 AM and 6:00 PM'),

  message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),

  excursion: z
    .union([z.string(), z.number()])
    .refine((val) => val !== null && val !== undefined, 'Excursion is required'),
})

export type BookingFormData = z.infer<typeof BookingSchema>
export type Booking = BookingFormData & { id?: string | number }

// Client-side validation schema (without server-only fields)
export const ClientBookingSchema = BookingSchema.omit({
  excursion: true,
})
