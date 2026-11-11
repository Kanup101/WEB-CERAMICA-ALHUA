"use client";
import { useI18n } from "@/lib/i18n/provider";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { StockBadge } from "@/components/commerce/StockBadge";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { productWhatsAppMessage } from "@/lib/contact";
export default function ProductDetailPage({ slug }: {
    slug: string;
}) {
    const { t, locale, money } = useI18n();
    const product = getProductBySlug(slug, locale);
    if (!product) {
        notFound();
    }
    const related = getRelatedProducts(product, 3, locale);
    return (<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={product.images} name={product.name}/>
        <div className="lg:pt-8">
          <p className="text-sm uppercase tracking-[0.16em] text-[#8B6E54]">{t(product.category)}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#342A24] sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-2xl font-semibold text-[#6F4A39]">{money(product.priceARS)}</p>
          <div className="mt-5">
            <StockBadge stock={product.stock} isUniquePiece={product.isUniquePiece}/>
          </div>
          <p className="mt-8 text-xl leading-8 text-[#4B4038]">{product.poeticDescription}</p>
          <p className="mt-4 leading-7 text-[#6C5C50]">{product.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product}/>
            <WhatsAppButton message={productWhatsAppMessage(product, locale)} label={t("Consultar esta pieza")}/>
          </div>

          <div className="mt-10 grid gap-5 rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-5 text-sm leading-6 text-[#6C5C50] shadow-[0_18px_60px_rgba(74,55,40,0.06)] sm:p-6">
            <Info title={t("Materiales")} items={product.materials}/>
            <Info title={t("Medidas")} items={[product.dimensions]}/>
            <Info title={t("Tecnica")} items={[product.technique]}/>
            <Info title={t("Cuidados")} items={product.careInstructions}/>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <SectionTitle eyebrow={t("Tambien te puede gustar")} title={t("Piezas relacionadas")}/>
        <div className="mt-10">
          <ProductGrid products={related}/>
        </div>
      </section>
    </div>);
}
function Info({ title, items }: {
    title: string;
    items: string[];
}) {
    return (<div>
      <h2 className="font-semibold text-[#342A24]">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => (<li key={item}>{item}</li>))}
      </ul>
    </div>);
}
