import type { NextConfig } from "next";
import collectionSettings from "./src/data/collections-settings.json";
import { locales, localizedPath } from "./src/lib/i18n/config";

const nextConfig: NextConfig = {
  // Integration tests run a separate server without touching the developer's build.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Allow the local phone preview to load Next's development runtime and HMR.
  allowedDevOrigins: ["192.168.100.7"],
  async redirects() {
    const paths = Object.entries(collectionSettings).flatMap(([slug, setting]) =>
      "mergeInto" in setting ? [[`/colecciones/${slug}`, `/colecciones/${setting.mergeInto}`]] : [],
    );
    paths.push(["/tienda/vasija-silvadora", "/tienda/soplo-al-sol"]);
    return paths.flatMap(([source, destination]) =>
      [
        { source: `/es${source}`, destination, permanent: true },
        ...locales.map(locale => ({
          source: localizedPath(source, locale),
          destination: localizedPath(destination, locale),
          permanent: true,
        })),
      ],
    );
  },
};

export default nextConfig;
