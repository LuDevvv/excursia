import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Resend } from 'resend'

// Initialize Resend client if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: Request) {
  try {
    // Get booking data from request
    const bookingData = await req.json()

    // Initialize Payload with the required config parameter
    const payload = await getPayload({
      config: configPromise,
    })

    // Create booking in database
    const booking = await payload.create({
      collection: 'bookings',
      data: bookingData,
    })

    // Get excursion details for the email
    const excursion = await payload.findByID({
      collection: 'excursions',
      id: bookingData.excursion,
    })

    // Send email if Resend is configured
    if (resend) {
      try {
        // Send confirmation email to customer
        await resend.emails.send({
          from: 'booking@excursia.com',
          to: bookingData.email,
          subject: `Your Excursia Booking Confirmation: ${excursion.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0a85d1;">Booking Confirmation</h1>
              <p>Dear ${bookingData.fullName},</p>
              <p>Thank you for booking with Excursia! Your reservation for <strong>${excursion.title}</strong> has been confirmed.</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Booking Details:</h3>
                <p><strong>Excursion:</strong> ${excursion.title}</p>
                <p><strong>Date:</strong> ${new Date(bookingData.arrivalDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${bookingData.arrivalTime}</p>
                <p><strong>Guests:</strong> ${bookingData.adults} adults, ${bookingData.children} children</p>
                <p><strong>Location:</strong> ${excursion.location}</p>
              </div>
              
              <p>If you have any questions, please contact us at <a href="mailto:info@excursia.com">info@excursia.com</a> or call us at +1 (809) 555-1234.</p>
              
              <p>We look forward to seeing you soon!</p>
              <p>The Excursia Team</p>
            </div>
          `,
        })

        // Send notification email to business
        await resend.emails.send({
          from: 'booking@excursia.com',
          to: process.env.BUSINESS_EMAIL || 'info@excursia.com',
          subject: `New Booking: ${excursion.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0a85d1;">New Booking Received</h1>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Booking Details:</h3>
                <p><strong>Excursion:</strong> ${excursion.title}</p>
                <p><strong>Customer:</strong> ${bookingData.fullName}</p>
                <p><strong>Email:</strong> ${bookingData.email}</p>
                <p><strong>Phone:</strong> ${bookingData.phone}</p>
                <p><strong>Date:</strong> ${new Date(bookingData.arrivalDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${bookingData.arrivalTime}</p>
                <p><strong>Guests:</strong> ${bookingData.adults} adults, ${bookingData.children} children</p>
                ${bookingData.message ? `<p><strong>Additional Information:</strong> ${bookingData.message}</p>` : ''}
              </div>
              
              <p>Please confirm this booking with the customer as soon as possible.</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Continue with the booking process even if email fails
      }
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create booking' },
      { status: 500 },
    )
  }
}
