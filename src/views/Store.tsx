"use client";
import { useI18n } from "@/lib/i18n/provider";
import { Storefront } from "@/components/commerce/Storefront";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { getProducts } from "@/data/products";
export default function StorePage() {
    const { t, locale } = useI18n();
    const products = getProducts(locale);
    return (<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <SectionTitle eyebrow={t("Tienda")} title={t("Piezas artesanales para usar y contemplar")} description={t("Cada tanda es pequena y puede variar naturalmente. Filtra por categoria o recorre la coleccion completa.")}/>
      <div className="mt-10">
        <Storefront products={products}/>
      </div>
    </div>);
}
