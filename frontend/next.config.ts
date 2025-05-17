import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static site generation
  output: 'standalone',
  // Enable image optimization
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  // Enable page caching
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Enable compression
  compress: true,
  // Enable production source maps
  productionBrowserSourceMaps: false,
};

export default nextConfig;
