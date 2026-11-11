"use client";
import { useI18n } from "@/lib/i18n/provider";
import { ProductCard } from "@/components/commerce/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Product } from "@/types/product";
export function ProductGrid({ products }: {
    products: Product[];
}) {
    const { t } = useI18n();
    if (!products.length) {
        return (<EmptyState title={t("No encontramos piezas")} description={t("Prob\u00E1 con otra categor\u00EDa o volv\u00E9 pronto: las series artesanales se actualizan en tandas peque\u00F1as.")}/>);
    }
    return (<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (<ProductCard key={product.id} product={product}/>))}
    </div>);
}
