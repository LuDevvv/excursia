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

    // Create sample excursions
    const sampleExcursions = [
      {
        title: 'Saona Island Paradise',
        slug: 'saona-island-paradise',
        location: 'Punta Cana',
        category: 'beach-islands',
        price: 89,
        priceInfo: {
          currency: 'USD',
          childDiscount: 50,
          groupDiscount: 15,
        },
        shortDescription:
          'Experience the breathtaking beauty of Saona Island with pristine beaches and crystal clear waters.',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Experience the breathtaking beauty of Saona Island, a tropical paradise located in the eastern part of the Dominican Republic. This full-day excursion takes you to pristine white sandy beaches, crystal clear turquoise waters, and natural swimming pools. Enjoy a delicious buffet lunch, open bar, and plenty of time to relax on the beach or explore the island.',
                  },
                ],
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        duration: {
          hours: 9,
          minutes: 0,
          display: 'Full Day (9 hours)',
        },
        schedule: {
          departureTime: '08:00 AM',
          returnTime: '05:00 PM',
          daysAvailable: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
        },
        languages: [
          { language: 'english', level: 'native' },
          { language: 'spanish', level: 'native' },
          { language: 'french', level: 'fluent' },
          { language: 'german', level: 'fluent' },
        ],
        transportation: {
          pickup: 'included',
          pickupNote: 'Hotel pickup included from Punta Cana and Bavaro area',
        },
        capacity: {
          minGuests: 2,
          maxGuests: 50,
        },
        inclusions: {
          included: [
            { item: 'Professional multilingual guide' },
            { item: 'Buffet lunch with fresh seafood' },
            { item: 'Open bar with tropical drinks' },
            { item: 'Round-trip transportation' },
            { item: 'Natural swimming pool visit' },
            { item: 'Beach chairs and umbrellas' },
          ],
          notIncluded: [
            { item: 'Personal expenses and souvenirs' },
            { item: 'Tips for guide and crew' },
            { item: 'Professional photos (available for purchase)' },
          ],
        },
        requirements: {
          ageRestriction: {
            minAge: 0,
            maxAge: 99,
          },
          fitnessLevel: 'easy',
          whatToBring: [
            { item: 'Swimwear and towel' },
            { item: 'Sunscreen and sunglasses' },
            { item: 'Camera for memorable photos' },
            { item: 'Comfortable sandals' },
          ],
        },
        bookingSettings: {
          advanceBooking: 24,
          cancellationPolicy: '24h-free',
        },
        seo: {
          metaTitle: 'Saona Island Full Day Excursion - Excursia',
          metaDescription:
            'Discover the paradise of Saona Island with our full-day excursion. Pristine beaches, natural pools, and unforgettable memories await.',
          keywords: 'saona island, dominican republic, beach excursion, punta cana tours',
        },
        featured: true,
        popular: true,
        active: true,
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'Buggy Adventure Tour',
        slug: 'buggy-adventure-tour',
        location: 'La Romana',
        category: 'adventure',
        price: 65,
        priceInfo: {
          currency: 'USD',
          childDiscount: 30,
          groupDiscount: 10,
        },
        shortDescription:
          'Get your adrenaline pumping with an off-road buggy adventure through the Dominican countryside.',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Get ready for an adrenaline-pumping off-road adventure through the Dominican countryside. Drive your own buggy through scenic trails, mud puddles, and rural villages. Visit a traditional Dominican house, learn about local products like coffee and cacao, and cool off at a natural cenote. This exciting half-day tour is perfect for adventure seekers and nature lovers.',
                  },
                ],
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        duration: {
          hours: 4,
          minutes: 0,
          display: 'Half Day (4 hours)',
        },
        schedule: {
          departureTime: '09:00 AM',
          returnTime: '01:00 PM',
          daysAvailable: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        },
        languages: [
          { language: 'english', level: 'fluent' },
          { language: 'spanish', level: 'native' },
        ],
        transportation: {
          pickup: 'extra-cost',
          pickupNote: 'Hotel pickup available for additional $15 per person',
        },
        capacity: {
          minGuests: 1,
          maxGuests: 20,
        },
        inclusions: {
          included: [
            { item: 'Buggy rental and safety equipment' },
            { item: 'Professional guide' },
            { item: 'Visit to local Dominican house' },
            { item: 'Coffee and cacao tasting' },
            { item: 'Natural cenote swim' },
            { item: 'Safety briefing and training' },
          ],
          notIncluded: [
            { item: 'Hotel pickup and drop-off' },
            { item: 'Lunch and beverages' },
            { item: 'Personal insurance' },
            { item: 'Photos and videos' },
          ],
        },
        requirements: {
          ageRestriction: {
            minAge: 18,
            maxAge: 65,
          },
          fitnessLevel: 'moderate',
          whatToBring: [
            { item: 'Comfortable clothes that can get dirty' },
            { item: 'Closed-toe shoes (mandatory)' },
            { item: 'Swimwear for cenote' },
            { item: 'Change of clothes' },
            { item: "Valid driver's license" },
          ],
        },
        bookingSettings: {
          advanceBooking: 48,
          cancellationPolicy: '48h-free',
        },
        featured: false,
        popular: true,
        active: true,
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'Catamaran Sunset Cruise',
        slug: 'catamaran-sunset-cruise',
        location: 'Cap Cana',
        category: 'water-sports',
        price: 75,
        priceInfo: {
          currency: 'USD',
          childDiscount: 40,
          groupDiscount: 12,
        },
        shortDescription:
          'Sail into the sunset aboard a luxury catamaran with open bar and snorkeling opportunities.',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Experience the magic of a Caribbean sunset aboard our luxury catamaran. This romantic and relaxing cruise includes snorkeling at coral reefs, swimming in crystal-clear waters, and enjoying premium drinks while watching the sun set over the horizon. Perfect for couples, families, and anyone looking to unwind in paradise.',
                  },
                ],
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        duration: {
          hours: 3,
          minutes: 30,
          display: 'Afternoon (3.5 hours)',
        },
        schedule: {
          departureTime: '02:30 PM',
          returnTime: '06:00 PM',
          daysAvailable: ['monday', 'wednesday', 'friday', 'sunday'],
        },
        languages: [
          { language: 'english', level: 'fluent' },
          { language: 'spanish', level: 'native' },
          { language: 'french', level: 'conversational' },
        ],
        transportation: {
          pickup: 'included',
          pickupNote: 'Marina pickup included, hotel transportation available',
        },
        capacity: {
          minGuests: 6,
          maxGuests: 40,
        },
        inclusions: {
          included: [
            { item: 'Luxury catamaran cruise' },
            { item: 'Open bar with premium drinks' },
            { item: 'Snorkeling equipment' },
            { item: 'Professional crew and guide' },
            { item: 'Light snacks and fruit' },
            { item: 'Music and entertainment' },
          ],
          notIncluded: [
            { item: 'Dinner' },
            { item: 'Underwater camera rental' },
            { item: 'Towels (bring your own)' },
          ],
        },
        requirements: {
          ageRestriction: {
            minAge: 8,
            maxAge: 80,
          },
          fitnessLevel: 'easy',
          whatToBring: [
            { item: 'Swimwear' },
            { item: 'Towel' },
            { item: 'Sunscreen' },
            { item: 'Hat and sunglasses' },
            { item: 'Waterproof camera' },
          ],
        },
        bookingSettings: {
          advanceBooking: 24,
          cancellationPolicy: '24h-free',
        },
        featured: true,
        popular: false,
        active: true,
        publishedAt: new Date().toISOString(),
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
