/** @type {import('next').NextConfig} */

const apiUrl = process.env.NEXT_PUBLIC_API_URL

import withPWA from '@ducanh2912/next-pwa'

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
})(nextConfig);
