"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { getProducts } from "@/data/products";
import { useI18n } from "@/lib/i18n/provider";
import { cartTotalUSD, reconcileCart } from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalUSD: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "alhua-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const products = useMemo(() => getProducts(locale), [locale]);
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedCart = window.localStorage.getItem(storageKey);
        if (storedCart) {
          setItems(reconcileCart(JSON.parse(storedCart), products));
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setHydrated(true);
      }
    });
  }, [products]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalUSD = cartTotalUSD(items);

    return {
      items,
      totalItems,
      totalUSD,
      addItem(product) {
        setItems(current => reconcileCart([...current, { product, quantity: 1 }], products));
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      updateQuantity(productId, quantity) {
        if (!Number.isSafeInteger(quantity)) return;
        setItems(current => reconcileCart(current.map(item =>
          item.product.id === productId ? { ...item, quantity: Math.max(quantity, 1) } : item,
        ), products));
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
