import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'comet.faw.cymru',
        pathname: '/resources/images/**',
      },
    ],
  },
};

export default nextConfig;
