/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['supabase.co', 'images.unsplash.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig