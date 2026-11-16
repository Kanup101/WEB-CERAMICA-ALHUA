import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Integration tests run a separate server without touching the developer's build.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Allow the local phone preview to load Next's development runtime and HMR.
  allowedDevOrigins: ["192.168.100.7"],
  async redirects() {
    return ["", "/es", "/en", "/de", "/fr", "/ko", "/zh-CN"].map(prefix => ({
      source: `${prefix}/colecciones/pichuda`,
      destination: `${prefix === "/es" ? "" : prefix}/colecciones/pinchuda`,
      permanent: true,
    }));
  },
};

export default nextConfig;
