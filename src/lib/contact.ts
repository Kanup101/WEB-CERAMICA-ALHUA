import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { Workshop } from "@/types/workshop";
import { formatARS } from "@/lib/utils";

export const contactInfo = {
  whatsappPhone: "5493874669134",
  phoneDisplay: "+54 9 387 4669134",
  whatsappLabel: "WhatsApp",
  email: "yaninacardozo03@gmail.com",
  instagramHandle: "Instagram pendiente de confirmar",
  instagramUrl: "",
  location: "Argentina",
};

export function whatsappHref(message = "Hola Yanina, quiero hacer una consulta.") {
  return `https://wa.me/${contactInfo.whatsappPhone}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(product: Product) {
  return `Hola Yanina, quiero consultar por la pieza "${product.name}" (${product.category}). Precio publicado: ${formatARS(product.priceARS)}.`;
}

export function workshopWhatsAppMessage(workshop: Workshop) {
  return `Hola Yanina, quiero consultar o reservar un lugar en el taller "${workshop.title}". Modalidad: ${workshop.modality}. Precio publicado: ${formatARS(workshop.priceARS)}.`;
}

export function checkoutWhatsAppMessage(items: CartItem[], totalARS: number) {
  if (!items.length) {
    return "Hola Yanina, quiero consultar por una compra.";
  }

  const summary = items
    .map((item) => `${item.quantity} x ${item.product.name}`)
    .join(", ");

  return `Hola Yanina, quiero finalizar mi compra. Seleccion: ${summary}. Total publicado: ${formatARS(totalARS)}.`;
}
