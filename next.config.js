/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Only remove in production
  },
};

module.exports = nextConfig;
