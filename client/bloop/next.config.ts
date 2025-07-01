import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true, // 👈 important pour avoir les vraies lignes d’erreur en prod
  // Tu peux aussi désactiver les optimisations extrêmes pendant le dev si besoin
  compiler: {
    removeConsole: false
  }
};

export default nextConfig;
