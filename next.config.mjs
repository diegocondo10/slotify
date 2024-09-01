// Importa el plugin `next-pwa`
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración específica de Next.js
  typescript: {
    ignoreBuildErrors: true, // Configuración de TypeScript
  },
  experimental: {
    serverActions: true, // Características experimentales
  },
  reactStrictMode: false, // Desactiva el modo estricto de React
  compress: true, // Habilita la compresión
};

// Combina la configuración de PWA con la configuración de Next.js
export default withPWA({
  dest: "public",
  disable: false,
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
})(nextConfig);
