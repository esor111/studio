
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
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kaha-assets-dev.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/battle/:path*',
        destination: 'http://localhost:3000/api/:path*', // Battle system backend
      },
      {
        source: '/api/:path*',
        destination: 'https://dev.kaha.com.np/exp-backend/api/:path*', // Proxy to DEPLOYED server
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'development'
      ? 'https://dev.kaha.com.np/exp-backend' // Original backend for dashboard/topics
      : 'https://dev.kaha.com.np/exp-backend', // Production URL
    NEXT_PUBLIC_ACTIVITY_API_URL: process.env.NODE_ENV === 'development'
      ? 'https://dev.kaha.com.np/exp-backend/api' // Activity backend API
      : 'https://dev.kaha.com.np/exp-backend/api', // Production activity API URL
    NEXT_PUBLIC_BATTLE_API_URL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api' // Battle system backend
      : 'http://localhost:3000/api', // Production battle API URL
  },
};

export default nextConfig;
