import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Excursion } from '@/payload-types'
import HeroBanner from '@/components/HeroBanner'
import ExcursionSection from '@/components/sections/ExcursionSection'
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection'
import FAQSection from '@/components/sections/FAQSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

async function getExcursions() {
  try {
    // Corregimos el llamado a getPayload proporcionando el argumento requerido
    const payload = await getPayload({
      config: configPromise,
    })

    const { docs: excursions } = await payload.find({
      collection: 'excursions',
      where: {
        active: {
          equals: true,
        },
      },
      limit: 100,
    })

    return excursions
  } catch (error) {
    console.error('Error fetching excursions:', error)
    return []
  }
}

export default async function Home() {
  const excursions = (await getExcursions()) as Excursion[]

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}

      {/* <main className="flex-grow">
        <HeroBanner />

        <section id="excursions" className="py-20">
          <ExcursionSection excursions={excursions} />
        </section>

        <section id="why-choose-us" className="py-20 bg-gray-50">
          <WhyChooseUsSection />
        </section>

        <section id="faq" className="py-20">
          <FAQSection />
        </section>

        <section id="contact" className="py-20 bg-gray-50">
          <ContactSection />
        </section>
      </main> */}

      {/* <Footer /> */}

      <h1>HELLO WORLD</h1>
    </div>
  )
}
