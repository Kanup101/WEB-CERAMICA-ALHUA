"use client";
import { useI18n } from "@/lib/i18n/provider";
import { Badge } from "@/components/ui/badge";
export function StockBadge({ stock, isUniquePiece }: {
    stock: number;
    isUniquePiece?: boolean;
}) {
    const { t } = useI18n();
    if (stock <= 0) {
        return <Badge className="border-[#C9B2A0] bg-[#EFE4DA] text-[#76685F]">{t("Sin stock")}</Badge>;
    }
    if (isUniquePiece) {
        return <Badge className="border-[#B97859] bg-[#F4E2D4] text-[#7A513C]">{t("Pieza unica")}</Badge>;
    }
    return <Badge className="border-[#AEB18E] bg-[#EEF0DD] text-[#586442]">{t("{count} disponibles", { count: stock })}</Badge>;
}
