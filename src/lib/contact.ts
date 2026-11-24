import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { Workshop } from "@/types/workshop";
import type { Experience } from "@/types/experience";
import type { Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n/messages";
import { getProducts } from "@/data/products";
import { cartTotalUSD, reconcileCart } from "@/lib/cart";

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
  if (product.priceUSD === null) {
    return t("Consulta de producto: {name}. Quisiera confirmar el precio y la disponibilidad.", { name: product.name });
  }
  return t("Consulta de producto: {name}. Categoría: {category}. Precio publicado: {price}.", { name: product.name, category: t(product.category), price: formatMoney(product.priceUSD, "USD", locale) });
}

export function workshopWhatsAppMessage(workshop: Workshop, locale: Locale = "es") {
  return getTranslator(locale)("Consulta de taller: {title}. Modalidad: {modality}. Precio publicado: {price}. Quiero consultar disponibilidad y cómo reservar.", { title: workshop.title, modality: workshop.modality, price: formatMoney(workshop.priceARS, "ARS", locale) });
}

export function checkoutWhatsAppMessage(items: CartItem[], locale: Locale = "es") {
  const t = getTranslator(locale);
  const selection = reconcileCart(items, getProducts(locale));
  if (!selection.length) return null;

  const summary = selection
    .map(({ product, quantity }) => `${quantity} x ${product.name} (${formatMoney(product.priceUSD * quantity, "USD", locale)})`)
    .join(", ");

  return t("Hola Yanina, quiero finalizar mi compra. Selección: {summary}. Total publicado: {total}.", { summary, total: formatMoney(cartTotalUSD(selection), "USD", locale) });
}
