import type { Product, ProductCategory } from "@/types/product";
import type { Locale } from "@/lib/i18n/config";
import { getTranslator, type MessageKey } from "@/lib/i18n/messages";

type ProductContent = { description: MessageKey; poeticDescription: MessageKey; materials: MessageKey[]; dimensions: MessageKey; technique: MessageKey; careInstructions: MessageKey[] };
type ProductRecord = Omit<Product, keyof ProductContent> & { content: ProductContent };
export const productCategories: ProductCategory[] = [
  "Tazas",
  "Cuencos",
  "Platos",
  "Objetos decorativos",
  "Piezas únicas"
];
export const productRecords: ProductRecord[] = [
  {
    "id": "p-001",
    "slug": "taza-biblioteca",
    "name": "Taza Biblioteca",
    "category": "Tazas",
    "priceARS": 32500,
    "priceUSD": 36,
    "images": [
      "/images/products/taza-biblioteca-1.webp"
    ],
    "featured": true,
    "stock": 5,
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
    }
  },
  {
    "id": "p-002",
    "slug": "luminaria-corteza",
    "name": "Luminaria Corteza",
    "category": "Objetos decorativos",
    "priceARS": 56000,
    "priceUSD": 62,
    "images": [
      "/images/products/obra-2.webp"
    ],
    "featured": true,
    "stock": 1,
    "isUniquePiece": true,
    "content": {
      "description": "Objeto calado de arcilla roja con textura vertical, pensado para luz suave o composicion decorativa.",
      "poeticDescription": "La luz atraviesa sus aberturas y revela una superficie tactil, cercana a corteza, tierra y sombra.",
      "materials": [
        "Arcilla roja",
        "Engobe natural",
        "Terminacion mate"
      ],
      "dimensions": "18 cm alto x 13 cm diametro aproximado.",
      "technique": "Modelado manual, calado y textura aplicada pieza por pieza.",
      "careInstructions": [
        "Usar con luz led o vela contenida",
        "Limpiar con pano seco",
        "No exponer a humedad permanente"
      ]
    }
  },
  {
    "id": "p-003",
    "slug": "luminaria-geometria",
    "name": "Luminaria Geometria",
    "category": "Objetos decorativos",
    "priceARS": 59000,
    "priceUSD": 66,
    "images": [
      "/images/products/obra-3.webp"
    ],
    "featured": false,
    "stock": 1,
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
    }
  },
  {
    "id": "p-004",
    "slug": "vasija-puntas",
    "name": "Vasija Puntas",
    "category": "Objetos decorativos",
    "priceARS": 72000,
    "priceUSD": 80,
    "images": [
      "/images/products/vasija-puntas-1.webp",
      "/images/products/vasija-puntas-2.webp",
      "/images/products/vasija-puntas-3.webp"
    ],
    "featured": true,
    "stock": 1,
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
    }
  },
  {
    "id": "p-005",
    "slug": "vasija-silvadora",
    "name": "Vasija Silvadora",
    "category": "Piezas únicas",
    "priceARS": 98000,
    "priceUSD": 108,
    "images": [
      "/images/products/vasija-silvadora-1.webp",
      "/images/products/vasija-silvadora-2.webp",
      "/images/products/vasija-silvadora-3.webp"
    ],
    "featured": true,
    "stock": 1,
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
    }
  },
  {
    "id": "p-006",
    "slug": "fuente-venas",
    "name": "Fuente Venas",
    "category": "Platos",
    "priceARS": 64000,
    "priceUSD": 71,
    "images": [
      "/images/products/venas-1.webp",
      "/images/products/venas-2.webp",
      "/images/products/venas-3.webp"
    ],
    "featured": false,
    "stock": 2,
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
    }
  },
  {
    "id": "p-007",
    "slug": "tambor-ceremonial",
    "name": "Tambor Ceremonial",
    "category": "Objetos decorativos",
    "priceARS": 86000,
    "priceUSD": 95,
    "images": [
      "/images/products/obra-1.webp",
      "/images/products/obra-11.webp",
      "/images/products/tambor-1.webp",
      "/images/products/tambor-2.webp",
      "/images/products/tambor-3.webp"
    ],
    "featured": true,
    "stock": 1,
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
    }
  },
  {
    "id": "p-008",
    "slug": "figura-flautista",
    "name": "Figura Flautista",
    "category": "Piezas únicas",
    "priceARS": 92000,
    "priceUSD": 102,
    "images": [
      "/images/products/obra-4.webp"
    ],
    "featured": false,
    "stock": 1,
    "isUniquePiece": true,
    "content": {
      "description": "Figura escultorica en arcilla roja con detalles pintados y una presencia ludica y ritual.",
      "poeticDescription": "Una pieza narrativa, hecha a mano, que parece guardar una musica pequena y antigua.",
      "materials": [
        "Arcilla roja",
        "Pigmentos minerales",
        "Engobe amarillo"
      ],
      "dimensions": "20 cm alto x 12 cm ancho aproximado.",
      "technique": "Modelado escultorico manual, aplicacion de volumenes y pintura de detalles.",
      "careInstructions": [
        "Objeto decorativo",
        "Manipular con cuidado",
        "Limpiar con pincel suave o pano seco"
      ]
    }
  },
  {
    "id": "p-009",
    "slug": "vasija-organica",
    "name": "Vasija Organica",
    "category": "Piezas únicas",
    "priceARS": 78000,
    "priceUSD": 86,
    "images": [
      "/images/products/obra-5.webp"
    ],
    "featured": false,
    "stock": 1,
    "isUniquePiece": true,
    "content": {
      "description": "Pieza escultorica de forma abierta, con volumen organico y superficie de arcilla natural.",
      "poeticDescription": "Una forma libre, casi vegetal, que deja ver el gesto directo de la mano sobre la materia.",
      "materials": [
        "Arcilla roja",
        "Engobe natural",
        "Terminacion mate"
      ],
      "dimensions": "18 cm alto x 18 cm ancho aproximado.",
      "technique": "Modelado manual por adicion, ahuecado y terminacion de superficie.",
      "careInstructions": [
        "Objeto decorativo",
        "No usar con agua",
        "Apoyar sobre superficie estable"
      ]
    }
  },
  {
    "id": "p-010",
    "slug": "vasija-espinas",
    "name": "Vasija Espinas",
    "category": "Piezas únicas",
    "priceARS": 82000,
    "priceUSD": 91,
    "images": [
      "/images/products/obra-6webp.webp"
    ],
    "featured": false,
    "stock": 1,
    "isUniquePiece": true,
    "content": {
      "description": "Vasija de cuerpo amplio con cuello texturado y pequenas puntas modeladas a mano.",
      "poeticDescription": "Una pieza de presencia fuerte, entre recipiente antiguo y objeto de paisaje.",
      "materials": [
        "Arcilla roja",
        "Engobe claro",
        "Oxidos"
      ],
      "dimensions": "21 cm alto x 15 cm diametro aproximado.",
      "technique": "Construccion manual, aplicacion de puntas y textura superficial.",
      "careInstructions": [
        "Objeto decorativo",
        "Usar con flores secas",
        "No sumergir"
      ]
    }
  }
];

export function getProducts(locale: Locale): Product[] {
 const t = getTranslator(locale);
 return productRecords.map(({content,...shared}) => ({...shared, description: t(content.description), poeticDescription: t(content.poeticDescription), materials: content.materials.map(key=>t(key)), dimensions: t(content.dimensions), technique: t(content.technique), careInstructions: content.careInstructions.map(key=>t(key))}));
}
export function getProductBySlug(slug: string, locale: Locale = "es") { return getProducts(locale).find(product=>product.slug===slug); }
export function getRelatedProducts(product: Product, limit = 3, locale: Locale = "es") {
 const products = getProducts(locale);
 return products.filter(item=>item.slug!==product.slug && item.category===product.category).concat(products.filter(item=>item.slug!==product.slug && item.category!==product.category)).slice(0,limit);
}
