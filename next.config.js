/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        // Cloudinary CDN – used for all team portraits and gallery images
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
