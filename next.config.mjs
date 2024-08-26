// Importa el plugin de Next.js para PWA
const withPWA = require('next-pwa')({
  dest: 'public', // El destino donde se generarán los archivos relacionados con PWA
  register: true, // Registra el Service Worker automáticamente
  skipWaiting: true, // Habilita el Service Worker inmediatamente
  disable: process.env.NODE_ENV === 'development', // Desactiva PWA en modo desarrollo
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false,
  compress: true,
  // Otras configuraciones adicionales pueden ir aquí
});

export default nextConfig;
