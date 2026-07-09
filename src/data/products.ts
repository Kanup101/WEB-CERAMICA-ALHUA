import type { Product, ProductCategory } from "@/types/product";

export const productCategories: ProductCategory[] = [
  "Tazas",
  "Cuencos",
  "Platos",
  "Objetos decorativos",
  "Piezas únicas",
];

export const products: Product[] = [
  {
    id: "p-001",
    slug: "taza-arcilla-clara",
    name: "Taza Arcilla Clara",
    category: "Tazas",
    description:
      "Taza torneada a mano, esmaltada en tono crema mate con borde tostado.",
    poeticDescription:
      "Una taza serena para rituales lentos: cafe de la mañana, te de tarde y pausas que vuelven al cuerpo.",
    priceARS: 28500,
    priceUSD: 32,
    images: ["/images/products/taza-arcilla-clara.svg", "/images/products/placeholder-ceramica.svg"],
    featured: true,
    stock: 4,
    isUniquePiece: false,
    materials: ["Gres", "Esmalte apto alimentos", "Oxidos naturales"],
    dimensions: "8 cm alto x 9 cm diametro. Capacidad 280 ml.",
    technique: "Torno alfarero, esmaltado manual y horneado de alta temperatura.",
    careInstructions: ["Apta lavavajillas", "Evitar golpes termicos", "No usar sobre llama directa"],
  },
  {
    id: "p-002",
    slug: "cuenco-rio-lento",
    name: "Cuenco Rio Lento",
    category: "Cuencos",
    description:
      "Cuenco profundo en gres con esmalte verde oliva suave y textura organica.",
    poeticDescription:
      "Pensado para servir, mezclar y compartir. Su superficie recuerda piedras pulidas por agua calma.",
    priceARS: 34000,
    priceUSD: 38,
    images: ["/images/products/cuenco-rio-lento.svg", "/images/products/placeholder-ceramica.svg"],
    featured: true,
    stock: 2,
    isUniquePiece: false,
    materials: ["Gres", "Esmalte oliva", "Engobe claro"],
    dimensions: "7 cm alto x 16 cm diametro.",
    technique: "Modelado en torno, retoque manual y esmalte superpuesto.",
    careInstructions: ["Apto alimentos", "Lavar con esponja suave", "Secar antes de guardar"],
  },
  {
    id: "p-003",
    slug: "plato-arena",
    name: "Plato Arena",
    category: "Platos",
    description:
      "Plato bajo de borde irregular, acabado arena y detalles de ceniza clara.",
    poeticDescription:
      "Una pieza cotidiana con gesto de paisaje: simple, tactil y silenciosamente especial.",
    priceARS: 31000,
    priceUSD: 35,
    images: ["/images/products/plato-arena.svg", "/images/products/placeholder-ceramica.svg"],
    featured: true,
    stock: 6,
    isUniquePiece: false,
    materials: ["Gres chamotado", "Esmalte semi mate"],
    dimensions: "2,5 cm alto x 22 cm diametro.",
    technique: "Placa modelada a mano, borde orgánico y horneado de alta temperatura.",
    careInstructions: ["Apto lavavajillas", "No cortar con cuchillos dentados sobre la pieza"],
  },
  {
    id: "p-004",
    slug: "vasija-calma",
    name: "Vasija Calma",
    category: "Objetos decorativos",
    description:
      "Vasija escultorica pequeña con cuello estrecho y terminacion terracota.",
    poeticDescription:
      "Objeto de mesa o biblioteca, creado para sostener aire, flores secas y una presencia tranquila.",
    priceARS: 52000,
    priceUSD: 58,
    images: ["/images/products/vasija-calma.svg", "/images/products/placeholder-ceramica.svg"],
    featured: false,
    stock: 1,
    isUniquePiece: true,
    materials: ["Arcilla roja", "Engobe terracota", "Cera natural"],
    dimensions: "18 cm alto x 10 cm diametro.",
    technique: "Construccion por rollos, bruñido manual y coccion oxidante.",
    careInstructions: ["Usar con flores secas", "Limpiar con pano seco", "No sumergir"],
  },
  {
    id: "p-005",
    slug: "pieza-unica-luna",
    name: "Pieza Unica Luna",
    category: "Piezas únicas",
    description:
      "Centro de mesa unico con esmalte blanco roto, trazos minerales y borde libre.",
    poeticDescription:
      "Una pieza irrepetible, nacida entre prueba y oficio, para habitar una mesa con luz suave.",
    priceARS: 76000,
    priceUSD: 84,
    images: ["/images/products/pieza-unica-luna.svg", "/images/products/placeholder-ceramica.svg"],
    featured: true,
    stock: 1,
    isUniquePiece: true,
    materials: ["Gres", "Esmaltes minerales", "Oxido de hierro"],
    dimensions: "5 cm alto x 28 cm ancho aproximado.",
    technique: "Modelado manual, capas de esmalte y horneado de alta temperatura.",
    careInstructions: ["Apto alimentos secos", "Lavar a mano", "Guardar sin apilar"],
  },
  {
    id: "p-006",
    slug: "taza-niebla",
    name: "Taza Niebla",
    category: "Tazas",
    description:
      "Taza de gres en gris calido, con asa amplia y esmalte satinado.",
    poeticDescription:
      "La compañera discreta para escribir, leer y volver a empezar el dia con una pequena ceremonia.",
    priceARS: 29500,
    priceUSD: 33,
    images: ["/images/products/taza-niebla.svg", "/images/products/placeholder-ceramica.svg"],
    featured: false,
    stock: 0,
    isUniquePiece: false,
    materials: ["Gres", "Esmalte gris satinado"],
    dimensions: "8,5 cm alto x 8 cm diametro. Capacidad 250 ml.",
    technique: "Torno alfarero y asa modelada manualmente.",
    careInstructions: ["Apta lavavajillas", "Evitar microondas prolongado"],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3) {
  return products
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .concat(products.filter((item) => item.slug !== product.slug && item.category !== product.category))
    .slice(0, limit);
}
