import { ProductCard } from "@/components/commerce/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Product } from "@/types/product";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <EmptyState
        title="No encontramos piezas"
        description="Probá con otra categoría o volvé pronto: las series artesanales se actualizan en tandas pequeñas."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
