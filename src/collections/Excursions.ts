import { CollectionConfig } from 'payload'

export const Excursions: CollectionConfig = {
  slug: 'excursions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'price', 'featured', 'active', 'updatedAt'],
    description: 'Manage tour excursions and activities',
    listSearchableFields: ['title', 'location'],
    pagination: {
      defaultLimit: 20,
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { active: { equals: true } }
      return true
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.updatedAt = new Date().toISOString()
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        placeholder: 'e.g., Saona Island Paradise Tour',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        placeholder: 'e.g., Punta Cana, Saona Island',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        placeholder: '99.00',
        description: 'Price in USD per person',
        step: 0.01,
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Detailed description of the excursion',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      localized: true,
      admin: {
        description: 'Brief description for cards (max 200 chars)',
        placeholder: 'Experience the pristine beaches of Saona Island...',
      },
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        placeholder: 'e.g., Full Day (8 hours), Half Day (4 hours)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main featured image',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      maxRows: 10,
      admin: {
        description: 'Additional images (optional)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
          admin: {
            placeholder: 'Image caption (optional)',
          },
        },
      ],
    },

    // Simple Settings
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Available for booking',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return new Date().toISOString()
            }
            return value
          },
        ],
      },
    },
  ],
}
