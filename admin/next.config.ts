import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"res.cloudinary.com"
      },
      {
        protocol:"https",
        hostname:"images.pexels.com"
      }
    ]
  }
};

export default nextConfig;
