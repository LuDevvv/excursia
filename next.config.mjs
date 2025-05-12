import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-production-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  distDir: '.next',
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: true,
      },
    ]
  },
  webpack(config) {
    return config
  },
  turbopack: process.env.NODE_ENV === 'development',
}

export default withNextIntl(withPayload(nextConfig, { devBundleServerPackages: false }))
