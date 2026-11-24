import type { Product } from "./product";

export type CartItem = {
  product: Product & { priceUSD: number; stock: number };
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  totalItems: number;
  totalUSD: number;
};
