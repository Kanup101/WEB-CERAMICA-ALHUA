"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalARS: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "alhua-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedCart = window.localStorage.getItem(storageKey);
        if (storedCart) {
          const parsedItems = JSON.parse(storedCart) as CartItem[];
          if (Array.isArray(parsedItems)) {
            setItems(parsedItems);
          }
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalARS = items.reduce((sum, item) => sum + item.product.priceARS * item.quantity, 0);

    return {
      items,
      totalItems,
      totalARS,
      addItem(product) {
        if (product.stock <= 0) return;

        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + 1, product.stock || 1) }
                : item,
            );
          }
          return [...current, { product, quantity: 1 }];
        });
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.product.stock || 1) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
