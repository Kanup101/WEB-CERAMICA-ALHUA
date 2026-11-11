import type { MetadataRoute } from "next";
import { publicPaths, siteOrigin } from "@/lib/i18n/routes";
import { localizedPath, locales } from "@/lib/i18n/config";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  if (!origin) return [];
  return publicPaths.filter(path => path !== "/checkout" && path !== "/sobre-alhua").flatMap(path => locales.map(locale => ({
    url: origin + localizedPath(path, locale),
    alternates: { languages: Object.fromEntries(locales.map(value => [value, origin + localizedPath(path, value)])) },
  })));
}
