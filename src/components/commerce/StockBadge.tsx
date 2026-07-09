import { Badge } from "@/components/ui/badge";

export function StockBadge({ stock, isUniquePiece }: { stock: number; isUniquePiece?: boolean }) {
  if (stock <= 0) {
    return <Badge className="border-[#C9B2A0] bg-[#EFE4DA] text-[#76685F]">Sin stock</Badge>;
  }

  if (isUniquePiece) {
    return <Badge className="border-[#B97859] bg-[#F4E2D4] text-[#7A513C]">Pieza unica</Badge>;
  }

  return <Badge className="border-[#AEB18E] bg-[#EEF0DD] text-[#586442]">{stock} disponibles</Badge>;
}
