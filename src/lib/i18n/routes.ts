import { productRecords, getProductBySlug } from "@/data/products";
import { workshopRecords, getWorkshopBySlug } from "@/data/workshops";
import { experienceRecords, getExperienceBySlug } from "@/data/experiences";
import { getTranslator } from "./messages";
import { localizedPath, locales, type Locale } from "./config";
import type { Metadata } from "next";

export const publicPaths = ["/", "/tienda", "/talleres", "/experiencias", "/sobre-yanina", "/sobre-alhua", "/contacto", "/checkout",
  ...productRecords.map(item => `/tienda/${item.slug}`), ...workshopRecords.map(item => `/talleres/${item.slug}`), ...experienceRecords.map(item => `/experiencias/${item.slug}`)];

export function siteOrigin() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.origin : undefined; } catch { return undefined; }
}

export function routeMetadata(path: string, locale: Locale): Metadata {
  const t = getTranslator(locale);
  let title = t("Ceramica Creativa");
  let description = t("Yanina Cardozo, artista ceramista. Piezas unicas de ceramica artesanal argentina y talleres online de ceramica creativa.");
  if (path.startsWith("/tienda")) { title = t("Tienda"); description = t("Explora piezas unicas de ceramica artesanal argentina creadas por Yanina Cardozo: tazas, cuencos, platos y objetos decorativos hechos a mano."); }
  if (path.startsWith("/talleres")) { title = t("Talleres online"); description = t("Talleres online de ceramica creativa con Yanina Cardozo para aprender tecnicas manuales, esmaltes y piezas utilitarias desde Argentina."); }
  if (path.startsWith("/experiencias")) { title = t("Experiencias de cerámica en Salta"); description = t("Cerámica artesanal y turismo cultural en Salta con Yanina Cardozo. Barro, mates y encuentros: una actividad creativa para turistas, USD 35 por persona."); }
  if (path.startsWith("/sobre-")) { title = t("Sobre Yanina"); description = t("Historia, filosofia y proceso creativo de Yanina Cardozo, artista ceramista dedicada a piezas hechas a mano y talleres online."); }
  if (path === "/contacto") { title = t("Contacto"); description = t("Contacta a Yanina Cardozo por piezas unicas de ceramica artesanal, talleres online, envios y consultas por WhatsApp o Instagram."); }
  if (path === "/checkout") { title = t("Resumen de compra"); description = t("Resumen de compra de Yanina Cardozo. Checkout online proximamente y consultas por WhatsApp para piezas unicas de ceramica artesanal."); }
  const [section, slug] = path.slice(1).split("/");
  if (slug && section === "tienda") { const product = getProductBySlug(slug, locale); if (product) { title = product.name; description = product.description; } }
  if (slug && section === "talleres") { const workshop = getWorkshopBySlug(slug, locale); if (workshop) { title = workshop.title; description = workshop.description; } }
  if (slug && section === "experiencias") { const experience = getExperienceBySlug(slug, locale); if (experience) title = `${experience.title} · ${t("Experiencias de cerámica en Salta")}`; }
  if (!publicPaths.includes(path)) { title = t("Página no encontrada"); description = t("No encontramos esta página. Podés volver al inicio y seguir explorando."); }
  const fullTitle = `${title} | Yanina Cardozo`;
  const origin = siteOrigin();
  const canonicalPath = path === "/sobre-alhua" ? "/sobre-yanina" : path;
  return {
    title: { absolute: fullTitle }, description,
    robots: path === "/checkout" || !publicPaths.includes(path) ? { index: false, follow: true } : undefined,
    alternates: origin ? { canonical: origin + localizedPath(canonicalPath, locale), languages: Object.fromEntries(locales.map(value=>[value, origin + localizedPath(canonicalPath, value)])) } : undefined,
    openGraph: { title: fullTitle, description, type: "website", locale: {es:"es_AR",en:"en_US",de:"de_DE",fr:"fr_FR",ko:"ko_KR","zh-CN":"zh_CN"}[locale], alternateLocale: locales.filter(value=>value!==locale).map(value=>({es:"es_AR",en:"en_US",de:"de_DE",fr:"fr_FR",ko:"ko_KR","zh-CN":"zh_CN"}[value])) },
  };
}
