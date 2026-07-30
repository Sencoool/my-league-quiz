import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 31536000, // Force Next.js to cache images for 1 year
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth Avatars
      },
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com", // Official LoL Assets (if used)
      },
      {
        protocol: "https",
        hostname: "pub-2155f10520be45d19e6f9c4d36722718.r2.dev", // Cloudflare R2 Public bucket
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com", // GitHub Assets (Default Poro Avatar)
      },
    ],
  },
};

export default nextConfig;
