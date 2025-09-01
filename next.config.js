/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'gtm.edwinlovett.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig