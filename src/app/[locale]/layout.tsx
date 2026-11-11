import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n/messages";
import { I18nProvider } from "@/lib/i18n/provider";
import { CartProvider } from "@/contexts/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale} className="h-full antialiased"><body className="flex min-h-full flex-col">
    <I18nProvider locale={locale} messages={dictionaries[locale]}><CartProvider><Navbar /><main className="flex-1">{children}</main><Footer /></CartProvider></I18nProvider>
  </body></html>;
}
