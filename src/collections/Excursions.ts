import { CollectionConfig } from 'payload'

export const Excursions: CollectionConfig = {
  slug: 'excursions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'price', 'active', 'updatedAt'],
    group: 'Content',
    description: 'Manage tour excursions and activities',
    listSearchableFields: ['title', 'location', 'description'],
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
      ({ data, operation }) => {
        if (operation === 'create' && !data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }

        data.updatedAt = new Date().toISOString()
        return data
      },
    ],
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      admin: {
        placeholder: 'Enter excursion title...',
      },
      validate: (value, { data }) => {
        if (!value || typeof value !== 'string' || value.length < 3) {
          return 'Title must be at least 3 characters long'
        }
        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly version of the title (auto-generated)',
        placeholder: 'excursion-name',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      admin: {
        placeholder: 'e.g., Punta Cana, Saona Island',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Beach & Islands', value: 'beach-islands' },
        { label: 'Adventure Tours', value: 'adventure' },
        { label: 'Cultural Experiences', value: 'cultural' },
        { label: 'Water Sports', value: 'water-sports' },
        { label: 'Nature & Wildlife', value: 'nature' },
        { label: 'City Tours', value: 'city' },
      ],
      admin: {
        description: 'Select the primary category for this excursion',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      index: true,
      admin: {
        placeholder: '0.00',
        description: 'Price in USD per person',
        step: 0.01,
      },
      validate: (value, { data }) => {
        if (typeof value !== 'number' || value <= 0) {
          return 'Price must be greater than 0'
        }
        return true
      },
    },
    {
      name: 'priceInfo',
      type: 'group',
      fields: [
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'USD',
          options: [
            { label: 'USD ($)', value: 'USD' },
            { label: 'EUR (€)', value: 'EUR' },
            { label: 'DOP (RD$)', value: 'DOP' },
          ],
        },
        {
          name: 'childDiscount',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Discount percentage for children (0-100%)',
            placeholder: '50',
          },
        },
        {
          name: 'groupDiscount',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Discount percentage for groups of 10+ (0-100%)',
            placeholder: '15',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Detailed description of the excursion',
      },
      validate: (value, { data }) => {
        if (!value || value.root?.children?.length === 0) {
          return 'Description is required'
        }
        return true
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      localized: true,
      admin: {
        description: 'Brief description for cards and previews (max 200 chars)',
        placeholder: 'A brief exciting description...',
      },
    },
    {
      name: 'duration',
      type: 'group',
      fields: [
        {
          name: 'hours',
          type: 'number',
          min: 0,
          max: 24,
          admin: {
            placeholder: '8',
          },
        },
        {
          name: 'minutes',
          type: 'number',
          min: 0,
          max: 59,
          admin: {
            placeholder: '30',
          },
        },
        {
          name: 'display',
          type: 'text',
          admin: {
            description: 'Human-readable duration (e.g., "Full Day", "8 hours")',
            placeholder: 'Full Day',
          },
        },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      fields: [
        {
          name: 'departureTime',
          type: 'text',
          admin: {
            placeholder: '08:00 AM',
          },
        },
        {
          name: 'returnTime',
          type: 'text',
          admin: {
            placeholder: '05:00 PM',
          },
        },
        {
          name: 'daysAvailable',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
          defaultValue: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
        },
      ],
    },
    {
      name: 'languages',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Languages available for this excursion',
      },
      fields: [
        {
          name: 'language',
          type: 'select',
          required: true,
          options: [
            { label: 'English', value: 'english' },
            { label: 'Spanish', value: 'spanish' },
            { label: 'French', value: 'french' },
            { label: 'German', value: 'german' },
            { label: 'Italian', value: 'italian' },
            { label: 'Portuguese', value: 'portuguese' },
            { label: 'Dutch', value: 'dutch' },
            { label: 'Russian', value: 'russian' },
          ],
        },
        {
          name: 'level',
          type: 'select',
          defaultValue: 'fluent',
          options: [
            { label: 'Native', value: 'native' },
            { label: 'Fluent', value: 'fluent' },
            { label: 'Conversational', value: 'conversational' },
            { label: 'Basic', value: 'basic' },
          ],
        },
      ],
    },
    {
      name: 'transportation',
      type: 'group',
      fields: [
        {
          name: 'pickup',
          type: 'select',
          required: true,
          options: [
            { label: 'Hotel pickup included', value: 'included' },
            { label: 'Hotel pickup available (extra cost)', value: 'extra-cost' },
            { label: 'Meet at location', value: 'meet-location' },
          ],
          defaultValue: 'included',
        },
        {
          name: 'pickupNote',
          type: 'text',
          localized: true,
          admin: {
            placeholder: 'Additional pickup information...',
            condition: (data: any) => data.transportation?.pickup !== 'meet-location',
          },
        },
        {
          name: 'meetingPoint',
          type: 'text',
          localized: true,
          admin: {
            placeholder: 'Exact meeting location...',
            condition: (data: any) => data.transportation?.pickup === 'meet-location',
          },
        },
      ],
    },
    {
      name: 'capacity',
      type: 'group',
      fields: [
        {
          name: 'minGuests',
          type: 'number',
          min: 1,
          defaultValue: 1,
          admin: {
            description: 'Minimum number of guests required',
          },
        },
        {
          name: 'maxGuests',
          type: 'number',
          min: 1,
          admin: {
            description: 'Maximum number of guests allowed',
            placeholder: '50',
          },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main featured image for the excursion',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      minRows: 0,
      maxRows: 20,
      admin: {
        description: 'Additional images for the gallery',
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
      name: 'inclusions',
      type: 'group',
      fields: [
        {
          name: 'included',
          type: 'array',
          admin: {
            description: "What's included in the excursion",
          },
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                placeholder: 'e.g., Professional guide, Lunch, Transportation',
              },
            },
          ],
        },
        {
          name: 'notIncluded',
          type: 'array',
          admin: {
            description: "What's NOT included",
          },
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                placeholder: 'e.g., Personal expenses, Tips, Alcoholic beverages',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'requirements',
      type: 'group',
      fields: [
        {
          name: 'ageRestriction',
          type: 'group',
          fields: [
            {
              name: 'minAge',
              type: 'number',
              min: 0,
              admin: {
                placeholder: '0',
              },
            },
            {
              name: 'maxAge',
              type: 'number',
              min: 0,
              admin: {
                placeholder: '99',
              },
            },
          ],
        },
        {
          name: 'fitnessLevel',
          type: 'select',
          options: [
            { label: 'Easy - Suitable for all ages', value: 'easy' },
            { label: 'Moderate - Basic fitness required', value: 'moderate' },
            { label: 'Challenging - Good fitness required', value: 'challenging' },
            { label: 'Strenuous - Excellent fitness required', value: 'strenuous' },
          ],
        },
        {
          name: 'whatToBring',
          type: 'array',
          fields: [
            {
              name: 'item',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                placeholder: 'e.g., Swimwear, Sunscreen, Comfortable shoes',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'bookingSettings',
      type: 'group',
      fields: [
        {
          name: 'advanceBooking',
          type: 'number',
          min: 0,
          defaultValue: 24,
          admin: {
            description: 'Minimum hours in advance to book',
            placeholder: '24',
          },
        },
        {
          name: 'cancellationPolicy',
          type: 'select',
          options: [
            { label: 'Free cancellation up to 24h before', value: '24h-free' },
            { label: 'Free cancellation up to 48h before', value: '48h-free' },
            { label: 'Free cancellation up to 72h before', value: '72h-free' },
            { label: 'Non-refundable', value: 'non-refundable' },
            { label: 'Custom policy', value: 'custom' },
          ],
          defaultValue: '24h-free',
        },
        {
          name: 'customCancellationPolicy',
          type: 'textarea',
          localized: true,
          admin: {
            condition: (data: any) => data.bookingSettings?.cancellationPolicy === 'custom',
            placeholder: 'Describe your custom cancellation policy...',
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
          admin: {
            placeholder: 'Custom meta title (optional)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
          localized: true,
          admin: {
            placeholder: 'Custom meta description for search engines...',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          localized: true,
          admin: {
            placeholder: 'SEO keywords, separated by commas',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Feature this excursion on the homepage',
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Mark as popular excursion',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Make this excursion available for booking',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value, operation }) => {
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
