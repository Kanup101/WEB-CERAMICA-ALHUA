"use client";
import { useI18n } from "@/lib/i18n/provider";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { VideoBlock } from "@/components/media/VideoBlock";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getWorkshopBySlug } from "@/data/workshops";
import { workshopWhatsAppMessage } from "@/lib/contact";
export default function WorkshopDetailPage({ slug }: {
    slug: string;
}) {
    const { t, locale, money } = useI18n();
    const workshop = getWorkshopBySlug(slug, locale);
    if (!workshop) {
        notFound();
    }
    return (<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EFE4D4]">
          <Image src={workshop.image} alt={workshop.title} fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw"/>
        </div>
        <div className="lg:pt-8">
          <p className="text-sm uppercase tracking-[0.16em] text-[#8B6E54]">{workshop.level}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#342A24] sm:text-5xl">{workshop.title}</h1>
          <p className="mt-5 text-xl leading-8 text-[#4B4038]">{workshop.subtitle}</p>
          <p className="mt-5 leading-7 text-[#6C5C50]">{workshop.description}</p>
          <div className="mt-8 grid gap-3 rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6 text-[#4B4038] sm:grid-cols-2">
            <p><strong>{t("Duracion:")}</strong> {workshop.duration}</p>
            <p><strong>{t("Modalidad:")}</strong> {workshop.modality}</p>
            <p><strong>{t("Lugares:")}</strong> {workshop.availableSpots}</p>
            <p><strong>{t("Precio:")}</strong> {money(workshop.priceARS)}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton message={workshopWhatsAppMessage(workshop, locale)} label={t("Reservar por WhatsApp")}/>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        <List title={t("Que aprenderas")} items={workshop.includes}/>
        <List title={t("Para quien es")} items={[t("Personas curiosas"), t("Ceramistas en formacion"), t("Quienes buscan una practica creativa pausada")]}/>
        <List title={t("Materiales necesarios")} items={workshop.materialsNeeded}/>
      </div>

      <div className="mt-16">
        <VideoBlock title={workshop.introVideoTitle || t("Proximamente: video introductorio del taller")} description={workshop.introVideoDescription || t("Este espacio queda preparado para sumar una presentacion en video del taller.")} videoUrl={workshop.videoUrl} videoType={workshop.videoType} poster={workshop.videoPoster || workshop.image}/>
      </div>
    </div>);
}
function List({ title, items }: {
    title: string;
    items: string[];
}) {
    return (<section className="rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6">
      <h2 className="text-xl font-semibold text-[#342A24]">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6C5C50]">
        {items.map((item) => (<li key={item} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6F7A4B]"/>
            {item}
          </li>))}
      </ul>
    </section>);
}
