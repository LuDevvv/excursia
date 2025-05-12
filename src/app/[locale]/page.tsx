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
import mockExcursions from 'data/mockExcursions'

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
  // const excursions = (await getExcursions()) as Excursion[]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="w-full flex-grow">
        <HeroBanner videoSrc="https://videos.pexels.com/video-files/13505086/13505086-hd_1920_1080_30fps.mp4" />

        <section id="excursions" className="py-20">
          <ExcursionSection excursions={mockExcursions} />
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
      </main>

      <Footer />
    </div>
  )
}
