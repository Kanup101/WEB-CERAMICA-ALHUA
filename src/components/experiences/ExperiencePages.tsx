"use client";
import { useI18n } from "@/lib/i18n/provider";
import Image from "next/image";
import Link from "@/lib/i18n/Link";
import { Coffee, Hand, Heart, Leaf, Sparkles, Utensils } from "lucide-react";
import { VideoBlock } from "@/components/media/VideoBlock";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ButtonLink } from "@/components/ui/button";
import { getExperiences } from "@/data/experiences";
import { experienceWhatsAppMessage, whatsappHref } from "@/lib/contact";
import type { Experience } from "@/types/experience";
function Inquiry({ experience, short = false }: {
    experience: Experience;
    short?: boolean;
}) {
    const { t, locale } = useI18n();
    return <ButtonLink className="h-auto min-h-12 whitespace-normal py-3 text-center" href={whatsappHref(experienceWhatsAppMessage(experience, locale))} target="_blank" rel="noreferrer">
    {(short ? t("Consultar disponibilidad") : t("Consultar disponibilidad por WhatsApp"))}
  </ButtonLink>;
}
export function ExperienceCard({ experience }: {
    experience: Experience;
}) {
    const { t, money } = useI18n();
    const image = experience.images[0];
    return <article className="grid overflow-hidden rounded-[2rem] border border-[#D8B79C] bg-[#FFF9EF] md:grid-cols-2">
    <div className="relative min-h-80 md:min-h-[440px]"><Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw"/></div>
    <div className="flex flex-col justify-center p-6 sm:p-10">
      <p className="text-sm uppercase tracking-[0.16em] text-[#6F4A39]">{experience.location}</p>
      <h3 className="mt-4 font-brand text-4xl">{experience.title}</h3>
      <p className="mt-4 leading-7 text-[#6C5C50]">{experience.subtitle}</p>
      <p className="my-6 text-xl font-semibold">{money(experience.priceUSD, "USD")} <span className="text-sm font-normal">{t("por persona")}</span></p>
      <div className="flex flex-wrap gap-3"><ButtonLink variant="outline" href={`/experiencias/${experience.slug}`}>{t("Ver experiencia")}</ButtonLink><Inquiry experience={experience} short/></div>
    </div>
  </article>;
}
export function ExperiencesIndex() {
    const { t, locale } = useI18n();
    const experiences = getExperiences(locale);
    return <div lang={locale} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

    <header className="mb-12 max-w-3xl"><p className="text-sm uppercase tracking-[0.18em] text-[#6F4A39]">{t("Salta \u00B7 Argentina")}</p>
      <h1 className="mt-4 font-brand text-5xl sm:text-7xl">{t("Experiencias para compartir")}</h1>
      <p className="mt-6 text-lg leading-8 text-[#4B4038]">{t("Un encuentro con la tierra, la creatividad y las personas. Con Yanina Cardozo, acercate al universo de la cer\u00E1mica en Salta y compart\u00ED un momento de creaci\u00F3n e intercambio cultural.")}</p>
    </header>
    <div className="space-y-8">{experiences.map(experience => <ExperienceCard key={experience.id} experience={experience}/>)}</div>
  </div>;
}
const icons = { materials: Leaf, hand: Hand, culture: Sparkles, mate: Coffee, food: Utensils, host: Heart };
export function ExperienceDetail({ experience }: {
    experience: Experience;
}) {
    const { t, locale, money } = useI18n();
    const hero = experience.images[0];
    const practical = [
        [t("Duración"), experience.duration],
        [t("Punto de encuentro"), experience.meetingPoint],
        [t("Idiomas disponibles"), experience.language?.join(", ")],
        [t("Participantes"), experience.capacity],
        [t("Disponibilidad"), experience.availability],
        [t("Condiciones de reserva"), experience.bookingConditions],
        [t("Entrega de piezas"), experience.pieceDelivery],
    ].filter(([, value]) => value !== undefined && value !== "");
    return <div lang={locale} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

    <Link href={"/experiencias"} className="text-sm underline underline-offset-4">← {t("Todas las experiencias")}</Link>
    <header className="mt-8 grid items-center gap-10 lg:grid-cols-2">
      <div><p className="text-sm uppercase tracking-widest text-[#6F4A39]">{experience.location}</p>
        <h1 className="mt-5 font-brand text-5xl leading-tight sm:text-7xl">{experience.title}</h1>
        <p className="mt-6 text-xl leading-8 text-[#4B4038]">{experience.subtitle}</p>
        <p className="my-7 text-3xl font-semibold">{money(experience.priceUSD, "USD")} <span className="text-base font-normal">{t("por persona")}</span></p>
        <Inquiry experience={experience}/>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EFE4D4]"><Image src={hero.src} alt={hero.alt} fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw"/></div>
    </header>
    <section className="mx-auto max-w-3xl py-16 sm:py-20"><SectionTitle eyebrow={t("Crear \u00B7 compartir \u00B7 encontrarnos")} title={t("Un momento para acercarte al barro")}/><p className="mt-6 text-lg leading-8 text-[#4B4038]">{experience.description}</p></section>
    <section className="rounded-[2rem] bg-[#FFF9EF] p-6 sm:p-10">
      <SectionTitle title={t("Qu\u00E9 incluye el encuentro")}/>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{experience.includes.map(item => {
            const Icon = icons[item.icon];
            return <li key={item.icon} className="flex items-center gap-4 rounded-2xl border border-[#E1D1BB] p-5"><Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-[#8F5F45]"/><span>{item.text}</span></li>;
        })}</ul>
    </section>
    <section className="grid gap-10 py-16 lg:grid-cols-2">
      <div><SectionTitle title={t("Antes de encontrarnos")}/>
        <p className="mt-6 leading-7">{t("La actividad se desarrolla en Salta, Argentina, con Yanina Cardozo. Consult\u00E1 por WhatsApp las fechas, duraci\u00F3n, punto de encuentro, idiomas, cantidad de participantes y condiciones antes de coordinar tu visita.")}</p>
        {practical.length > 0 && <dl className="mt-5 space-y-3">{practical.map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd>{value}</dd></div>)}</dl>}
      </div>
      <div className="rounded-3xl border border-[#D8B79C] p-6 sm:p-8"><h3 className="font-brand text-3xl">{t("Cada pieza tiene sus tiempos")}</h3>
        <p className="mt-4 leading-7">{t("El modelado es parte del encuentro. No se garantiza una pieza terminada y cocida el mismo d\u00EDa. La conservaci\u00F3n, entrega o eventual env\u00EDo de la pieza quedan sujetos a confirmaci\u00F3n con Yanina.")}</p>
      </div>
    </section>
    <section><SectionTitle title={t("La materia, de cerca")} description={t("Fotograf\u00EDas del archivo cer\u00E1mico del sitio. Las im\u00E1genes espec\u00EDficas de este encuentro se incorporar\u00E1n m\u00E1s adelante.")}/>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">{experience.images.map(image => <figure key={image.src}><div className="relative aspect-[4/5] overflow-hidden rounded-3xl"><Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(min-width: 640px) 45vw, 100vw"/></div><figcaption className="mt-3 text-sm text-[#6C5C50]">{image.alt}</figcaption></figure>)}</div>
    </section>
    {experience.videoUrl && <div className="mt-16"><VideoBlock title={experience.title} videoUrl={experience.videoUrl} poster={experience.videoPoster}/></div>}
    <section className="mt-16 rounded-[2rem] bg-[#FFF9EF] px-5 py-12 text-center sm:px-10"><h2 className="font-brand text-4xl">{t("\u00BFCompartimos un encuentro?")}</h2>
      <p className="my-5 text-xl">{money(experience.priceUSD, "USD")} {t("por persona")}</p><Inquiry experience={experience}/>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#6C5C50]">{t("La consulta no constituye una reserva confirmada. Coordin\u00E1 disponibilidad y condiciones directamente con Yanina; no se realizan cobros en esta p\u00E1gina.")}</p>
    </section>
  </div>;
}
