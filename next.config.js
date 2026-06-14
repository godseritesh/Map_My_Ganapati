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
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig