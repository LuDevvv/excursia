import { CollectionConfig } from 'payload'

export const Excursions: CollectionConfig = {
  slug: 'excursions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'price', 'active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'duration',
      type: 'text',
      localized: true,
    },
    {
      name: 'languages',
      type: 'array',
      fields: [
        {
          name: 'language',
          type: 'text',
        },
      ],
    },
    {
      name: 'pickup',
      type: 'text',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
