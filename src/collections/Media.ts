import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'Media',
    description: 'Manage images and media files',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: '../public/media',

    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 200,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 85,
          },
        },
      },
      {
        name: 'hero',
        width: 1200,
        height: 675,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 90,
          },
        },
      },
      {
        name: 'gallery',
        width: 800,
        height: 600,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 85,
          },
        },
      },
    ],

    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.alt && data.filename) {
          data.alt = data.filename
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (letter: string) => letter.toUpperCase())
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        placeholder: 'Describe this image for accessibility...',
        description: 'Alt text is important for accessibility and SEO',
      },
      validate: (value: any, { data }: any) => {
        if (!value || typeof value !== 'string' || value.length < 3) {
          return 'Alt text must be at least 3 characters long'
        }
        if (value.length > 125) {
          return 'Alt text should be under 125 characters for optimal accessibility'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      admin: {
        placeholder: 'Optional caption for the image...',
        description: 'Caption text that may be displayed below the image',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Excursion Photos', value: 'excursion' },
        { label: 'Location Images', value: 'location' },
        { label: 'Activity Photos', value: 'activity' },
        { label: 'Hero Images', value: 'hero' },
        { label: 'Gallery', value: 'gallery' },
        { label: 'Icons & Graphics', value: 'graphics' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'excursion',
      admin: {
        description: 'Categorize this media for better organization',
      },
    },
    {
      name: 'tags',
      type: 'text',
      admin: {
        placeholder: 'beach, adventure, snorkeling (comma-separated)',
        description: 'Add tags to help organize and search media files',
      },
    },
    {
      name: 'photographer',
      type: 'text',
      admin: {
        placeholder: 'Photographer or source credit',
        description: 'Attribution for the image source',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        placeholder: 'Where was this photo taken?',
        description: 'Geographic location of the image',
      },
    },
    {
      name: 'dateCreated',
      type: 'date',
      admin: {
        description: 'When was this photo taken?',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: {
            placeholder: 'SEO title for this image',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
          localized: true,
          admin: {
            placeholder: 'SEO description for this image',
          },
        },
      ],
    },
  ],
}
