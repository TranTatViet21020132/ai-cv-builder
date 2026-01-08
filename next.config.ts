import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "byp7e2sezbd7b7ho.public.blob.vercel-storage.com",
      }
    ],
  }
};

export default nextConfig;
