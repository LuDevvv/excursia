import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Excursions } from './collections/Excursions'
import { Bookings } from './collections/Bookings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Media Life CMS',
    },
  },
  collections: [Users, Media, Excursions, Bookings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [],
  cors: [
    'http://localhost:3000',
    'https://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    process.env.PAYLOAD_PUBLIC_SITE_URL || '',
  ].filter(Boolean),
  csrf: [
    'http://localhost:3000',
    'https://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    process.env.PAYLOAD_PUBLIC_SITE_URL || '',
  ].filter(Boolean),
  localization: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    fallback: true,
  },
  // Configuración adicional para desarrollo
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
})
