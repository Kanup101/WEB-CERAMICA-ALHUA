import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { Workshop } from "@/types/workshop";
import { formatARS } from "@/lib/utils";

export const contactInfo = {
  // TODO: reemplazar por el numero real de WhatsApp de Alhua antes de publicar.
  whatsappPhone: "5491100000000",
  whatsappLabel: "WhatsApp",
  email: "hola@alhua.com",
  instagramHandle: "@alhua.ceramica",
  instagramUrl: "https://instagram.com/alhua.ceramica",
  location: "Argentina",
};

export function whatsappHref(message = "Hola Alhua, quiero hacer una consulta.") {
  return `https://wa.me/${contactInfo.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(product: Product) {
  return `Hola Alhua, quiero consultar por la pieza "${product.name}" (${product.category}). Precio publicado: ${formatARS(product.priceARS)}.`;
}

export function workshopWhatsAppMessage(workshop: Workshop) {
  return `Hola Alhua, quiero consultar o reservar un lugar en el taller "${workshop.title}". Modalidad: ${workshop.modality}. Precio publicado: ${formatARS(workshop.priceARS)}.`;
}

export function checkoutWhatsAppMessage(items: CartItem[], totalARS: number) {
  if (!items.length) {
    return "Hola Alhua, quiero consultar por una compra.";
  }

  const summary = items
    .map((item) => `${item.quantity} x ${item.product.name}`)
    .join(", ");

  return `Hola Alhua, quiero finalizar mi compra. Seleccion: ${summary}. Total publicado: ${formatARS(totalARS)}.`;
}
