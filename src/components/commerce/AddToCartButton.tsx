"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      size="lg"
      disabled={product.stock <= 0}
      onClick={() => {
        addItem(product);
        setAdded(true);
      }}
    >
      <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />
      {product.stock <= 0 ? "Sin stock" : added ? "Agregado" : "Agregar al carrito"}
    </Button>
  );
}
