import { CollectionConfig } from 'payload'

export const Excursions: CollectionConfig = {
  slug: 'excursions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'price', 'active', 'updatedAt'],
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main featured image',
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
        description: 'How long the excursion lasts',
      },
    },
    {
      name: 'languages',
      type: 'array',
      admin: {
        description: 'Languages available for this excursion',
      },
      fields: [
        {
          name: 'language',
          type: 'select',
          required: true,
          options: [
            { label: 'Spanish', value: 'spanish' },
            { label: 'English', value: 'english' },
            { label: 'French', value: 'french' },
            { label: 'German', value: 'german' },
            { label: 'Italian', value: 'italian' },
            { label: 'Portuguese', value: 'portuguese' },
            { label: 'Russian', value: 'russian' },
          ],
        },
        {
          name: 'level',
          type: 'select',
          defaultValue: 'fluent',
          options: [
            { label: 'Fluent', value: 'fluent' },
            { label: 'Basic', value: 'basic' },
            { label: 'Intermediate', value: 'intermediate' },
          ],
        },
      ],
    },
    {
      name: 'pickup',
      type: 'group',
      admin: {
        description: 'Transportation and pickup information',
      },
      fields: [
        {
          name: 'included',
          type: 'select',
          required: true,
          defaultValue: 'included',
          options: [
            { label: 'Hotel pickup included', value: 'included' },
            { label: 'Hotel pickup available (extra cost)', value: 'extra-cost' },
            { label: 'Meet at designated location', value: 'meet-location' },
          ],
        },
        {
          name: 'pickupNote',
          type: 'text',
          localized: true,
          admin: {
            placeholder: 'e.g., Pickup from most hotels in Punta Cana area',
            condition: (data, siblingData) => siblingData?.included !== 'meet-location',
          },
        },
        {
          name: 'meetingPoint',
          type: 'text',
          localized: true,
          admin: {
            placeholder: 'e.g., Marina Cap Cana, Dock 3',
            condition: (data, siblingData) => siblingData?.included === 'meet-location',
          },
        },
      ],
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
