/** @type {import('next').NextConfig} */

// Parse the API base URL so uploads from the backend can be optimised by
// next/image without a hard-coded hostname.
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const apiOrigin = new URL(apiUrl);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiOrigin.protocol.replace(":", ""),
        hostname: apiOrigin.hostname,
        port:     apiOrigin.port,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
