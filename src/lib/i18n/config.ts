export const defaultLocale = "es";
export const locales = ["es", "en", "de", "fr", "ko", "zh-CN"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = { es: "Español", en: "English", de: "Deutsch", fr: "Français", ko: "한국어", "zh-CN": "简体中文" };
export const numberLocales: Record<Locale, string> = { es: "es-AR", en: "en-US", de: "de-DE", fr: "fr-FR", ko: "ko-KR", "zh-CN": "zh-CN" };
export const localeCookie = "yanina-locale";
export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
export function unprefixedPath(pathname: string) {
  const parts = pathname.split("/");
  if (isLocale(parts[1] ?? "")) parts.splice(1, 1);
  return parts.join("/") || "/";
}
export function localizedPath(pathname: string, locale: Locale) {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return pathname;
  const path = unprefixedPath(pathname);
  return locale === defaultLocale ? path : `/${locale}${path === "/" ? "" : path}`;
}
export function formatMoney(value: number, currency: "ARS" | "USD", locale: Locale) {
  return new Intl.NumberFormat(numberLocales[locale], { style: "currency", currency, currencyDisplay: "code", maximumFractionDigits: 0 }).format(value);
}
