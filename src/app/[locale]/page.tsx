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
      sort: ['-featured', '-popular', '-publishedAt'],
      limit: 12,
      depth: 2, // Include related media files
    })

    return excursions as Excursion[]
  } catch (error) {
    console.error('Error fetching excursions:', error)
    return []
  }
}

async function getFeaturedExcursions(): Promise<Excursion[]> {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const { docs: excursions } = await payload.find({
      collection: 'excursions',
      where: {
        and: [
          {
            active: {
              equals: true,
            },
          },
          {
            featured: {
              equals: true,
            },
          },
        ],
      },
      sort: ['-publishedAt'],
      limit: 6,
      depth: 2,
    })

    return excursions as Excursion[]
  } catch (error) {
    console.error('Error fetching featured excursions:', error)
    return []
  }
}

export default async function Home() {
  const [allExcursions, featuredExcursions] = await Promise.all([
    getExcursions(),
    getFeaturedExcursions(),
  ])

  // Use featured excursions if available, otherwise use all excursions
  const displayExcursions = featuredExcursions.length > 0 ? featuredExcursions : allExcursions

  if (allExcursions.length === 0) {
    // Show admin message if no excursions exist
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="w-full flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Media Life CMS</h1>
            <p className="text-gray-600 mb-6">
              No excursions have been created yet. Please access the admin panel to add your first
              excursion.
            </p>
            <a
              href="/admin"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Go to Admin Panel
            </a>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="w-full flex-grow">
        <HeroBanner
          videoSrc="https://videos.pexels.com/video-files/13505086/13505086-hd_1920_1080_30fps.mp4"
          posterSrc="https://plus.unsplash.com/premium_photo-1682390303366-7463dcbec281?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <ExcursionSection excursions={displayExcursions} />
        <WhyChooseUsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
