import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Coffee, Hand, Heart, Leaf, Sparkles, Utensils } from "lucide-react";
import { VideoBlock } from "@/components/media/VideoBlock";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { ButtonLink } from "@/components/ui/button";
import { experiences } from "@/data/experiences";
import { experienceWhatsAppMessage, whatsappHref } from "@/lib/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Experience } from "@/types/experience";

export const experiencePath = (locale: Locale, slug = "") => `${locale === "en" ? "/en" : ""}/experiencias${slug ? `/${slug}` : ""}`;

export function experienceMetadata(locale: Locale, experience?: Experience): Metadata {
  const title = `${experience ? `${experience.title} | ` : ""}${locale === "es" ? "Experiencias de cerámica en Salta" : "Ceramics experiences in Salta"} | Yanina Cardozo`;
  const description = locale === "es"
    ? "Cerámica artesanal y turismo cultural en Salta con Yanina Cardozo. Barro, mates y encuentros: una actividad creativa para turistas, USD 35 por persona."
    : "Handmade ceramics and cultural tourism in Salta with Yanina Cardozo. Barro, mates y encuentros: a creative activity for visitors, USD 35 per person.";
  return { title: { absolute: title }, description,
    openGraph: { title, description, type: "website", locale: locale === "es" ? "es_AR" : "en_US" },
    alternates: { languages: { es: experiencePath("es", experience?.slug), en: experiencePath("en", experience?.slug) } },
  };
}

function LanguageLinks({ locale, slug }: { locale: Locale; slug?: string }) {
  return <nav aria-label={locale === "es" ? "Idioma de esta sección" : "Section language"} className="mb-8 flex gap-4 text-sm">
    <Link href={experiencePath("es", slug)} hrefLang="es" lang="es" aria-current={locale === "es" ? "page" : undefined} className="underline underline-offset-4">Español</Link>
    <Link href={experiencePath("en", slug)} hrefLang="en" lang="en" aria-current={locale === "en" ? "page" : undefined} className="underline underline-offset-4">English</Link>
  </nav>;
}

function Inquiry({ experience, locale, short = false }: { experience: Experience; locale: Locale; short?: boolean }) {
  return <ButtonLink className="h-auto min-h-12 whitespace-normal py-3 text-center" href={whatsappHref(experienceWhatsAppMessage(experience, locale))} target="_blank" rel="noreferrer">
    {locale === "es" ? (short ? "Consultar disponibilidad" : "Consultar disponibilidad por WhatsApp") : (short ? "Ask about availability" : "Ask about availability on WhatsApp")}
  </ButtonLink>;
}

export function ExperienceCard({ experience, locale = "es" }: { experience: Experience; locale?: Locale }) {
  const image = experience.images[0];
  return <article className="grid overflow-hidden rounded-[2rem] border border-[#D8B79C] bg-[#FFF9EF] md:grid-cols-2">
    <div className="relative min-h-80 md:min-h-[440px]"><Image src={image.src} alt={image.alt[locale]} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" /></div>
    <div className="flex flex-col justify-center p-6 sm:p-10">
      <p className="text-sm uppercase tracking-[0.16em] text-[#6F4A39]">{experience.location}</p>
      <h3 className="mt-4 font-brand text-4xl">{experience.title}</h3>
      <p className="mt-4 leading-7 text-[#6C5C50]">{experience.subtitle[locale]}</p>
      <p className="my-6 text-xl font-semibold">USD {experience.priceUSD} <span className="text-sm font-normal">{locale === "es" ? "por persona" : "per person"}</span></p>
      <div className="flex flex-wrap gap-3"><ButtonLink variant="outline" href={experiencePath(locale, experience.slug)}>{locale === "es" ? "Ver experiencia" : "View experience"}</ButtonLink><Inquiry experience={experience} locale={locale} short /></div>
    </div>
  </article>;
}

export function ExperiencesIndex({ locale }: { locale: Locale }) {
  return <div lang={locale} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <LanguageLinks locale={locale} />
    <header className="mb-12 max-w-3xl"><p className="text-sm uppercase tracking-[0.18em] text-[#6F4A39]">Salta · Argentina</p>
      <h1 className="mt-4 font-brand text-5xl sm:text-7xl">{locale === "es" ? "Experiencias para compartir" : "Experiences to share"}</h1>
      <p className="mt-6 text-lg leading-8 text-[#4B4038]">{locale === "es" ? "Un encuentro con la tierra, la creatividad y las personas. Con Yanina Cardozo, acercate al universo de la cerámica en Salta y compartí un momento de creación e intercambio cultural." : "A meeting of earth, creativity and people. Discover the world of ceramics in Salta with Yanina Cardozo and share a moment of making and cultural exchange."}</p>
    </header>
    <div className="space-y-8">{experiences.map(experience => <ExperienceCard key={experience.id} experience={experience} locale={locale} />)}</div>
  </div>;
}

const icons = { materials: Leaf, hand: Hand, culture: Sparkles, mate: Coffee, food: Utensils, host: Heart };

