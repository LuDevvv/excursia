import { Resend } from 'resend'
import { Excursion } from '@/payload-types'
import { Booking } from '@/lib/types/booking'

const BUSINESS_INFO = {
  name: 'Media Life',
  email: process.env.BUSINESS_EMAIL || 'info@medialife.com',
  phone: '+1 (809) 555-1234',
  address: '123 Beach Road, Punta Cana, Dominican Republic',
  website: 'https://medialife.com',
}

interface EmailResult {
  success: boolean
  customerEmailId?: string | null
  businessEmailId?: string | null
  error?: {
    message: string
    type: string
  }
}

export class BookingEmailService {
  private resend?: Resend

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured - emails will not be sent')
      return
    }

    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendBookingConfirmation(booking: Booking, excursion: Excursion): Promise<EmailResult> {
    if (!this.resend) {
      console.warn('⚠️ Resend not configured - skipping email send')
      return {
        success: false,
        error: { message: 'Email service not configured', type: 'EMAIL_CONFIG_ERROR' },
      }
    }

    try {
      console.log('📧 Sending booking confirmation emails...', {
        customerEmail: booking.email,
        excursionTitle: excursion.title,
      })

      // Parallel email sending for better performance
      const [customerResult, businessResult] = await Promise.allSettled([
        this.sendCustomerEmail(booking, excursion),
        this.sendBusinessEmail(booking, excursion),
      ])

      // Check results
      const customerSuccess = customerResult.status === 'fulfilled'
      const businessSuccess = businessResult.status === 'fulfilled'

      if (!customerSuccess && !businessSuccess) {
        throw new Error('Both customer and business emails failed')
      }

      // Log any failures
      if (!customerSuccess) {
        console.error('❌ Customer email failed:', customerResult.reason)
      }
      if (!businessSuccess) {
        console.error('❌ Business email failed:', businessResult.reason)
      }

      return {
        success: true,
        customerEmailId: customerSuccess
          ? (customerResult.value as { data?: { id?: string } }).data?.id
          : null,
        businessEmailId: businessSuccess
          ? (businessResult.value as { data?: { id?: string } }).data?.id
          : null,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Email sending error:', {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      })

      return {
        success: false,
        error: {
          message: errorMessage,
          type: 'EMAIL_ERROR',
        },
      }
    }
  }

  private async sendCustomerEmail(booking: Booking, excursion: Excursion) {
    if (!this.resend) throw new Error('Resend not configured')

    return this.resend.emails.send({
      from: process.env.EMAIL_FROM || `${BUSINESS_INFO.name} <booking@medialife.com>`,
      to: booking.email,
      replyTo: BUSINESS_INFO.email,
      subject: `✅ Booking Confirmed: ${excursion.title}`,
      html: this.createCustomerEmailTemplate(booking, excursion),
    })
  }

  private async sendBusinessEmail(booking: Booking, excursion: Excursion) {
    if (!this.resend) throw new Error('Resend not configured')

    return this.resend.emails.send({
      from: process.env.EMAIL_FROM || `${BUSINESS_INFO.name} <booking@medialife.com>`,
      to: BUSINESS_INFO.email,
      replyTo: booking.email,
      subject: `🎉 New Booking: ${excursion.title} - ${booking.fullName}`,
      html: this.createBusinessEmailTemplate(booking, excursion),
    })
  }

  private createCustomerEmailTemplate(booking: Booking, excursion: Excursion): string {
    const excursionImage = this.getExcursionImage(excursion)
    const bookingDate = this.formatDate(booking.arrivalDate)
    const bookingTime = this.formatTime(booking.arrivalTime)

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Booking Confirmation - ${this.sanitizeHTML(excursion.title)}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, #0a85d1 0%, #fdaa33 100%);padding:40px 20px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:32px;font-weight:bold;">🎉 Booking Confirmed!</h1>
                  <p style="margin:15px 0 0;font-size:18px;opacity:0.95;">Thank you for choosing ${BUSINESS_INFO.name}</p>
                </td>
              </tr>

              ${
                excursionImage
                  ? `
              <!-- Excursion Image -->
              <tr>
                <td style="padding:0;">
                  <img src="${this.sanitizeHTML(excursionImage)}" alt="${this.sanitizeHTML(excursion.title)}" style="width:100%;height:220px;object-fit:cover;"/>
                </td>
              </tr>
              `
                  : ''
              }

              <!-- Content -->
              <tr>
                <td style="padding:40px 30px;">
                  <h2 style="margin:0 0 20px;color:#0a85d1;font-size:26px;">Hello ${this.sanitizeHTML(booking.fullName)}! 👋</h2>
                  <p style="margin:0 0 25px;color:#374151;line-height:1.7;font-size:16px;">
                    Your booking for <strong style="color:#0a85d1;">${this.sanitizeHTML(excursion.title)}</strong> has been confirmed! 
                    We're thrilled to have you join us for this incredible Dominican Republic adventure.
                  </p>

                  <!-- Booking Details Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);border-radius:12px;margin:25px 0;border:1px solid #e2e8f0;">
                    <tr>
                      <td style="padding:25px;">
                        <h3 style="margin:0 0 20px;color:#0a85d1;font-size:20px;">📋 Booking Details</h3>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${this.createDetailRow('🏝️ Excursion', excursion.title)}
                          ${this.createDetailRow('📍 Location', excursion.location)}
                          ${this.createDetailRow('📅 Date', bookingDate)}
                          ${this.createDetailRow('🕐 Time', bookingTime)}
                          ${this.createDetailRow('👥 Guests', `${booking.adults} adults${booking.children > 0 ? `, ${booking.children} children` : ''}`)}
                          ${excursion.duration ? this.createDetailRow('⏱️ Duration', excursion.duration) : ''}
                          ${this.createDetailRow('💰 Price', `$${excursion.price}`, '#fdaa33', 'bold')}
                        </table>
                      </td>
                    </tr>
                  </table>

                  ${
                    booking.message
                      ? `
                  <!-- Customer Message -->
                  <div style="margin:25px 0;padding:20px;background-color:#f0f8ff;border-radius:10px;border-left:4px solid #0a85d1;">
                    <h4 style="margin:0 0 10px;color:#0a85d1;font-size:16px;">💬 Your Message:</h4>
                    <p style="margin:0;color:#374151;font-style:italic;">"${this.sanitizeHTML(booking.message)}"</p>
                  </div>
                  `
                      : ''
                  }

                  <!-- Contact Information -->
                  <div style="background-color:#f8fafc;padding:25px;border-radius:10px;margin:25px 0;text-align:center;">
                    <h4 style="margin:0 0 15px;color:#0a85d1;font-size:18px;">📞 Contact Information</h4>
                    <p style="margin:5px 0;color:#374151;">
                      📱 <a href="tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}" style="color:#0a85d1;text-decoration:none;">${BUSINESS_INFO.phone}</a>
                    </p>
                    <p style="margin:5px 0;color:#374151;">
                      ✉️ <a href="mailto:${BUSINESS_INFO.email}" style="color:#0a85d1;text-decoration:none;">${BUSINESS_INFO.email}</a>
                    </p>
                  </div>

                  <p style="margin:25px 0 0;color:#374151;line-height:1.7;text-align:center;font-size:16px;">
                    Have questions? We're here to help make your experience perfect! 🌟
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#0a85d1;padding:25px;text-align:center;color:#ffffff;">
                  <p style="margin:0;font-size:18px;font-weight:bold;">Thank you for choosing ${BUSINESS_INFO.name}! 🏝️</p>
                  <p style="margin:10px 0 0;font-size:14px;opacity:0.9;">Creating unforgettable Dominican Republic memories</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  }

  private createBusinessEmailTemplate(booking: Booking, excursion: Excursion): string {
    const bookingDate = this.formatDate(booking.arrivalDate)
    const bookingTime = this.formatTime(booking.arrivalTime)
    const totalGuests = booking.adults + booking.children

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Booking Alert - ${this.sanitizeHTML(excursion.title)}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, #059669 0%, #0a85d1 100%);padding:30px 20px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:28px;font-weight:bold;">🎉 New Booking Alert!</h1>
                  <p style="margin:10px 0 0;font-size:16px;opacity:0.95;">${this.sanitizeHTML(excursion.title)}</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:30px;">
                  
                  <!-- Customer Information -->
                  <div style="margin-bottom:30px;">
                    <h3 style="margin:0 0 20px;color:#059669;font-size:20px;">👤 Customer Information</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-radius:10px;padding:20px;">
                      ${this.createDetailRow('👤 Name', booking.fullName)}
                      ${this.createDetailRow('📧 Email', `<a href="mailto:${booking.email}" style="color:#059669;text-decoration:none;">${booking.email}</a>`)}
                      ${this.createDetailRow('📱 Phone', `<a href="tel:${booking.phone}" style="color:#059669;text-decoration:none;">${booking.phone}</a>`)}
                    </table>
                  </div>

                  <!-- Booking Details -->
                  <div style="margin-bottom:30px;">
                    <h3 style="margin:0 0 20px;color:#0a85d1;font-size:20px;">📋 Booking Details</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f9ff;border-radius:10px;padding:20px;">
                      ${this.createDetailRow('🏝️ Excursion', excursion.title)}
                      ${this.createDetailRow('📍 Location', excursion.location)}
                      ${this.createDetailRow('📅 Date', bookingDate)}
                      ${this.createDetailRow('🕐 Time', bookingTime)}
                      ${this.createDetailRow('👥 Adults', booking.adults.toString())}
                      ${this.createDetailRow('👶 Children', booking.children.toString())}
                      ${this.createDetailRow('🎫 Total Guests', totalGuests.toString())}
                      ${this.createDetailRow('💰 Price per Person', `$${excursion.price}`)}
                    </table>
                  </div>

                  ${
                    booking.message
                      ? `
                  <!-- Customer Message -->
                  <div style="margin-bottom:30px;">
                    <h3 style="margin:0 0 20px;color:#7c3aed;font-size:20px;">💬 Customer Message</h3>
                    <div style="background-color:#faf5ff;padding:20px;border-radius:10px;">
                      <p style="margin:0;color:#374151;line-height:1.6;">"${this.sanitizeHTML(booking.message)}"</p>
                    </div>
                  </div>
                  `
                      : ''
                  }

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8fafc;padding:20px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#6b7280;">
                    Booking received: ${new Date().toLocaleString('en-US', {
                      timeZone: 'America/Santo_Domingo',
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })} (Santo Domingo Time)
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  }

  private createDetailRow(
    label: string,
    value: string,
    color = '#374151',
    weight = 'normal',
  ): string {
    return `
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-weight:500;width:35%;">${label}:</td>
        <td style="padding:8px 0;color:${color};font-weight:${weight};">${value}</td>
      </tr>
    `
  }

  private getExcursionImage(excursion: Excursion): string | null {
    if (typeof excursion.image === 'object' && excursion.image?.url) {
      return excursion.image.url
    }
    return null
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  private formatTime(time: string): string {
    const [hour, minute] = time.split(':').map(Number)

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

  private sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}

export const bookingEmailService = new BookingEmailService()
