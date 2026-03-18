/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ];
  },
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
