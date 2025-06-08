import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    description: 'Manage images for excursions',
    defaultColumns: ['alt', 'filename', 'updatedAt'],
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
          options: { quality: 80 },
        },
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options: { quality: 85 },
        },
      },
      {
        name: 'hero',
        width: 1200,
        height: 675,
        crop: 'center',
        formatOptions: {
          format: 'webp',
          options: { quality: 90 },
        },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
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
        placeholder: 'Describe this image...',
        description: 'Important for accessibility and SEO',
      },
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string' || value.length < 3) {
          return 'Alt text must be at least 3 characters long'
        }
        if (value.length > 125) {
          return 'Alt text should be under 125 characters for optimal accessibility'
        }
        return true
      },
    },
  ],
}
