import { Excursion } from '@/payload-types'

export const mockExcursions: Excursion[] = [
  {
    id: 1,
    title: 'Saona Island Paradise',
    location: 'Punta Cana',
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
    duration: '9 hours',
    languages: [
      { language: 'English', id: 'en-1' },
      { language: 'Spanish', id: 'es-1' },
      { language: 'German', id: 'de-1' },
      { language: 'French', id: 'fr-1' },
    ],
    pickup: 'Hotel pickup included',
    image: {
      id: 101,
      alt: 'Saona Island beach with palm trees',
      filename: 'saona-island.jpg',
      url: 'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1600,
      height: 900,
      createdAt: '2023-01-10T08:15:00Z',
      updatedAt: '2023-05-15T10:30:00Z',
    },
    gallery: [
      {
        id: 'g1-1',
        image: {
          id: 201,
          alt: 'Catamaran to Saona Island',
          filename: 'saona-catamaran.jpg',
          url: 'https://images.pexels.com/photos/258009/pexels-photo-258009.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-01-10T08:15:00Z',
          updatedAt: '2023-05-15T10:30:00Z',
        },
      },
      {
        id: 'g1-2',
        image: {
          id: 202,
          alt: 'Natural swimming pool',
          filename: 'natural-pool.jpg',
          url: 'https://images.pexels.com/photos/251832/pexels-photo-251832.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-01-10T08:15:00Z',
          updatedAt: '2023-05-15T10:30:00Z',
        },
      },
      {
        id: 'g1-3',
        image: {
          id: 203,
          alt: 'Beach lunch buffet',
          filename: 'beach-buffet.jpg',
          url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-01-10T08:15:00Z',
          updatedAt: '2023-05-15T10:30:00Z',
        },
      },
    ],
    active: true,
    createdAt: '2023-01-10T08:15:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Buggy Adventure',
    location: 'La Romana',
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
    duration: '4 hours',
    languages: [
      { language: 'English', id: 'en-2' },
      { language: 'Spanish', id: 'es-2' },
    ],
    pickup: 'Hotel pickup available for an additional fee',
    image: {
      id: 102,
      alt: 'Off-road buggy in action',
      filename: 'buggy-adventure.jpg',
      url: 'https://images.pexels.com/photos/137023/pexels-photo-137023.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1600,
      height: 900,
      createdAt: '2023-02-05T09:30:00Z',
      updatedAt: '2023-06-20T14:45:00Z',
    },
    gallery: [
      {
        id: 'g2-1',
        image: {
          id: 204,
          alt: 'Buggies ready for tour',
          filename: 'buggies-lineup.jpg',
          url: 'https://images.pexels.com/photos/132355/pexels-photo-132355.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-02-05T09:30:00Z',
          updatedAt: '2023-06-20T14:45:00Z',
        },
      },
      {
        id: 'g2-2',
        image: {
          id: 205,
          alt: 'Natural cenote for swimming',
          filename: 'cenote.jpg',
          url: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-02-05T09:30:00Z',
          updatedAt: '2023-06-20T14:45:00Z',
        },
      },
    ],
    active: true,
    createdAt: '2023-02-05T09:30:00Z',
    updatedAt: '2023-06-20T14:45:00Z',
  },
  {
    id: 1,
    title: 'Saona Island Paradise',
    location: 'Punta Cana',
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
    duration: '9 hours',
    languages: [
      { language: 'English', id: 'en-1' },
      { language: 'Spanish', id: 'es-1' },
      { language: 'German', id: 'de-1' },
      { language: 'French', id: 'fr-1' },
    ],
    pickup: 'Hotel pickup included',
    image: {
      id: 101,
      alt: 'Saona Island beach with palm trees',
      filename: 'saona-island.jpg',
      url: 'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1600,
      height: 900,
      createdAt: '2023-01-10T08:15:00Z',
      updatedAt: '2023-05-15T10:30:00Z',
    },
    gallery: [
      {
        id: 'g1-1',
        image: {
          id: 201,
          alt: 'Catamaran to Saona Island',
          filename: 'saona-catamaran.jpg',
          url: 'https://images.pexels.com/photos/258009/pexels-photo-258009.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-01-10T08:15:00Z',
          updatedAt: '2023-05-15T10:30:00Z',
        },
      },
      {
        id: 'g1-2',
        image: {
          id: 202,
          alt: 'Natural swimming pool',
          filename: 'natural-pool.jpg',
          url: 'https://images.pexels.com/photos/251832/pexels-photo-251832.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-01-10T08:15:00Z',
          updatedAt: '2023-05-15T10:30:00Z',
        },
      },
      {
        id: 'g1-3',
        image: {
          id: 203,
          alt: 'Beach lunch buffet',
          filename: 'beach-buffet.jpg',
          url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-01-10T08:15:00Z',
          updatedAt: '2023-05-15T10:30:00Z',
        },
      },
    ],
    active: true,
    createdAt: '2023-01-10T08:15:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Buggy Adventure',
    location: 'La Romana',
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
    duration: '4 hours',
    languages: [
      { language: 'English', id: 'en-2' },
      { language: 'Spanish', id: 'es-2' },
    ],
    pickup: 'Hotel pickup available for an additional fee',
    image: {
      id: 102,
      alt: 'Off-road buggy in action',
      filename: 'buggy-adventure.jpg',
      url: 'https://images.pexels.com/photos/137023/pexels-photo-137023.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 1600,
      height: 900,
      createdAt: '2023-02-05T09:30:00Z',
      updatedAt: '2023-06-20T14:45:00Z',
    },
    gallery: [
      {
        id: 'g2-1',
        image: {
          id: 204,
          alt: 'Buggies ready for tour',
          filename: 'buggies-lineup.jpg',
          url: 'https://images.pexels.com/photos/132355/pexels-photo-132355.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-02-05T09:30:00Z',
          updatedAt: '2023-06-20T14:45:00Z',
        },
      },
      {
        id: 'g2-2',
        image: {
          id: 205,
          alt: 'Natural cenote for swimming',
          filename: 'cenote.jpg',
          url: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=400',
          width: 1200,
          height: 800,
          createdAt: '2023-02-05T09:30:00Z',
          updatedAt: '2023-06-20T14:45:00Z',
        },
      },
    ],
    active: true,
    createdAt: '2023-02-05T09:30:00Z',
    updatedAt: '2023-06-20T14:45:00Z',
  },
]

export default mockExcursions
