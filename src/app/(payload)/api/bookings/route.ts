import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { bookingEmailService } from '@/services/bookingEmailService'
import { BookingSchema } from '@/lib/types/booking'
import { Excursion } from '@/payload-types'

export async function POST(req: Request) {
  try {
    // Validar datos
    const requestData = await req.json()
    const validationResult = BookingSchema.safeParse(requestData)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Datos de reserva inválidos',
            details: validationResult.error.errors,
          },
        },
        { status: 400 },
      )
    }

    const bookingData = validationResult.data

    // Obtener excursión
    const payload = await getPayload({ config: configPromise })
    let excursion: Excursion

    try {
      excursion = (await payload.findByID({
        collection: 'excursions',
        id: bookingData.excursion,
      })) as Excursion
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Excursión no encontrada' },
        },
        { status: 404 },
      )
    }

    // Verificar que la excursión esté activa
    if (!excursion.active) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Esta excursión no está disponible actualmente' },
        },
        { status: 400 },
      )
    }

    // Enviar email
    const emailResult = await bookingEmailService.sendBookingConfirmation(bookingData, excursion)

    if (!emailResult.success) {
      console.warn('⚠️ Error enviando email:', emailResult.error)
      return NextResponse.json(
        {
          success: true, // Aún consideramos exitoso
          emailSent: false,
          message: 'Reserva confirmada. El email de confirmación puede llegar con retraso.',
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        emailSent: true,
        message: '¡Reserva confirmada exitosamente!',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('❌ Error crítico en booking API:', error)
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Error al procesar la reserva' },
      },
      { status: 500 },
    )
  }
}
