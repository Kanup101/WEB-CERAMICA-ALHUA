import Image from "next/image";
import type { Metadata } from "next";
import { Flame, Hand, Leaf } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";

export const metadata: Metadata = {
  title: "Sobre Yanina | Ceramica artesanal argentina",
  description:
    "Historia, filosofia y proceso creativo de Yanina Cardozo, artista ceramista dedicada a piezas hechas a mano y talleres online.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-2 lg:px-8">
        <div className="self-center">
          <SectionTitle
            eyebrow="Sobre Yanina"
            title="Ceramica creativa con raiz artesanal"
            description="La obra de Yanina nace del deseo de crear objetos cercanos: piezas que se usan, se miran y acompanan momentos cotidianos sin perder su caracter unico."
          />
          <div className="mt-6 space-y-5 leading-8 text-[#6C5C50]">
            <p>
              Trabajamos con arcilla, fuego y tiempos reales. Cada coleccion se piensa desde formas simples, paletas terrosas y superficies que invitan al tacto.
            </p>
            <p>
              No buscamos piezas perfectas en serie: buscamos objetos honestos, bien terminados y capaces de convivir con la vida diaria.
            </p>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EFE4D4]">
          <Image src="/images/products/barro-1.webp" alt="Detalle de arcilla y proceso artesanal de Yanina Cardozo" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </section>

      <section className="bg-[#EFE4D4] py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { icon: Hand, title: "Hecho a mano", text: "La huella manual no se oculta: es parte de la identidad de cada pieza." },
            { icon: Leaf, title: "Belleza natural", text: "Colores terrosos, superficies amables y una estetica serena, lista para crecer hacia nuevos mercados." },
            { icon: Flame, title: "Oficio y fuego", text: "Cada objeto atraviesa pruebas, secados y horneadas que transforman la materia en presencia." },
          ].map((item) => (
            <article key={item.title} className="rounded-3xl border border-[#D8C3AA] bg-[#FFF9EF] p-7">
              <item.icon className="h-8 w-8 text-[#8F5F45]" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-semibold text-[#342A24]">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#6C5C50]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          align="center"
          eyebrow="Proceso"
          title="Del barro a la mesa"
          description="Disenar, modelar, esperar, esmaltar y hornear. El proceso artesanal no es una linea recta: cada etapa pide escucha, paciencia y decisiones pequenas."
        />
      </section>
    </div>
  );
}
