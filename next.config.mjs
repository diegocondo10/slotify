// Importa el plugin `next-pwa`
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false,
  compress: true,
  async redirects() {
    if (isDev) {
      return [];
    }

    return [
      {
        source: "/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL_SERVER}:path*`,
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  disable: isDev,
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
})(nextConfig);
