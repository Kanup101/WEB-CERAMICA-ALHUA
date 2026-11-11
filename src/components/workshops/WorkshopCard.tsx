"use client";
import { useI18n } from "@/lib/i18n/provider";
import Image from "next/image";
import { Clock, Monitor, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { Workshop } from "@/types/workshop";
export function WorkshopCard({ workshop }: {
    workshop: Workshop;
}) {
    const { t, money } = useI18n();
    return (<article className="overflow-hidden rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] shadow-[0_18px_60px_rgba(74,55,40,0.07)]">
      <div className="relative aspect-[4/3] bg-[#EFE4D4]">
        <Image src={workshop.image} alt={workshop.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw"/>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#8B6E54]">{workshop.level}</p>
          <h3 className="mt-1 text-2xl font-semibold text-[#342A24]">{workshop.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#6C5C50]">{workshop.subtitle}</p>
        </div>
        <div className="grid gap-2 text-sm text-[#6C5C50]">
          <p className="flex items-center gap-2"><Clock className="h-4 w-4"/> {workshop.duration}</p>
          <p className="flex items-center gap-2"><Monitor className="h-4 w-4"/> {workshop.modality}</p>
          <p className="flex items-center gap-2"><Sparkles className="h-4 w-4"/> {t("{count} lugares disponibles", { count: workshop.availableSpots })}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-semibold text-[#6F4A39]">{money(workshop.priceARS)}</p>
          <ButtonLink href={`/talleres/${workshop.slug}`} variant="outline" className="w-full sm:w-auto">{t("Ver taller")}</ButtonLink>
        </div>
      </div>
    </article>);
}
