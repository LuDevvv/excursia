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

    // Initialize Payload to get excursion details
    const payload = await getPayload({
      config: configPromise,
    })

    // Get excursion details to validate it exists and is active
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

    console.log('✅ Booking data validated successfully:', {
      customer: bookingData.fullName,
      email: bookingData.email,
      excursion: excursion.title,
      date: bookingData.arrivalDate,
      time: bookingData.arrivalTime,
    })

    // Send confirmation emails
    const emailResult = await bookingEmailService.sendBookingConfirmation(bookingData, excursion)

    if (!emailResult.success) {
      console.warn('⚠️ Email sending failed:', emailResult.error)

      // Return success anyway since the booking request is valid
      // The user will be notified that emails might be delayed
      return NextResponse.json(
        {
          success: true,
          emailSent: false,
          emailError: emailResult.error?.message,
          message: 'Booking confirmed! Email confirmation may be delayed.',
        },
        { status: 200 },
      )
    }

    console.log('✅ Emails sent successfully:', {
      customerEmailId: emailResult.customerEmailId,
      businessEmailId: emailResult.businessEmailId,
    })

    return NextResponse.json(
      {
        success: true,
        emailSent: true,
        message: 'Booking confirmed successfully!',
      },
      { status: 200 },
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Critical error in booking API:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to process booking request',
          type: 'INTERNAL_ERROR',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        },
      },
      { status: 500 },
    )
  }
}
