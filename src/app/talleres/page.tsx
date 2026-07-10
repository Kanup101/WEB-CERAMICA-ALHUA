import type { Metadata } from "next";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { workshops } from "@/data/workshops";

export const metadata: Metadata = {
  title: "Talleres online de ceramica | Yanina Cardozo",
  description:
    "Talleres online de ceramica creativa con Yanina Cardozo para aprender tecnicas manuales, esmaltes y piezas utilitarias desde Argentina.",
};

export default function WorkshopsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Talleres online"
        title="Aprender ceramica con calma y oficio"
        description="Encuentros online pensados para acompanar el proceso creativo, desde primeras piezas hasta colecciones con identidad."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} />
        ))}
      </div>
    </div>
  );
}
