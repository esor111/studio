
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
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dev.kaha.com.np/exp-backend/api/:path*', // Proxy to DEPLOYED server
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'development'
      ? 'https://dev.kaha.com.np/exp-backend' // Remote backend in dev as well
      : 'https://dev.kaha.com.np/exp-backend', // Production URL
  },
};

export default nextConfig;
