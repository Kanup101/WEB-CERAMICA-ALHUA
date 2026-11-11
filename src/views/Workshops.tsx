"use client";
import { useI18n } from "@/lib/i18n/provider";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { getWorkshops } from "@/data/workshops";
export default function WorkshopsPage() {
    const { t, locale } = useI18n();
    const workshops = getWorkshops(locale);
    return (<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow={t("Talleres online")} title={t("Aprender ceramica con calma y oficio")} description={t("Encuentros online pensados para acompanar el proceso creativo, desde primeras piezas hasta colecciones con identidad.")}/>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {workshops.map((workshop) => (<WorkshopCard key={workshop.id} workshop={workshop}/>))}
      </div>
    </div>);
}
