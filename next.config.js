/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  images: {
    domains: ['axbamwwxehovtxzpfher.supabase.co']
  }
}

module.exports = nextConfig 