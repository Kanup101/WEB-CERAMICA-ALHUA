export type ProductCategory =
  | "Tazas"
  | "Cuencos"
  | "Platos"
  | "Objetos decorativos"
  | "Piezas únicas";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  poeticDescription: string;
  priceUSD: number | null;
  images: string[];
  featured: boolean;
  stock: number | null;
  isUniquePiece: boolean;
  materials: string[];
  dimensions: string;
  technique: string;
  careInstructions: string[];
};
