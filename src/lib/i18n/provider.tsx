"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { formatMoney, type Locale } from "./config";
import { translator, type Messages } from "./messages";

const I18nContext = createContext<{ locale: Locale; messages: Messages } | null>(null);
export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: ReactNode }) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("I18nProvider is required");
  return { locale: value.locale, t: translator(value.messages), money: (amount: number, currency: "ARS" | "USD" = "ARS") => formatMoney(amount, currency, value.locale) };
}
