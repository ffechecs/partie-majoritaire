/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        // NEXT_PUBLIC_SERVER_URL=https://api.pm.ffechecs.fr
        // destination: "https://api.pm.ffechecs.fr/:path*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
