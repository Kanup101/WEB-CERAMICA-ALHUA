import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { getWorkshopBySlug, workshops } from "@/data/workshops";
import { formatARS } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return workshops.map((workshop) => ({ slug: workshop.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);
  if (!workshop) return {};

  return {
    title: workshop.title,
    description: `${workshop.subtitle} Taller online de ceramica creativa.`,
  };
}

export default async function WorkshopDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EFE4D4]">
          <Image src={workshop.image} alt={workshop.title} fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>
        <div className="lg:pt-8">
          <p className="text-sm uppercase tracking-[0.16em] text-[#8B6E54]">{workshop.level}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight text-[#342A24]">{workshop.title}</h1>
          <p className="mt-5 text-xl leading-8 text-[#4B4038]">{workshop.subtitle}</p>
          <p className="mt-5 leading-7 text-[#6C5C50]">{workshop.description}</p>
          <div className="mt-8 grid gap-3 rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6 text-[#4B4038] sm:grid-cols-2">
            <p><strong>Duracion:</strong> {workshop.duration}</p>
            <p><strong>Modalidad:</strong> {workshop.modality}</p>
            <p><strong>Lugares:</strong> {workshop.availableSpots}</p>
            <p><strong>Precio:</strong> {formatARS(workshop.priceARS)}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={undefined}>
              Reservar lugar
            </Button>
            <WhatsAppButton message={`Hola Alhua, quiero consultar por el taller ${workshop.title}.`} />
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        <List title="Que aprenderas" items={workshop.includes} />
        <List title="Para quien es" items={["Personas curiosas", "Ceramistas en formacion", "Quienes buscan una practica creativa pausada"]} />
        <List title="Materiales necesarios" items={workshop.materialsNeeded} />
      </div>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6">
      <h2 className="text-xl font-semibold text-[#342A24]">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6C5C50]">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#6F7A4B]" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
