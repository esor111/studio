
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Proxy to mock server
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:9002' // URL of the Next.js app itself
      : 'https://your-production-url.com', // Replace with your production URL
  },
};

export default nextConfig;
