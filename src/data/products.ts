import type { Product } from "@/types/product";
import type { Locale } from "@/lib/i18n/config";
import { getTranslator, type MessageKey } from "@/lib/i18n/messages";

type ProductContent = { description: MessageKey; poeticDescription: MessageKey; materials: MessageKey[]; dimensions: MessageKey; technique: MessageKey; careInstructions: MessageKey[] };
type ProductRecord = Omit<Product, keyof ProductContent> & { artworkId: string; content?: ProductContent };

export const productRecords: ProductRecord[] = [
  {
    "id": "p-001",
    "slug": "taza-biblioteca",
    "name": "Taza Biblioteca",
    "category": "Tazas",
    "images": [
      "/images/products/taza-biblioteca-1.webp"
    ],
    "featured": true,
    "isUniquePiece": false,
    "content": {
      "description": "Taza de gres torneada a mano, con esmalte calido y una silueta comoda para uso diario.",
      "poeticDescription": "Una pieza pensada para acompanar lecturas largas, cafes lentos y escritorios con luz de tarde.",
      "materials": [
        "Gres de alta temperatura",
        "Esmalte apto alimentos",
        "Oxidos minerales"
      ],
      "dimensions": "8,5 cm alto x 8 cm diametro. Capacidad aproximada 280 ml.",
      "technique": "Torno alfarero, asa modelada a mano y esmaltado por inmersion.",
      "careInstructions": [
        "Apta lavavajillas",
        "Apta microondas en usos breves",
        "Evitar golpes termicos"
      ]
    },
    "artworkId": "taza-biblioteca",
    "priceUSD": null,
    "stock": null
  },
  {
    "id": "p-003",
    "slug": "luminaria-geometria",
    "name": "Luminaria Geométrica",
    "category": "Objetos decorativos",
    "images": [
      "/images/products/obra-3.webp"
    ],
    "featured": false,
    "isUniquePiece": true,
    "content": {
      "description": "Pieza calada con detalles geometricos pintados a mano en tonos claros y verdes suaves.",
      "poeticDescription": "Una pieza para generar pequenos puntos de luz y ritmo visual en mesas, estantes o rincones de lectura.",
      "materials": [
        "Arcilla roja",
        "Pigmentos minerales",
        "Terminacion mate"
      ],
      "dimensions": "17 cm alto x 14 cm diametro aproximado.",
      "technique": "Construccion manual, calado organico y pintura de superficie.",
      "careInstructions": [
        "Objeto decorativo",
        "Usar solo con luz fria o contenedor interno",
        "Evitar golpes"
      ]
    },
    "artworkId": "luminaria-geometrica",
    "priceUSD": 105,
    "stock": 1
  },
  {
    "id": "p-004",
    "slug": "vasija-puntas",
    "name": "Vasija Puntas",
    "category": "Objetos decorativos",
    "images": [
      "/images/products/vasija-puntas-1.webp",
      "/images/products/vasija-puntas-2.webp",
      "/images/products/vasija-puntas-3.webp"
    ],
    "featured": true,
    "isUniquePiece": true,
    "content": {
      "description": "Vasija escultorica de pequeno formato, con volumen organico y terminacion de caracter mineral.",
      "poeticDescription": "Un objeto para sostener aire, flores secas y una pausa visual en bibliotecas, mesas o repisas.",
      "materials": [
        "Arcilla de alta temperatura",
        "Engobes naturales",
        "Cera de terminacion"
      ],
      "dimensions": "19 cm alto x 11 cm ancho aproximado.",
      "technique": "Construccion por rollos, modelado escultorico y terminacion manual.",
      "careInstructions": [
        "Usar con flores secas",
        "Limpiar con pano seco",
        "No sumergir en agua"
      ]
    },
    "artworkId": "vasija-puntas",
    "priceUSD": 300,
    "stock": 0
  },
  {
    "id": "p-005",
    "slug": "soplo-al-sol",
    "name": "Soplo al sol",
    "category": "Piezas únicas",
    "images": [
      "/images/products/vasija-silvadora-1.webp",
      "/images/products/vasija-silvadora-2.webp",
      "/images/products/vasija-silvadora-3.webp"
    ],
    "featured": true,
    "isUniquePiece": true,
    "content": {
      "description": "Pieza unica inspirada en formas ancestrales, con cuerpo compacto y presencia ceremonial.",
      "poeticDescription": "Una pieza irrepetible para coleccionistas de objetos con memoria, materia y gesto.",
      "materials": [
        "Arcilla roja",
        "Oxidos naturales",
        "Esmalte parcial"
      ],
      "dimensions": "16 cm alto x 14 cm ancho aproximado.",
      "technique": "Modelado manual, brunido parcial y coccion oxidante.",
      "careInstructions": [
        "Objeto decorativo",
        "Manipular con ambas manos",
        "Evitar humedad permanente"
      ]
    },
    "artworkId": "soplo-al-sol",
    "priceUSD": 150,
    "stock": 1
  },
  {
    "id": "p-006",
    "slug": "fuente-venas",
    "name": "Fuente Venas",
    "category": "Platos",
    "images": [
      "/images/products/venas-1.webp",
      "/images/products/venas-2.webp",
      "/images/products/venas-3.webp"
    ],
    "featured": false,
    "isUniquePiece": false,
    "content": {
      "description": "Fuente artesanal de borde libre, con marcas minerales que recorren la superficie como un dibujo natural.",
      "poeticDescription": "Una pieza de mesa para servir despacio, compartir y dejar que el material tambien converse.",
      "materials": [
        "Gres",
        "Esmalte blanco roto",
        "Oxido de hierro"
      ],
      "dimensions": "4 cm alto x 28 cm largo aproximado.",
      "technique": "Modelado por placa, textura manual y esmalte mineral.",
      "careInstructions": [
        "Apta alimentos",
        "Lavar a mano para preservar la superficie",
        "No apilar con peso"
      ]
    },
    "artworkId": "fuente-venas",
    "priceUSD": 250,
    "stock": 2
  },
  {
    "id": "p-007",
    "slug": "tambor-ceremonial",
    "name": "Tambor ceremonial",
    "category": "Objetos decorativos",
    "images": [
      "/images/products/obra-1.webp",
      "/images/products/obra-11.webp",
      "/images/products/tambor-1.webp",
      "/images/products/tambor-2.webp",
      "/images/products/tambor-3.webp"
    ],
    "featured": true,
    "isUniquePiece": true,
    "content": {
      "description": "Pieza tipo tambor con cuero tensado, cordones negros y grabados manuales sobre arcilla.",
      "poeticDescription": "Una forma circular, ritmica y tactil que cruza ceramica, gesto textil y memoria sonora.",
      "materials": [
        "Arcilla roja",
        "Cuero",
        "Cordones textiles",
        "Oxidos naturales"
      ],
      "dimensions": "10 cm alto x 17 cm diametro aproximado.",
      "technique": "Modelado manual, incision superficial, armado textil y terminacion mate.",
      "careInstructions": [
        "Objeto decorativo",
        "Limpiar con pano seco",
        "Evitar humedad y sol directo"
      ]
    },
    "artworkId": "tambor-ceremonial",
    "priceUSD": 145,
    "stock": 1
  },
  {
    "id": "p-011",
    "slug": "derbake",
    "name": "Derbake",
    "artworkId": "derbake",
    "category": "Objetos decorativos",
    "priceUSD": 250,
    "stock": null,
    "images": [
      "/images/collections/derbake/derbake2-28b297738a01ceed-d3486af9a9.webp"
    ],
    "featured": false,
    "isUniquePiece": true
  }
];

export function getProducts(locale: Locale): Product[] {
  const t = getTranslator(locale);
  return productRecords.map(({ content, ...shared }) => ({
    ...shared,
    description: content ? t(content.description) : "",
    poeticDescription: content ? t(content.poeticDescription) : "",
    materials: content?.materials.map(key => t(key)) ?? [],
    dimensions: content ? t(content.dimensions) : "",
    technique: content ? t(content.technique) : "",
    careInstructions: content?.careInstructions.map(key => t(key)) ?? [],
  }));
}

export function getProductBySlug(slug: string, locale: Locale = "es") {
  return getProducts(locale).find(product => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3, locale: Locale = "es") {
  const products = getProducts(locale).filter(item => item.id !== product.id);
  return products.filter(item => item.category === product.category)
    .concat(products.filter(item => item.category !== product.category)).slice(0, limit);
}
