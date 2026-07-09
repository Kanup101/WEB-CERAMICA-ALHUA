import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { StockBadge } from "@/components/commerce/StockBadge";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { formatARS } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.description} Pieza de ceramica artesanal hecha a mano en Argentina.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={product.images} name={product.name} />
        <div className="lg:pt-8">
          <p className="text-sm uppercase tracking-[0.16em] text-[#8B6E54]">{product.category}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-[#342A24]">{product.name}</h1>
          <p className="mt-5 text-2xl font-semibold text-[#6F4A39]">{formatARS(product.priceARS)}</p>
          <div className="mt-5">
            <StockBadge stock={product.stock} isUniquePiece={product.isUniquePiece} />
          </div>
          <p className="mt-8 text-xl leading-8 text-[#4B4038]">{product.poeticDescription}</p>
          <p className="mt-4 leading-7 text-[#6C5C50]">{product.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product} />
            <WhatsAppButton message={`Hola Alhua, quiero consultar por ${product.name}.`} />
          </div>

          <div className="mt-10 grid gap-5 rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6 text-sm leading-6 text-[#6C5C50]">
            <Info title="Materiales" items={product.materials} />
            <Info title="Medidas" items={[product.dimensions]} />
            <Info title="Tecnica" items={[product.technique]} />
            <Info title="Cuidados" items={product.careInstructions} />
          </div>
        </div>
      </div>

      <section className="mt-20">
        <SectionTitle eyebrow="Tambien te puede gustar" title="Piezas relacionadas" />
        <div className="mt-10">
          <ProductGrid products={related} />
        </div>
      </section>
    </div>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-semibold text-[#342A24]">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
