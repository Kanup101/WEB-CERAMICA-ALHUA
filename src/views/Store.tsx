"use client";
import { useI18n } from "@/lib/i18n/provider";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { getProducts } from "@/data/products";
export default function StorePage() {
    const { t, locale } = useI18n();
    const products = getProducts(locale).sort((a, b) => Number(b.featured) - Number(a.featured));
    return (<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <SectionTitle eyebrow={t("Tienda")} title={t("Piezas artesanales para usar y contemplar")}/>
      <div className="mt-10">
        <ProductGrid products={products}/>
      </div>
    </div>);
}
