import { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'excursion', 'arrivalDate', 'createdAt'],
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'excursion',
      type: 'relationship',
      relationTo: 'excursions',
      required: true,
    },
    {
      name: 'adults',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'children',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'arrivalDate',
      type: 'date',
      required: true,
    },
    {
      name: 'arrivalTime',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'pending',
      required: true,
    },
  ],
}
