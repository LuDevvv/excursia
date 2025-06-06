import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { bookingEmailService } from '@/services/bookingEmailService'
import { BookingSchema } from '@/lib/types/booking'
import { Excursion } from '@/payload-types'

export async function POST(req: Request) {
  try {
    // Get and validate booking data
    const requestData = await req.json()

    const validationResult = BookingSchema.safeParse(requestData)
    if (!validationResult.success) {
      console.error('❌ Booking validation failed:', validationResult.error.errors)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid booking data',
            type: 'VALIDATION_ERROR',
            details: validationResult.error.errors,
          },
        },
        { status: 400 },
      )
    }

    const bookingData = validationResult.data

    // Initialize Payload
    const payload = await getPayload({
      config: configPromise,
    })

    // Get excursion details first to validate it exists
    let excursion: Excursion
    try {
      excursion = (await payload.findByID({
        collection: 'excursions',
        id: bookingData.excursion,
      })) as Excursion
    } catch (excursionError) {
      console.error('❌ Excursion not found:', excursionError)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Excursion not found',
            type: 'EXCURSION_NOT_FOUND',
          },
        },
        { status: 404 },
      )
    }

    // Validate excursion is active
    if (!excursion.active) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'This excursion is not currently available',
            type: 'EXCURSION_INACTIVE',
          },
        },
        { status: 400 },
      )
    }

    // Create booking in database
    const booking = await payload.create({
      collection: 'bookings',
      data: bookingData,
    })

    console.log('✅ Booking created successfully:', booking.id)

    // Send emails
    const emailResult = await bookingEmailService.sendBookingConfirmation(booking, excursion)

    if (!emailResult.success) {
      console.warn('⚠️ Email sending failed, but booking was created:', emailResult.error)
      // Don't fail the API call if email fails - booking is still valid
    } else {
      console.log('✅ Emails sent successfully:', {
        customerEmailId: emailResult.customerEmailId,
        businessEmailId: emailResult.businessEmailId,
      })
    }

    return NextResponse.json(
      {
        success: true,
        booking,
        emailSent: emailResult.success,
        emailError: emailResult.success ? undefined : emailResult.error,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('❌ Critical error in booking API:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to create booking',
          type: 'INTERNAL_ERROR',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
      },
      { status: 500 },
    )
  }
}
