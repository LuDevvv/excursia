import { z } from 'zod'

export const BookingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  excursion: z.number().int().positive('Excursion ID is required'),
  adults: z.number().int().min(1, 'At least 1 adult is required'),
  children: z.number().int().min(0, 'Children count cannot be negative'),
  arrivalDate: z.string().min(1, 'Arrival date is required'),
  arrivalTime: z.string().min(1, 'Arrival time is required'),
  message: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).default('pending'),
})

export type BookingFormData = z.infer<typeof BookingSchema>

// For API responses
export interface BookingResponse {
  success: boolean
  booking?: any
  error?: {
    message: string
    type: string
    details?: any
  }
}

// Email service response
export interface EmailResult {
  success: boolean
  customerEmailId?: string
  businessEmailId?: string
  error?: {
    message: string
    type: string
  }
}
