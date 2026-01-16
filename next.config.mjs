/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
