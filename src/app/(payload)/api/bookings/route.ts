import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    // Get booking data from request
    const bookingData = await req.json()

    // Initialize Payload
    const payload = await getPayload()

    // Create booking in database
    const booking = await payload.create({
      collection: 'bookings',
      data: bookingData,
    })

    // Get excursion details
    const excursion = await payload.findByID({
      collection: 'excursions',
      id: bookingData.excursion,
    })

    // Send email notifications
    if (process.env.RESEND_API_KEY) {
      // Email to customer
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'no-reply@excursia.com',
        to: bookingData.email,
        subject: `Booking Confirmation - ${excursion.title}`,
        html: `
          <h1>Thank you for your booking!</h1>
          <p>Dear ${bookingData.fullName},</p>
          <p>We have received your booking for ${excursion.title}.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Date: ${new Date(bookingData.arrivalDate).toLocaleDateString()}</li>
            <li>Time: ${bookingData.arrivalTime}</li>
            <li>Adults: ${bookingData.adults}</li>
            <li>Children: ${bookingData.children}</li>
          </ul>
          <p>We will contact you shortly to confirm your booking.</p>
          <p>Thank you for choosing Excursia!</p>
        `,
      })

      // Email to admin
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'no-reply@excursia.com',
        to: process.env.ADMIN_EMAIL || 'admin@excursia.com',
        subject: `New Booking - ${excursion.title}`,
        html: `
          <h1>New Booking Received</h1>
          <p><strong>Excursion:</strong> ${excursion.title}</p>
          <p><strong>Customer:</strong> ${bookingData.fullName}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          <p><strong>Phone:</strong> ${bookingData.phone}</p>
          <p><strong>Date:</strong> ${new Date(bookingData.arrivalDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${bookingData.arrivalTime}</p>
          <p><strong>Adults:</strong> ${bookingData.adults}</p>
          <p><strong>Children:</strong> ${bookingData.children}</p>
          ${bookingData.message ? `<p><strong>Message:</strong> ${bookingData.message}</p>` : ''}
        `,
      })
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
