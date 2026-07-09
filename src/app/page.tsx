import Image from "next/image";
import { ArrowRight, Hand, Heart, Leaf, Sparkles } from "lucide-react";
import { ProductGrid } from "@/components/commerce/ProductGrid";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ButtonLink } from "@/components/ui/button";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { products } from "@/data/products";
import { workshops } from "@/data/workshops";

export default function Home() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  const featuredWorkshops = workshops.filter((workshop) => workshop.featured).slice(0, 2);

  return (
    <div>
      <section className="relative overflow-hidden bg-[#F4E8D9]">
        <div className="absolute inset-0 opacity-40">
          <Image src="/images/products/placeholder-ceramica.svg" alt="" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full bg-[#FFF9EF]/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6F4A39]">
              Ceramica artesanal hecha en Argentina
            </p>
            <h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight text-[#2F251F] sm:text-7xl">
              Objetos de calma, oficio y belleza natural.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4B4038]">
              Alhua crea piezas de ceramica artesanal y talleres online para quienes buscan habitar lo cotidiano con manos, materia y pausa.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/tienda" size="lg">
                Ver piezas <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/talleres" variant="outline" size="lg">
                Ver talleres
              </ButtonLink>
              <WhatsAppButton />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Coleccion" title="Piezas destacadas" description="Series pequeñas y piezas unicas, creadas para acompañar rituales diarios con textura, forma y presencia." />
        <div className="mt-10">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="bg-[#EFE4D4] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Aprender" title="Talleres online" description="Experiencias guiadas para entrar en la ceramica desde casa, con una mirada sensible y tecnica." />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {featuredWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionTitle eyebrow="Historia" title="Una marca nacida del contacto con la tierra" description="Alhua trabaja con formas simples, paletas terrosas y procesos lentos. Cada pieza conserva una huella: el gesto de las manos, el fuego y la sorpresa del esmalte." />
          <ButtonLink href="/sobre-alhua" variant="outline" className="mt-8">
            Conocer la historia
          </ButtonLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Hand, title: "Modelado lento", text: "Piezas torneadas o construidas a mano." },
            { icon: Leaf, title: "Paleta natural", text: "Crema, arcilla, oliva y carbon suave." },
            { icon: Heart, title: "Objetos cercanos", text: "Para usar, regalar y atesorar." },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6">
              <item.icon className="h-7 w-7 text-[#8F5F45]" />
              <h3 className="mt-5 font-semibold text-[#342A24]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6C5C50]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#3B3029] py-20 text-[#FFF9EF]">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Sparkles className="mx-auto h-8 w-8 text-[#D8B79C]" />
          <h2 className="mt-5 font-serif text-4xl font-semibold">Novedades, aperturas de talleres y nuevas piezas</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#E7D2BA]">
            Sumate a la comunidad Alhua para recibir lanzamientos en tandas pequeñas y contenidos sobre ceramica creativa.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
