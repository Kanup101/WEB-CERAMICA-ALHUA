"use client";
import { useI18n } from "@/lib/i18n/provider";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";
import { canPurchase } from "@/lib/cart";
export function AddToCartButton({ product }: {
    product: Product;
}) {
    const { t } = useI18n();
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    if (!canPurchase(product)) return null;
    return (<Button size="lg" onClick={() => {
            addItem(product);
            setAdded(true);
        }}>
      <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true"/>
      {added ? t("Agregado") : t("Agregar al carrito")}
    </Button>);
}
