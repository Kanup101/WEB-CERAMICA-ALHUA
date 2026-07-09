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
    slug: "taza-biblioteca",
    name: "Taza Biblioteca",
    category: "Tazas",
    description:
      "Taza de gres torneada a mano, con esmalte calido y una silueta comoda para uso diario.",
    poeticDescription:
      "Una pieza pensada para acompanar lecturas largas, cafes lentos y escritorios con luz de tarde.",
    priceARS: 32500,
    priceUSD: 36,
    images: ["/images/products/taza-biblioteca-1.webp", "/images/products/obra-7.webp"],
    featured: true,
    stock: 5,
    isUniquePiece: false,
    materials: ["Gres de alta temperatura", "Esmalte apto alimentos", "Oxidos minerales"],
    dimensions: "8,5 cm alto x 8 cm diametro. Capacidad aproximada 280 ml.",
    technique: "Torno alfarero, asa modelada a mano y esmaltado por inmersion.",
    careInstructions: ["Apta lavavajillas", "Apta microondas en usos breves", "Evitar golpes termicos"],
  },
  {
    id: "p-002",
    slug: "cuenco-barro-sereno",
    name: "Cuenco Barro Sereno",
    category: "Cuencos",
    description:
      "Cuenco profundo de terminacion terrosa, ideal para desayunos, sopas o piezas de mesa compartida.",
    poeticDescription:
      "Su textura conserva el gesto de las manos y vuelve cada comida un pequeno ritual cotidiano.",
    priceARS: 38500,
    priceUSD: 42,
    images: ["/images/products/barro-1.webp", "/images/products/barro-2.webp"],
    featured: true,
    stock: 4,
    isUniquePiece: false,
    materials: ["Gres chamotado", "Engobe natural", "Esmalte transparente apto alimentos"],
    dimensions: "7 cm alto x 15 cm diametro.",
    technique: "Modelado manual, alisado con esponja y horneado de alta temperatura.",
    careInstructions: ["Lavar con esponja suave", "No usar sobre llama directa", "Secar antes de guardar"],
  },
  {
    id: "p-003",
    slug: "plato-paisaje",
    name: "Plato Paisaje",
    category: "Platos",
    description:
      "Plato bajo con superficie organica y tonos inspirados en arcilla, arena y horizonte.",
    poeticDescription:
      "Una base serena para servir pan, fruta o una mesa sencilla con presencia artesanal.",
    priceARS: 36000,
    priceUSD: 40,
    images: ["/images/products/paisaje-1.webp", "/images/products/paisaje-3.webp"],
    featured: true,
    stock: 6,
    isUniquePiece: false,
    materials: ["Gres", "Esmalte semi mate", "Pigmentos minerales"],
    dimensions: "2,5 cm alto x 22 cm diametro.",
    technique: "Placa modelada a mano, borde organico y esmalte aplicado en capas.",
    careInstructions: ["Apto alimentos", "Apto lavavajillas", "Evitar cortar con cuchillos dentados sobre la pieza"],
  },
  {
    id: "p-004",
    slug: "vasija-puntas",
    name: "Vasija Puntas",
    category: "Objetos decorativos",
    description:
      "Vasija escultorica de pequeno formato, con volumen organico y terminacion de caracter mineral.",
    poeticDescription:
      "Un objeto para sostener aire, flores secas y una pausa visual en bibliotecas, mesas o repisas.",
    priceARS: 72000,
    priceUSD: 80,
    images: [
      "/images/products/vasija-puntas-1.webp",
      "/images/products/vasija-puntas-2.webp",
      "/images/products/vasija-puntas-3.webp",
    ],
    featured: true,
    stock: 1,
    isUniquePiece: true,
    materials: ["Arcilla de alta temperatura", "Engobes naturales", "Cera de terminacion"],
    dimensions: "19 cm alto x 11 cm ancho aproximado.",
    technique: "Construccion por rollos, modelado escultorico y terminacion manual.",
    careInstructions: ["Usar con flores secas", "Limpiar con pano seco", "No sumergir en agua"],
  },
  {
    id: "p-005",
    slug: "vasija-silvadora",
    name: "Vasija Silvadora",
    category: "Piezas únicas",
    description:
      "Pieza unica inspirada en formas ancestrales, con cuerpo compacto y presencia ceremonial.",
    poeticDescription:
      "Una pieza irrepetible para coleccionistas de objetos con memoria, materia y gesto.",
    priceARS: 98000,
    priceUSD: 108,
    images: [
      "/images/products/vasija-silvadora-1.webp",
      "/images/products/vasija-silvadora-2.webp",
      "/images/products/vasija-silvadora-3.webp",
    ],
    featured: true,
    stock: 1,
    isUniquePiece: true,
    materials: ["Arcilla roja", "Oxidos naturales", "Esmalte parcial"],
    dimensions: "16 cm alto x 14 cm ancho aproximado.",
    technique: "Modelado manual, bruñido parcial y coccion oxidante.",
    careInstructions: ["Objeto decorativo", "Manipular con ambas manos", "Evitar humedad permanente"],
  },
  {
    id: "p-006",
    slug: "fuente-venas",
    name: "Fuente Venas",
    category: "Platos",
    description:
      "Fuente artesanal de borde libre, con marcas minerales que recorren la superficie como un dibujo natural.",
    poeticDescription:
      "Una pieza de mesa para servir despacio, compartir y dejar que el material tambien converse.",
    priceARS: 64000,
    priceUSD: 71,
    images: ["/images/products/venas-1.webp", "/images/products/venas-2.webp", "/images/products/venas-3.webp"],
    featured: false,
    stock: 2,
    isUniquePiece: false,
    materials: ["Gres", "Esmalte blanco roto", "Oxido de hierro"],
    dimensions: "4 cm alto x 28 cm largo aproximado.",
    technique: "Modelado por placa, textura manual y esmalte mineral.",
    careInstructions: ["Apta alimentos", "Lavar a mano para preservar la superficie", "No apilar con peso"],
  },
  {
    id: "p-007",
    slug: "tambor-de-mesa",
    name: "Tambor de Mesa",
    category: "Objetos decorativos",
    description:
      "Objeto decorativo de volumen bajo, textura grafica y acabado mate para componer espacios calidos.",
    poeticDescription:
      "Una forma simple y ritmica que aporta sombra, textura y silencio a una mesa baja o estante.",
    priceARS: 58500,
    priceUSD: 65,
    images: ["/images/products/tambor-1.webp", "/images/products/tambor-2.webp", "/images/products/tambor-3.webp"],
    featured: false,
    stock: 1,
    isUniquePiece: true,
    materials: ["Gres", "Engobe oscuro", "Terminacion mate"],
    dimensions: "10 cm alto x 17 cm diametro aproximado.",
    technique: "Construccion manual, incision superficial y horneado de alta temperatura.",
    careInstructions: ["Limpiar con pano seco", "No usar como maceta sin contenedor interno", "Evitar golpes"],
  },
  {
    id: "p-008",
    slug: "pieza-horno-abierto",
    name: "Pieza Horno Abierto",
    category: "Piezas únicas",
    description:
      "Pieza unica con huellas de proceso, tonos tostados y textura marcada por el fuego.",
    poeticDescription:
      "Una obra pequena donde el horno deja su firma: irregular, calida y completamente irrepetible.",
    priceARS: 89000,
    priceUSD: 98,
    images: ["/images/products/horno-1.webp", "/images/products/horno-2.webp"],
    featured: false,
    stock: 1,
    isUniquePiece: true,
    materials: ["Arcilla refractaria", "Cenizas naturales", "Oxidos"],
    dimensions: "12 cm alto x 20 cm ancho aproximado.",
    technique: "Modelado manual, pruebas de superficie y coccion experimental.",
    careInstructions: ["Objeto decorativo", "No usar con alimentos liquidos", "Limpiar con pano apenas humedo"],
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
