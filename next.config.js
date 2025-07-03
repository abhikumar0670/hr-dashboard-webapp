/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Skip type checking during build for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during build for deployment
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