export function ExperienceDetail({ experience, locale }: { experience: Experience; locale: Locale }) {
  const es = locale === "es";
  const hero = experience.images[0];
  const practical = [
    [es ? "Duración" : "Duration", experience.duration?.[locale]],
    [es ? "Punto de encuentro" : "Meeting point", experience.meetingPoint?.[locale]],
    [es ? "Idiomas disponibles" : "Available languages", experience.language?.join(", ")],
    [es ? "Participantes" : "Participants", experience.capacity],
    [es ? "Disponibilidad" : "Availability", experience.availability?.[locale]],
    [es ? "Condiciones de reserva" : "Booking conditions", experience.bookingConditions?.[locale]],
    [es ? "Entrega de piezas" : "Piece collection", experience.pieceDelivery?.[locale]],
  ].filter(([, value]) => value !== undefined && value !== "");
  return <div lang={locale} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <LanguageLinks locale={locale} slug={experience.slug} />
    <Link href={experiencePath(locale)} className="text-sm underline underline-offset-4">← {es ? "Todas las experiencias" : "All experiences"}</Link>
    <header className="mt-8 grid items-center gap-10 lg:grid-cols-2">
      <div><p className="text-sm uppercase tracking-widest text-[#6F4A39]">{experience.location}</p>
        <h1 className="mt-5 font-brand text-5xl leading-tight sm:text-7xl">{experience.title}</h1>
        <p className="mt-6 text-xl leading-8 text-[#4B4038]">{experience.subtitle[locale]}</p>
        <p className="my-7 text-3xl font-semibold">USD {experience.priceUSD} <span className="text-base font-normal">{es ? "por persona" : "per person"}</span></p>
        <Inquiry experience={experience} locale={locale} />
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EFE4D4]"><Image src={hero.src} alt={hero.alt[locale]} fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" /></div>
    </header>
    <section className="mx-auto max-w-3xl py-16 sm:py-20"><SectionTitle eyebrow={es ? "Crear · compartir · encontrarnos" : "Create · share · connect"} title={es ? "Un momento para acercarte al barro" : "A moment to connect with clay"} /><p className="mt-6 text-lg leading-8 text-[#4B4038]">{experience.description[locale]}</p></section>
    <section className="rounded-[2rem] bg-[#FFF9EF] p-6 sm:p-10">
      <SectionTitle title={es ? "Qué incluye el encuentro" : "What is included"} />
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{experience.includes.map(item => {
        const Icon = icons[item.icon];
        return <li key={item.icon} className="flex items-center gap-4 rounded-2xl border border-[#E1D1BB] p-5"><Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-[#8F5F45]" /><span>{item.text[locale]}</span></li>;
      })}</ul>
    </section>
    <section className="grid gap-10 py-16 lg:grid-cols-2">
      <div><SectionTitle title={es ? "Antes de encontrarnos" : "Before we meet"} />
        <p className="mt-6 leading-7">{es ? "La actividad se desarrolla en Salta, Argentina, con Yanina Cardozo. Consultá por WhatsApp las fechas, duración, punto de encuentro, idiomas, cantidad de participantes y condiciones antes de coordinar tu visita." : "The activity takes place in Salta, Argentina, with Yanina Cardozo. Please ask on WhatsApp about dates, duration, meeting point, languages, group size and booking conditions before arranging your visit."}</p>
        {practical.length > 0 && <dl className="mt-5 space-y-3">{practical.map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd>{value}</dd></div>)}</dl>}
      </div>
      <div className="rounded-3xl border border-[#D8B79C] p-6 sm:p-8"><h3 className="font-brand text-3xl">{es ? "Cada pieza tiene sus tiempos" : "Every piece takes its own time"}</h3>
        <p className="mt-4 leading-7">{es ? "El modelado es parte del encuentro. No se garantiza una pieza terminada y cocida el mismo día. La conservación, entrega o eventual envío de la pieza quedan sujetos a confirmación con Yanina." : "Hand-building is part of the gathering. A finished, fired piece on the same day is not guaranteed. Storage, collection or possible shipping of your piece must be confirmed with Yanina."}</p>
      </div>
    </section>
    <section><SectionTitle title={es ? "La materia, de cerca" : "A closer look at the materials"} description={es ? "Fotografías del archivo cerámico del sitio. Las imágenes específicas de este encuentro se incorporarán más adelante." : "Photographs from the website’s ceramics archive. Photos of this specific gathering will be added later."} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">{experience.images.map(image => <figure key={image.src}><div className="relative aspect-[4/5] overflow-hidden rounded-3xl"><Image src={image.src} alt={image.alt[locale]} fill className="object-cover" sizes="(min-width: 640px) 45vw, 100vw" /></div><figcaption className="mt-3 text-sm text-[#6C5C50]">{image.alt[locale]}</figcaption></figure>)}</div>
    </section>
    {experience.videoUrl && <div className="mt-16"><VideoBlock title={experience.title} videoUrl={experience.videoUrl} poster={experience.videoPoster} /></div>}
    <section className="mt-16 rounded-[2rem] bg-[#FFF9EF] px-5 py-12 text-center sm:px-10"><h2 className="font-brand text-4xl">{es ? "¿Compartimos un encuentro?" : "Shall we create together?"}</h2>
      <p className="my-5 text-xl">USD {experience.priceUSD} {es ? "por persona" : "per person"}</p><Inquiry experience={experience} locale={locale} />
      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#6C5C50]">{es ? "La consulta no constituye una reserva confirmada. Coordiná disponibilidad y condiciones directamente con Yanina; no se realizan cobros en esta página." : "Your enquiry is not a confirmed booking. Arrange availability and conditions directly with Yanina; there are no payments on this page."}</p>
    </section>
  </div>;
}
