"use client";

import { useId } from "react";
import { usePathname } from "next/navigation";
import { isLocale, localeCookie, localeNames, locales, localizedPath } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const id = useId();
  return <label htmlFor={id} className="flex min-w-0 items-center gap-2 text-sm">
    <span className="sr-only">{t("Idioma")}</span>
    <select id={id} value={locale} className="min-h-11 max-w-full rounded-full border border-[#D8C3AA] bg-[#FFF9EF] px-3 py-2 text-[#342A24] focus-visible:outline-2 focus-visible:outline-offset-2" onChange={(event) => {
      const next = event.target.value;
      if (!isLocale(next)) return;
      document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
      try { window.localStorage.setItem(localeCookie, next); } catch { /* Cookie remains authoritative when storage is unavailable. */ }
      window.location.assign(localizedPath(pathname, next) + window.location.search + window.location.hash);
    }}>
      {locales.map(value => <option key={value} value={value} lang={value}>{localeNames[value]}</option>)}
    </select>
  </label>;
}
