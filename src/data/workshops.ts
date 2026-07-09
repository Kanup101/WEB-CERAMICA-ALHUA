import type { Workshop } from "@/types/workshop";

export const workshops: Workshop[] = [
  {
    id: "w-001",
    slug: "iniciacion-ceramica-en-casa",
    title: "Iniciacion a la ceramica en casa",
    subtitle: "Primeras piezas, calma y tecnica desde cero.",
    description:
      "Un taller online para conocer arcillas, herramientas simples y tecnicas manuales sin necesitar torno.",
    priceARS: 42000,
    priceUSD: 48,
    duration: "4 encuentros de 90 minutos",
    modality: "Online en vivo + grabaciones",
    level: "Inicial",
    image: "/images/workshops/iniciacion.svg",
    includes: ["Guia PDF", "Lista de proveedores", "Acompanamiento por grupo privado"],
    materialsNeeded: ["Arcilla de baja o alta temperatura", "Estecas basicas", "Esponja", "Palo de amasar"],
    featured: true,
    availableSpots: 12,
  },
  {
    id: "w-002",
    slug: "esmaltes-paleta-natural",
    title: "Esmaltes y paleta natural",
    subtitle: "Color, superficie y pruebas con criterio artesanal.",
    description:
      "Aprende a planificar pruebas de esmalte, registrar resultados y construir una paleta coherente.",
    priceARS: 56000,
    priceUSD: 62,
    duration: "3 encuentros de 2 horas",
    modality: "Online en vivo",
    level: "Intermedio",
    image: "/images/workshops/esmaltes.svg",
    includes: ["Planilla de registro", "Clase de revision", "Biblioteca de referencias"],
    materialsNeeded: ["Piezas bizcochadas", "Esmaltes o pigmentos", "Pinceles", "Cuaderno de pruebas"],
    featured: true,
    availableSpots: 8,
  },
  {
    id: "w-003",
    slug: "piezas-utilitarias-con-identidad",
    title: "Piezas utilitarias con identidad",
    subtitle: "Disenar objetos cotidianos con lenguaje propio.",
    description:
      "Una experiencia para crear una mini coleccion utilitaria: taza, plato y cuenco con coherencia visual.",
    priceARS: 68000,
    priceUSD: 75,
    duration: "5 encuentros de 90 minutos",
    modality: "Online con devoluciones",
    level: "Inicial a intermedio",
    image: "/images/workshops/utilitarias.svg",
    includes: ["Devolucion personalizada", "Mapa de coleccion", "Checklist de terminaciones"],
    materialsNeeded: ["Arcilla", "Herramientas manuales", "Tablilla de madera", "Esmaltes a eleccion"],
    featured: false,
    availableSpots: 6,
  },
];

export function getWorkshopBySlug(slug: string) {
  return workshops.find((workshop) => workshop.slug === slug);
}
