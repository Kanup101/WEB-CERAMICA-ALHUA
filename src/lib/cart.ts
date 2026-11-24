import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

export function canPurchase(product: Product): product is CartItem["product"] {
  return product.priceUSD !== null && product.stock !== null && product.stock > 0;
}

export function reconcileCart(stored: unknown, products: Product[]): CartItem[] {
  if (!Array.isArray(stored)) return [];
  const available = new Map(products.filter(canPurchase).map(product => [product.id, product]));
  const items = new Map<string, CartItem>();

  for (const line of stored) {
    const product = available.get(line?.product?.id);
    if (!product || !Number.isSafeInteger(line.quantity) || line.quantity <= 0) continue;
    const previous = items.get(product.id)?.quantity ?? 0;
    items.set(product.id, { product, quantity: Math.min(previous + line.quantity, product.stock) });
  }

  return [...items.values()];
}

export function cartTotalUSD(items: CartItem[]) {
  return items.reduce((sum, { product, quantity }) => sum + product.priceUSD * quantity, 0);
}
