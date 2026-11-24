"use client";
import { useI18n } from "@/lib/i18n/provider";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
export function StockBadge({ product }: { product: Product }) {
    const { t } = useI18n();
    const { stock, isUniquePiece, priceUSD } = product;
    if (stock === 0 || stock === null || priceUSD === null) {
        const label = stock === 0 ? t("Vendida") : priceUSD === null ? t("Precio a confirmar") : t("Disponibilidad a confirmar");
        return <Badge className="border-[#C9B2A0] bg-[#EFE4DA] text-[#76685F]">{label}</Badge>;
    }
    if (isUniquePiece) {
        return <Badge className="border-[#B97859] bg-[#F4E2D4] text-[#7A513C]">{t("Pieza unica")}</Badge>;
    }
    return <Badge className="border-[#AEB18E] bg-[#EEF0DD] text-[#586442]">{t("{count} disponibles", { count: stock })}</Badge>;
}
