import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StockBadge } from "@/components/commerce/StockBadge";
import { ButtonLink } from "@/components/ui/button";
import { formatARS } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] shadow-[0_18px_60px_rgba(74,55,40,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(74,55,40,0.12)]">
      <Link href={`/tienda/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE4D4]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#8B6E54]">{product.category}</p>
            <h3 className="mt-1 text-xl font-semibold text-[#342A24]">{product.name}</h3>
          </div>
          <StockBadge stock={product.stock} isUniquePiece={product.isUniquePiece} />
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-[#6C5C50]">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold text-[#6F4A39]">{formatARS(product.priceARS)}</p>
          <ButtonLink href={`/tienda/${product.slug}`} variant="outline" size="sm">
            Ver detalle
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
