import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Excursion } from '@/payload-types'
import HeroBanner from '@/components/HeroBanner'
import ExcursionSection from '@/components/sections/ExcursionSection'
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection'
import FAQSection from '@/components/sections/FAQSection'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

async function getExcursions(): Promise<Excursion[]> {
  try {
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
      sort: ['-publishedAt'],
      limit: 12,
      depth: 2,
    })

    return excursions as Excursion[]
  } catch (error) {
    console.error('Error fetching excursions:', error)
    return []
  }
}

export default async function Home() {
  const excursions = await getExcursions()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="w-full flex-grow">
        <HeroBanner
          videoSrc="https://videos.pexels.com/video-files/13505086/13505086-hd_1920_1080_30fps.mp4"
          posterSrc="https://plus.unsplash.com/premium_photo-1682390303366-7463dcbec281?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <ExcursionSection excursions={excursions} />
        <WhyChooseUsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
