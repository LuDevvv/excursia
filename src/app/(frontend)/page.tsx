import { getPayload } from 'payload'
import { Excursion } from '@/payload-types'
import HeroBanner from '@/components/HeroBanner'
import ExcursionCard from '@/components/ExcursionCard'
import PageLayout from '@/components/PageLayout'
import { useTranslations } from 'next-intl'

export const dynamic = 'force-dynamic'

async function getExcursions() {
  // @ts-ignore - Ignore the TypeScript error
  const payload = await getPayload()

  const { docs: excursions } = await payload.find({
    collection: 'excursions' as any,
    where: {
      active: {
        equals: true,
      },
    },
    limit: 100,
  })

  return excursions
}

export default async function Home() {
  const excursions = (await getExcursions()) as Excursion[]
  const t = useTranslations('homepage')

  return (
    <PageLayout>
      <HeroBanner />

      <div id="content" className="pt-20">
        {/* Excursions Section */}
        <section id="excursions" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{t('excursionsTitle')}</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              {t('excursionsSubtitle')}
            </p>

            {excursions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {excursions.map((excursion) => (
                  <ExcursionCard key={excursion.id} excursion={excursion} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t('noExcursions')}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
