import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the local phone preview to load Next's development runtime and HMR.
  allowedDevOrigins: ["192.168.100.7"],
};

export default nextConfig;
