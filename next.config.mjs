import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization for domains you might use
  images: {
    domains: ['localhost', 'your-production-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Improve bundling for production
  swcMinify: true,

  // Customize the output directory
  distDir: '.next',

  // Configure redirects if needed
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: true,
      },
    ]
  },

  // Define custom webpack configuration if needed
  webpack(config) {
    return config
  },
}

// Apply both the Next-Intl plugin and the Payload plugin
export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
