/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/qr', destination: '/', permanent: true },
    ];
  },
  images: {
    domains: ['jetgotravel.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jetgotravel.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
