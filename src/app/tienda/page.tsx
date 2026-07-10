import type { Metadata } from "next";
import { Storefront } from "@/components/commerce/Storefront";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Tienda de ceramica artesanal argentina",
  description:
    "Explora piezas unicas de ceramica artesanal argentina: tazas, cuencos, platos y objetos decorativos hechos a mano.",
};

export default function StorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <SectionTitle
        eyebrow="Tienda"
        title="Piezas artesanales para usar y contemplar"
        description="Cada tanda es pequena y puede variar naturalmente. Filtra por categoria o recorre la coleccion completa."
      />
      <div className="mt-10">
        <Storefront products={products} />
      </div>
    </div>
  );
}
