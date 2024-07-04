/** @type {import('next').NextConfig} */

import withPwa from 'next-pwa'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

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

export default withPwa({
  dest: 'public'
})(nextConfig);
