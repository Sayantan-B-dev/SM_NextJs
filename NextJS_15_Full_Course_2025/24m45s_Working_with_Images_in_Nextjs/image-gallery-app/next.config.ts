import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
      {
        protocol: "https",
        hostname: "gratisography.com",
      },
      {
        protocol: "https",
        hostname: "cdn.stocksnap.io",
      },
    ],
  },
};

export default nextConfig;
