import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function seed() {
  const payload = await getPayload({
    config: configPromise,
  })

  console.log('🌱 Starting database seed...')

  try {
    // Check if excursions already exist
    const { totalDocs } = await payload.find({
      collection: 'excursions',
      limit: 1,
    })

    if (totalDocs > 0) {
      console.log('📊 Excursions already exist, skipping seed.')
      return
    }

    // First, create some sample media files to use as images
    console.log('📸 Creating sample media files...')

    const sampleImages = [
      {
        alt: 'Beautiful Saona Island with pristine white sand beaches',
        category: 'excursion' as const,
        tags: 'beach, island, caribbean, paradise',
        location: 'Saona Island',
        filename: 'saona-island.jpg',
        mimeType: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      },
      {
        alt: 'Off-road buggy adventure through Dominican countryside',
        category: 'activity' as const,
        tags: 'buggy, adventure, offroad, countryside',
        location: 'La Romana',
        filename: 'buggy-adventure.jpg',
        mimeType: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1558618563-bee19394db6d?w=800&h=600&fit=crop',
      },
      {
        alt: 'Luxury catamaran sailing into Caribbean sunset',
        category: 'gallery' as const,
        tags: 'catamaran, sunset, sailing, cruise',
        location: 'Cap Cana',
        filename: 'catamaran-sunset.jpg',
        mimeType: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop',
      },
    ]

    const createdImages = []
    for (const imageData of sampleImages) {
      const image = await payload.create({
        collection: 'media',
        data: imageData,
      })
      createdImages.push(image)
      console.log(`✅ Created media: ${image.alt}`)
    }

    // Create sample excursions with proper image references
    const sampleExcursions = [
      {
        title: 'Saona Island Paradise',
        slug: 'saona-island-paradise',
        location: 'Punta Cana',
        category: 'beach-islands' as const,
        price: 89,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Experience the breathtaking beauty of Saona Island, a tropical paradise located in the eastern part of the Dominican Republic.',
                  },
                ],
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: 'left' as const,
            indent: 0,
            version: 1,
          },
        },
        duration: {
          hours: 9,
          minutes: 0,
          display: 'Full Day (9 hours)',
        },
        languages: [
          { language: 'english' as const, level: 'native' as const },
          { language: 'spanish' as const, level: 'native' as const },
        ],
        transportation: {
          pickup: 'included' as const,
          pickupNote: 'Hotel pickup included from Punta Cana and Bavaro area',
        },
        image: createdImages[0].id,
        active: true,
      },
      {
        title: 'Buggy Adventure Tour',
        slug: 'buggy-adventure-tour',
        location: 'La Romana',
        category: 'adventure' as const,
        price: 65,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Get ready for an adrenaline-pumping off-road adventure through the Dominican countryside.',
                  },
                ],
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: 'left' as const,
            indent: 0,
            version: 1,
          },
        },
        duration: {
          hours: 4,
          minutes: 0,
          display: 'Half Day (4 hours)',
        },
        languages: [
          { language: 'english' as const, level: 'fluent' as const },
          { language: 'spanish' as const, level: 'native' as const },
        ],
        transportation: {
          pickup: 'extra-cost' as const,
          pickupNote: 'Hotel pickup available for additional $15 per person',
        },
        image: createdImages[1].id,
        active: true,
      },
      {
        title: 'Catamaran Sunset Cruise',
        slug: 'catamaran-sunset-cruise',
        location: 'Cap Cana',
        category: 'water-sports' as const,
        price: 75,
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Experience the magic of a Caribbean sunset aboard our luxury catamaran with snorkeling and premium drinks.',
                  },
                ],
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: 'left' as const,
            indent: 0,
            version: 1,
          },
        },
        duration: {
          hours: 3,
          minutes: 30,
          display: 'Afternoon (3.5 hours)',
        },
        languages: [
          { language: 'english' as const, level: 'fluent' as const },
          { language: 'spanish' as const, level: 'native' as const },
        ],
        transportation: {
          pickup: 'included' as const,
          pickupNote: 'Marina pickup included, hotel transportation available',
        },
        image: createdImages[2].id,
        active: true,
      },
    ]

    // Create the excursions
    for (const excursionData of sampleExcursions) {
      const excursion = await payload.create({
        collection: 'excursions',
        data: excursionData,
      })
      console.log(`✅ Created excursion: ${excursion.title}`)
    }

    console.log('🎉 Database seeded successfully!')
    console.log('📝 You can now:')
    console.log('   • Visit http://localhost:3000 to see the frontend')
    console.log('   • Visit http://localhost:3000/admin to manage content')
    console.log('   • Create your first admin user in the admin panel')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Auto-run if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
}
