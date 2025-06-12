import { Resend } from 'resend'
import { Excursion } from '@/payload-types'
import { Booking } from '@/lib/types/booking'

const AGENT_INFO = {
  name: 'Media Life',
  phone: '+1 (809) 555-1234',
  photoUrl:
    'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=300&h=300&fit=crop&crop=face',
}

export class BookingEmailService {
  private resend: Resend

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurada')
    }
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendBookingConfirmation(booking: Booking, excursion: Excursion) {
    try {
      // Verificar que las variables de entorno estén configuradas
      const emailFrom = process.env.EMAIL_FROM
      const emailTo = process.env.EMAIL_TO

      if (!emailFrom || !emailTo) {
        throw new Error('EMAIL_FROM y EMAIL_TO deben estar configuradas')
      }

      const emailPayload = {
        from: emailFrom,
        to: emailTo,
        replyTo: booking.email, // ← El cliente recibe la respuesta automáticamente
        subject: `Nueva Reserva - ${booking.fullName} - ${excursion.title}`,
        html: this.createEmailTemplate(booking, excursion),
      }

      const { data: result, error } = await this.resend.emails.send(emailPayload)

      if (error) {
        console.error('❌ Resend API Error:', error)
        return {
          success: false,
          error: {
            message: error.message,
            name: error.name,
          },
        }
      }

      return {
        success: true,
        data: result,
      }
    } catch (err) {
      const error = err as Error
      console.error('❌ Error crítico:', error)
      return {
        success: false,
        error: {
          message: error.message || 'Error desconocido',
          type: 'CRITICAL_ERROR',
        },
      }
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
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

  private createEmailTemplate(booking: Booking, excursion: Excursion): string {
    const hasMessage = booking.message && booking.message.trim().length > 0
    const formattedTime = this.formatTime(booking.arrivalTime)
    const formattedDate = this.formatDate(booking.arrivalDate)
    const excursionImage =
      typeof excursion.image === 'object' && excursion.image?.url
        ? excursion.image.url
        : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Nueva Reserva – ${this.sanitizeHTML(AGENT_INFO.name)}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f9f9f9;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, #0a85d1 0%, #fdaa33 100%);padding:20px;text-align:center;color:#ffffff;">
                  <h1 style="margin:0;font-size:24px;">🎉 Nueva Reserva de Excursión</h1>
                  <p style="margin:5px 0 0;">Para: ${this.sanitizeHTML(AGENT_INFO.name)}</p>
                </td>
              </tr>

              <!-- Excursion Image -->
              <tr>
                <td style="padding:0;">
                  <img src="${this.sanitizeHTML(excursionImage)}" alt="${this.sanitizeHTML(excursion.title)}" style="width:100%;height:200px;object-fit:cover;"/>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <!-- Agent info -->
                      <td width="30%" style="vertical-align:top;padding-right:15px;">
                        <img src="${this.sanitizeHTML(AGENT_INFO.photoUrl)}" alt="${this.sanitizeHTML(AGENT_INFO.name)}" style="width:100%;border-radius:8px;"/>
                        <p style="margin:10px 0 0;font-size:14px;color:#333;text-align:center;">
                          <strong>${this.sanitizeHTML(AGENT_INFO.name)}</strong><br/>
                          ${this.sanitizeHTML(AGENT_INFO.phone)}
                        </p>
                      </td>
                      
                      <!-- Booking details -->
                      <td width="70%" style="vertical-align:top;font-size:14px;color:#333;">
                        <h3 style="margin:0 0 15px;color:#0a85d1;">🏝️ ${this.sanitizeHTML(excursion.title)}</h3>
                        
                        <div style="background-color:#f8fafc;padding:15px;border-radius:8px;margin-bottom:15px;">
                          <h4 style="margin:0 0 10px;color:#0a85d1;">👤 Datos del Cliente</h4>
                          <p style="margin:5px 0;"><strong>Nombre:</strong> ${this.sanitizeHTML(booking.fullName)}</p>
                          <p style="margin:5px 0;"><strong>Email:</strong> <a href="mailto:${this.sanitizeHTML(booking.email)}" style="color:#0a85d1;text-decoration:none;">${this.sanitizeHTML(booking.email)}</a></p>
                          <p style="margin:5px 0;"><strong>Teléfono:</strong> <a href="tel:${this.sanitizeHTML(booking.phone)}" style="color:#0a85d1;text-decoration:none;">${this.sanitizeHTML(booking.phone)}</a></p>
                        </div>

                        <div style="background-color:#f0f9ff;padding:15px;border-radius:8px;">
                          <h4 style="margin:0 0 10px;color:#0a85d1;">📋 Detalles de la Reserva</h4>
                          <p style="margin:5px 0;"><strong>📍 Ubicación:</strong> ${this.sanitizeHTML(excursion.location)}</p>
                          <p style="margin:5px 0;"><strong>📅 Fecha:</strong> ${formattedDate}</p>
                          <p style="margin:5px 0;"><strong>🕐 Hora:</strong> ${formattedTime}</p>
                          <p style="margin:5px 0;"><strong>👥 Huéspedes:</strong> ${booking.adults} adultos${booking.children > 0 ? `, ${booking.children} niños` : ''}</p>
                          <p style="margin:5px 0;"><strong>💰 Precio:</strong> ${excursion.price} por persona</p>
                        </div>

                        ${
                          hasMessage
                            ? `
                        <div style="margin-top:15px;">
                          <h4 style="margin:0 0 10px;color:#0a85d1;">💬 Mensaje del Cliente</h4>
                          <div style="background-color:#faf5ff;padding:10px;border-radius:4px;border-left:4px solid #0a85d1;">
                            ${this.sanitizeHTML(booking.message || '')}
                          </div>
                        </div>
                        `
                            : ''
                        }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f4f4f4;padding:15px;text-align:center;font-size:12px;color:#777;">
                  <p style="margin:0;">Media Life - Excursiones en República Dominicana</p>
                  <p style="margin:5px 0 0;">Enviado: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Santo_Domingo' })}</p>
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

  private sanitizeHTML(input: string): string {
    if (!input) return ''
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}

export const bookingEmailService = new BookingEmailService()
