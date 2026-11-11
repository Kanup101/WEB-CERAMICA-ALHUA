import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { Workshop } from "@/types/workshop";
import type { Experience } from "@/types/experience";
import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n/messages";

export const contactInfo = {
  whatsappPhone: "5493874669134",
  phoneDisplay: "+54 9 387 4669134",
  whatsappLabel: "WhatsApp",
  email: "yaninacardozo03@gmail.com",
  instagramHandle: "Instagram pendiente de confirmar",
  instagramUrl: "",
  location: "Argentina",
};

export function whatsappHref(message: string) {
  return `https://wa.me/${contactInfo.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

export function experienceWhatsAppMessage(experience: Experience, locale: Locale = "es") {
  return getTranslator(locale)("Hola Yanina, vi la experiencia {title}, en {location}, por {price} por persona. Quisiera consultar fechas disponibles y cómo reservar. ¡Gracias!", { title: experience.title, location: experience.location, price: formatMoney(experience.priceUSD, "USD", locale) });
}

export function productWhatsAppMessage(product: Product, locale: Locale = "es") {
  const t = getTranslator(locale);
  return t("Consulta de producto: {name}. Categoría: {category}. Precio publicado: {price}.", { name: product.name, category: t(product.category), price: formatMoney(product.priceARS, "ARS", locale) });
}

export function workshopWhatsAppMessage(workshop: Workshop, locale: Locale = "es") {
  return getTranslator(locale)("Consulta de taller: {title}. Modalidad: {modality}. Precio publicado: {price}. Quiero consultar disponibilidad y cómo reservar.", { title: workshop.title, modality: workshop.modality, price: formatMoney(workshop.priceARS, "ARS", locale) });
}

export function checkoutWhatsAppMessage(items: CartItem[], totalARS: number, locale: Locale = "es") {
  const t = getTranslator(locale);
  if (!items.length) {
    return t("Hola Yanina, quiero consultar por una compra.");
  }

  const summary = items
    .map((item) => `${item.quantity} x ${item.product.name}`)
    .join(", ");

  return t("Hola Yanina, quiero finalizar mi compra. Selección: {summary}. Total publicado: {total}.", { summary, total: formatMoney(totalARS, "ARS", locale) });
}
