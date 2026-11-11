import type { Workshop } from "@/types/workshop";
import type { Locale } from "@/lib/i18n/config";
import { getTranslator, type MessageKey } from "@/lib/i18n/messages";
type WorkshopContent = { title: MessageKey; subtitle: MessageKey; description: MessageKey; duration: MessageKey; modality: MessageKey; level: MessageKey; introVideoTitle?: MessageKey; introVideoDescription?: MessageKey; includes: MessageKey[]; materialsNeeded: MessageKey[] };
type WorkshopRecord = Omit<Workshop, keyof WorkshopContent> & { content: WorkshopContent };
export const workshopRecords: WorkshopRecord[] = [
  {
    "id": "w-001",
    "slug": "ceramica-en-casa-desde-cero",
    "priceARS": 48000,
    "priceUSD": 54,
    "image": "/images/products/barro-1.webp",
    "videoUrl": "",
    "videoType": "local",
    "videoPoster": "/images/products/barro-1.webp",
    "featured": true,
    "availableSpots": 12,
    "content": {
      "title": "Ceramica en casa desde cero",
      "subtitle": "Primeras piezas, herramientas simples y una practica posible.",
      "description": "Un taller online para comenzar con tecnicas manuales, entender la arcilla y crear piezas pequenas sin necesidad de torno.",
      "duration": "4 encuentros de 90 minutos",
      "modality": "Online en vivo + grabaciones por 30 dias",
      "level": "Inicial",
      "introVideoTitle": "Proximamente: video introductorio del taller",
      "introVideoDescription": "Este espacio quedara disponible para una presentacion breve de Yanina sobre materiales, modalidad y primeras practicas.",
      "includes": [
        "Guia PDF paso a paso",
        "Lista de proveedores en Argentina",
        "Acompanamiento por grupo privado"
      ],
      "materialsNeeded": [
        "Arcilla de baja o alta temperatura",
        "Estecas basicas",
        "Esponja",
        "Palo de amasar",
        "Bolsa plastica para conservar humedad"
      ]
    }
  },
  {
    "id": "w-002",
    "slug": "paleta-natural-esmaltes",
    "priceARS": 62000,
    "priceUSD": 69,
    "image": "/images/products/barro-2.webp",
    "featured": true,
    "availableSpots": 8,
    "content": {
      "title": "Paleta natural de esmaltes",
      "subtitle": "Color, registro y pruebas para construir una identidad visual.",
      "description": "Aprende a planificar pruebas de esmalte, documentar resultados y desarrollar una paleta coherente para piezas utilitarias o decorativas.",
      "duration": "3 encuentros de 2 horas",
      "modality": "Online en vivo con clase de revision",
      "level": "Intermedio",
      "includes": [
        "Planilla de registro",
        "Clase de devolucion grupal",
        "Biblioteca de referencias visuales"
      ],
      "materialsNeeded": [
        "Piezas bizcochadas",
        "Esmaltes o pigmentos",
        "Pinceles",
        "Cuaderno de pruebas",
        "Muestras de arcilla"
      ]
    }
  },
  {
    "id": "w-003",
    "slug": "coleccion-utilitaria-con-identidad",
    "priceARS": 74000,
    "priceUSD": 82,
    "image": "/images/products/paisaje-3.webp",
    "featured": false,
    "availableSpots": 6,
    "content": {
      "title": "Coleccion utilitaria con identidad",
      "subtitle": "Disena una mini serie de taza, plato y cuenco con lenguaje propio.",
      "description": "Una experiencia guiada para pensar forma, uso, repeticion artesanal y terminaciones dentro de una coleccion pequena y coherente.",
      "duration": "5 encuentros de 90 minutos",
      "modality": "Online en vivo + devoluciones personalizadas",
      "level": "Inicial a intermedio",
      "includes": [
        "Mapa de coleccion",
        "Checklist de terminaciones",
        "Devolucion personalizada de piezas"
      ],
      "materialsNeeded": [
        "Arcilla",
        "Herramientas manuales",
        "Tablilla de madera",
        "Esmaltes a eleccion",
        "Regla y cuaderno"
      ]
    }
  }
];
export function getWorkshops(locale: Locale): Workshop[] {
 const t = getTranslator(locale);
 return workshopRecords.map(({content,...shared})=>({...shared,title:t(content.title),subtitle:t(content.subtitle),description:t(content.description),duration:t(content.duration),modality:t(content.modality),level:t(content.level),introVideoTitle:content.introVideoTitle?t(content.introVideoTitle):undefined,introVideoDescription:content.introVideoDescription?t(content.introVideoDescription):undefined,includes:content.includes.map(key=>t(key)),materialsNeeded:content.materialsNeeded.map(key=>t(key))}));
}
export function getWorkshopBySlug(slug: string, locale: Locale = "es") { return getWorkshops(locale).find(workshop=>workshop.slug===slug); }
