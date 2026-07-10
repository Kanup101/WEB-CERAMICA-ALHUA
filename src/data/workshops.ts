import type { Workshop } from "@/types/workshop";

export const workshops: Workshop[] = [
  {
    id: "w-001",
    slug: "ceramica-en-casa-desde-cero",
    title: "Ceramica en casa desde cero",
    subtitle: "Primeras piezas, herramientas simples y una practica posible.",
    description:
      "Un taller online para comenzar con tecnicas manuales, entender la arcilla y crear piezas pequenas sin necesidad de torno.",
    priceARS: 48000,
    priceUSD: 54,
    duration: "4 encuentros de 90 minutos",
    modality: "Online en vivo + grabaciones por 30 dias",
    level: "Inicial",
    image: "/images/products/barro-2.webp",
    includes: ["Guia PDF paso a paso", "Lista de proveedores en Argentina", "Acompanamiento por grupo privado"],
    materialsNeeded: ["Arcilla de baja o alta temperatura", "Estecas basicas", "Esponja", "Palo de amasar", "Bolsa plastica para conservar humedad"],
    featured: true,
    availableSpots: 12,
  },
  {
    id: "w-002",
    slug: "paleta-natural-esmaltes",
    title: "Paleta natural de esmaltes",
    subtitle: "Color, registro y pruebas para construir una identidad visual.",
    description:
      "Aprende a planificar pruebas de esmalte, documentar resultados y desarrollar una paleta coherente para piezas utilitarias o decorativas.",
    priceARS: 62000,
    priceUSD: 69,
    duration: "3 encuentros de 2 horas",
    modality: "Online en vivo con clase de revision",
    level: "Intermedio",
    image: "/images/products/obra-5.webp",
    includes: ["Planilla de registro", "Clase de devolucion grupal", "Biblioteca de referencias visuales"],
    materialsNeeded: ["Piezas bizcochadas", "Esmaltes o pigmentos", "Pinceles", "Cuaderno de pruebas", "Muestras de arcilla"],
    featured: true,
    availableSpots: 8,
  },
  {
    id: "w-003",
    slug: "coleccion-utilitaria-con-identidad",
    title: "Coleccion utilitaria con identidad",
    subtitle: "Disena una mini serie de taza, plato y cuenco con lenguaje propio.",
    description:
      "Una experiencia guiada para pensar forma, uso, repeticion artesanal y terminaciones dentro de una coleccion pequena y coherente.",
    priceARS: 74000,
    priceUSD: 82,
    duration: "5 encuentros de 90 minutos",
    modality: "Online en vivo + devoluciones personalizadas",
    level: "Inicial a intermedio",
    image: "/images/products/taza-biblioteca-1.webp",
    includes: ["Mapa de coleccion", "Checklist de terminaciones", "Devolucion personalizada de piezas"],
    materialsNeeded: ["Arcilla", "Herramientas manuales", "Tablilla de madera", "Esmaltes a eleccion", "Regla y cuaderno"],
    featured: false,
    availableSpots: 6,
  },
];

export function getWorkshopBySlug(slug: string) {
  return workshops.find((workshop) => workshop.slug === slug);
}
