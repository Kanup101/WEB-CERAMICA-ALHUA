import type { Metadata } from "next";
import { Camera, Mail, MapPin } from "lucide-react";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a Alhua Ceramica Creativa por piezas artesanales, talleres online, envios y consultas por WhatsApp o Instagram.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Contacto"
        title="Consultas, encargos y talleres"
        description="Escribinos para consultar disponibilidad, coordinar envios o resolver dudas sobre los talleres online."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <form className="rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6 shadow-[0_18px_60px_rgba(74,55,40,0.07)]">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre" id="name" placeholder="Tu nombre" />
            <Field label="Email" id="email" placeholder="tu@email.com" type="email" />
          </div>
          <div className="mt-5">
            <Field label="Asunto" id="subject" placeholder="Consulta por pieza, taller o envio" />
          </div>
          <div className="mt-5">
            <label htmlFor="message" className="text-sm font-medium text-[#342A24]">
              Mensaje
            </label>
            <textarea
              id="message"
              rows={6}
              placeholder="Contanos en que podemos ayudarte"
              className="mt-2 w-full rounded-3xl border border-[#D8C3AA] bg-white px-4 py-3 text-sm outline-none focus:border-[#8F5F45]"
            />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg">
              Enviar consulta
            </Button>
            <WhatsAppButton />
          </div>
          <p className="mt-3 text-sm text-[#8B6E54]">Formulario visual sin backend real por ahora.</p>
        </form>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6">
            <h2 className="text-xl font-semibold text-[#342A24]">Datos de contacto</h2>
            <div className="mt-5 space-y-4 text-sm text-[#6C5C50]">
              <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#8F5F45]" /> Argentina</p>
              <a className="flex items-center gap-3" href="mailto:hola@alhua.com"><Mail className="h-5 w-5 text-[#8F5F45]" /> hola@alhua.com</a>
              <a className="flex items-center gap-3" href="https://instagram.com" target="_blank" rel="noreferrer"><Camera className="h-5 w-5 text-[#8F5F45]" /> @alhua.ceramica</a>
            </div>
          </div>
          <FAQAccordion />
        </aside>
      </div>
    </div>
  );
}

function Field({ label, id, placeholder, type = "text" }: { label: string; id: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-[#342A24]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-full border border-[#D8C3AA] bg-white px-4 text-sm outline-none focus:border-[#8F5F45]"
      />
    </div>
  );
}
