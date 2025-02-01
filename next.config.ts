import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nile-guides-backend-production",
      },
    ],
  },
};

export default nextConfig;
