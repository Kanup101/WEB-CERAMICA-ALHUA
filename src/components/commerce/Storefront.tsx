"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { productCategories } from "@/data/products";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types/product";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "newest", label: "Novedades" },
];

export function Storefront({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<ProductCategory | "Todas">("Todas");
  const [sort, setSort] = useState<SortKey>("featured");

  const visibleProducts = useMemo(() => {
    const filtered = category === "Todas" ? products : products.filter((product) => product.category === category);
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.priceARS - b.priceARS;
      if (sort === "price-desc") return b.priceARS - a.priceARS;
      if (sort === "newest") return b.id.localeCompare(a.id);
      return Number(b.featured) - Number(a.featured);
    });
  }, [category, products, sort]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["Todas", ...productCategories] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                category === item
                  ? "border-[#6F4A39] bg-[#6F4A39] text-white"
                  : "border-[#D8C3AA] bg-white text-[#4B4038] hover:bg-[#F0E5D6]",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#4B4038] sm:flex-row sm:items-center sm:gap-3">
          Ordenar
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            className="h-11 w-full rounded-full border border-[#D8C3AA] bg-white px-4 text-sm outline-none focus:border-[#8F5F45] sm:w-auto"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ProductGrid products={visibleProducts} />
    </div>
  );
}
