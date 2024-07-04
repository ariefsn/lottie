/** @type {import('next').NextConfig} */

const apiUrl = process.env.NEXT_PUBLIC_API_URL

import withPWA from 'next-pwa'

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  rewrites: async () => {
    return [
      {
        source: '/:path*',
        destination: apiUrl +  '/:path*',
      }
    ]
  }
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
