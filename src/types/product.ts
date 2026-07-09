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
  priceARS: number;
  priceUSD?: number;
  images: string[];
  featured: boolean;
  stock: number;
  isUniquePiece: boolean;
  materials: string[];
  dimensions: string;
  technique: string;
  careInstructions: string[];
};
