import { Resend } from 'resend'
import { Booking, Excursion } from '@/payload-types'

const BUSINESS_INFO = {
  name: 'Media Life',
  email: process.env.BUSINESS_EMAIL || 'info@medialife.com',
  phone: '+1 (809) 555-1234',
  address: '123 Beach Road, Punta Cana, Dominican Republic',
}

export class BookingEmailService {
  private resend: Resend

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendBookingConfirmation(booking: Booking, excursion: Excursion) {
    try {
      // Send confirmation email to customer
      const customerResult = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'booking@medialifee.com',
        to: booking.email,
        replyTo: BUSINESS_INFO.email,
        subject: `Booking Confirmation: ${excursion.title}`,
        html: this.createCustomerEmailTemplate(booking, excursion),
      })

      // Send notification email to business
      const businessResult = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'booking@medialifee.com',
        to: BUSINESS_INFO.email,
        replyTo: booking.email,
        subject: `New Booking: ${excursion.title} - ${booking.fullName}`,
        html: this.createBusinessEmailTemplate(booking, excursion),
      })

      return {
        success: true,
        customerEmailId: customerResult.data?.id,
        businessEmailId: businessResult.data?.id,
      }
    } catch (error: any) {
      console.error('❌ Email sending error:', {
        error: error.message,
        timestamp: new Date().toISOString(),
      })

      return {
        success: false,
        error: {
          message: error.message,
          type: 'EMAIL_ERROR',
        },
      }
    }
  }

  private createCustomerEmailTemplate(booking: Booking, excursion: Excursion): string {
    const excursionImage =
      typeof excursion.image === 'object' && excursion.image?.url ? excursion.image.url : ''

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Booking Confirmation - ${this.sanitizeHTML(excursion.title)}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f9f9f9;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0a85d1 0%, #fdaa33 100%);padding:30px 20px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:28px;font-weight:bold;">Booking Confirmed!</h1>
                  <p style="margin:10px 0 0;font-size:16px;opacity:0.9;">Thank you for choosing Media Life</p>
                </td>
              </tr>

              <!-- Excursion Image -->
              ${
                excursionImage
                  ? `
              <tr>
                <td style="padding:0;">
                  <img src="${this.sanitizeHTML(excursionImage)}" alt="${this.sanitizeHTML(excursion.title)}" style="width:100%;height:200px;object-fit:cover;"/>
                </td>
              </tr>
              `
                  : ''
              }

              <!-- Body -->
              <tr>
                <td style="padding:30px 20px;">
                  <h2 style="margin:0 0 20px;color:#0a85d1;font-size:24px;">Dear ${this.sanitizeHTML(booking.fullName)},</h2>
                  <p style="margin:0 0 20px;color:#333;line-height:1.6;">
                    Your booking for <strong>${this.sanitizeHTML(excursion.title)}</strong> has been confirmed! We're excited to have you join us for this amazing adventure.
                  </p>

                  <!-- Booking Details Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:8px;margin:20px 0;">
                    <tr>
                      <td style="padding:20px;">
                        <h3 style="margin:0 0 15px;color:#0a85d1;font-size:18px;">Booking Details</h3>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="30%" style="padding:8px 0;color:#666;font-weight:500;">Excursion:</td>
                            <td style="padding:8px 0;color:#333;font-weight:600;">${this.sanitizeHTML(excursion.title)}</td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;color:#666;font-weight:500;">Location:</td>
                            <td style="padding:8px 0;color:#333;">${this.sanitizeHTML(excursion.location)}</td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;color:#666;font-weight:500;">Date:</td>
                            <td style="padding:8px 0;color:#333;font-weight:600;">${this.formatDate(booking.arrivalDate)}</td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;color:#666;font-weight:500;">Time:</td>
                            <td style="padding:8px 0;color:#333;font-weight:600;">${this.formatTime(booking.arrivalTime)}</td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;color:#666;font-weight:500;">Guests:</td>
                            <td style="padding:8px 0;color:#333;">${booking.adults} adults${booking.children > 0 ? `, ${booking.children} children` : ''}</td>
                          </tr>
                          ${
                            excursion.duration
                              ? `
                          <tr>
                            <td style="padding:8px 0;color:#666;font-weight:500;">Duration:</td>
                            <td style="padding:8px 0;color:#333;">${this.sanitizeHTML(excursion.duration)}</td>
                          </tr>
                          `
                              : ''
                          }
                          <tr>
                            <td style="padding:8px 0;color:#666;font-weight:500;">Price:</td>
                            <td style="padding:8px 0;color:#fdaa33;font-weight:bold;font-size:18px;">$${excursion.price}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  ${
                    booking.message
                      ? `
                  <div style="margin:20px 0;">
                    <h4 style="margin:0 0 10px;color:#0a85d1;">Your Message:</h4>
                    <div style="background-color:#f0f8ff;padding:15px;border-radius:6px;border-left:4px solid #0a85d1;">
                      ${this.sanitizeHTML(booking.message)}
                    </div>
                  </div>
                  `
                      : ''
                  }

                  <!-- Important Information -->
                  <div style="background-color:#fff3cd;border:1px solid #ffeaa7;border-radius:6px;padding:15px;margin:20px 0;">
                    <h4 style="margin:0 0 10px;color:#856404;">Important Information:</h4>
                    <ul style="margin:0;padding-left:20px;color:#856404;">
                      <li>Please arrive 15 minutes before your scheduled time</li>
                      <li>Bring comfortable clothing and sunscreen</li>
                      <li>Don't forget your camera for amazing photos!</li>
                      <li>For cancellations, contact us at least 24 hours in advance</li>
                    </ul>
                  </div>

                  <p style="margin:20px 0 0;color:#333;line-height:1.6;">
                    If you have any questions or need to make changes to your booking, please don't hesitate to contact us.
                  </p>
                </td>
              </tr>

              <!-- Contact Information -->
              <tr>
                <td style="background-color:#f8f9fa;padding:20px;border-top:1px solid #e9ecef;">
                  <h4 style="margin:0 0 15px;color:#0a85d1;">Contact Information:</h4>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:5px 0;color:#666;">📞 Phone:</td>
                      <td style="padding:5px 0;color:#333;">
                        <a href="tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}" style="color:#0a85d1;text-decoration:none;">
                          ${BUSINESS_INFO.phone}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:5px 0;color:#666;">✉️ Email:</td>
                      <td style="padding:5px 0;color:#333;">
                        <a href="mailto:${BUSINESS_INFO.email}" style="color:#0a85d1;text-decoration:none;">
                          ${BUSINESS_INFO.email}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:5px 0;color:#666;">📍 Address:</td>
                      <td style="padding:5px 0;color:#333;">${BUSINESS_INFO.address}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#0a85d1;padding:20px;text-align:center;color:#ffffff;">
                  <p style="margin:0;font-size:16px;font-weight:bold;">Thank you for choosing Media Life!</p>
                  <p style="margin:5px 0 0;font-size:14px;opacity:0.9;">We look forward to making your Dominican Republic experience unforgettable.</p>
                  <p style="margin:15px 0 0;font-size:12px;opacity:0.8;">
                    Booking sent: ${new Date().toLocaleString('en-US', {
                      timeZone: 'America/Santo_Domingo',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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

  private createBusinessEmailTemplate(booking: Booking, excursion: Excursion): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Booking - ${this.sanitizeHTML(excursion.title)}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f9f9f9;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color:#0a85d1;padding:20px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:24px;">🎉 New Booking Received!</h1>
                  <p style="margin:5px 0 0;font-size:16px;opacity:0.9;">${this.sanitizeHTML(excursion.title)}</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px 20px;">
                  
                  <!-- Customer Information -->
                  <div style="margin-bottom:25px;">
                    <h3 style="margin:0 0 15px;color:#0a85d1;font-size:18px;border-bottom:2px solid #f0f8ff;padding-bottom:5px;">Customer Information</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:6px;padding:15px;">
                      <tr>
                        <td width="25%" style="padding:5px 0;color:#666;font-weight:500;">Name:</td>
                        <td style="padding:5px 0;color:#333;font-weight:600;">${this.sanitizeHTML(booking.fullName)}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Email:</td>
                        <td style="padding:5px 0;color:#333;">
                          <a href="mailto:${this.sanitizeHTML(booking.email)}" style="color:#0a85d1;text-decoration:none;">
                            ${this.sanitizeHTML(booking.email)}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Phone:</td>
                        <td style="padding:5px 0;color:#333;">
                          <a href="tel:${this.sanitizeHTML(booking.phone)}" style="color:#0a85d1;text-decoration:none;">
                            ${this.sanitizeHTML(booking.phone)}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Booking Details -->
                  <div style="margin-bottom:25px;">
                    <h3 style="margin:0 0 15px;color:#0a85d1;font-size:18px;border-bottom:2px solid #f0f8ff;padding-bottom:5px;">Booking Details</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:6px;padding:15px;">
                      <tr>
                        <td width="25%" style="padding:5px 0;color:#666;font-weight:500;">Excursion:</td>
                        <td style="padding:5px 0;color:#333;font-weight:600;">${this.sanitizeHTML(excursion.title)}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Location:</td>
                        <td style="padding:5px 0;color:#333;">${this.sanitizeHTML(excursion.location)}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Date:</td>
                        <td style="padding:5px 0;color:#333;font-weight:600;">${this.formatDate(booking.arrivalDate)}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Time:</td>
                        <td style="padding:5px 0;color:#333;font-weight:600;">${this.formatTime(booking.arrivalTime)}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Adults:</td>
                        <td style="padding:5px 0;color:#333;">${booking.adults}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Children:</td>
                        <td style="padding:5px 0;color:#333;">${booking.children}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Total Guests:</td>
                        <td style="padding:5px 0;color:#333;font-weight:600;">${booking.adults + booking.children}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Price:</td>
                        <td style="padding:5px 0;color:#fdaa33;font-weight:bold;font-size:16px;">$${excursion.price}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#666;font-weight:500;">Status:</td>
                        <td style="padding:5px 0;">
                          <span style="background-color:#fff3cd;color:#856404;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:500;">
                            ${booking.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  ${
                    booking.message
                      ? `
                  <div style="margin-bottom:25px;">
                    <h3 style="margin:0 0 15px;color:#0a85d1;font-size:18px;border-bottom:2px solid #f0f8ff;padding-bottom:5px;">Customer Message</h3>
                    <div style="background-color:#f0f8ff;padding:15px;border-radius:6px;border-left:4px solid #0a85d1;">
                      ${this.sanitizeHTML(booking.message)}
                    </div>
                  </div>
                  `
                      : ''
                  }

                  <!-- Action Items -->
                  <div style="background-color:#d4edda;border:1px solid #c3e6cb;border-radius:6px;padding:15px;margin:20px 0;">
                    <h4 style="margin:0 0 10px;color:#155724;">📋 Action Required:</h4>
                    <ul style="margin:0;padding-left:20px;color:#155724;">
                      <li>Confirm booking with customer within 2 hours</li>
                      <li>Send pickup details and meeting point information</li>
                      <li>Add to schedule and assign guide if needed</li>
                      <li>Check equipment and transportation requirements</li>
                    </ul>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8f9fa;padding:15px;text-align:center;border-top:1px solid #e9ecef;">
                  <p style="margin:0;font-size:12px;color:#666;">
                    Booking received: ${new Date().toLocaleString('en-US', {
                      timeZone: 'America/Santo_Domingo',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })} (Santo Domingo Time)
                  </p>
                  <p style="margin:5px 0 0;font-size:12px;color:#666;">
                    Booking ID: #${booking.id} | Customer Email: ${this.sanitizeHTML(booking.email)}
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
    const [hour, minute] = time.split(':')
    const hourNum = parseInt(hour)

    if (hourNum === 0) {
      return `12:${minute} AM`
    } else if (hourNum < 12) {
      return `${hourNum}:${minute} AM`
    } else if (hourNum === 12) {
      return `12:${minute} PM`
    } else {
      return `${hourNum - 12}:${minute} PM`
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
