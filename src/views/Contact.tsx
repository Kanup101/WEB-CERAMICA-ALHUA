"use client";
import { useI18n } from "@/lib/i18n/provider";
import { Camera, Mail, MapPin, MessageCircle } from "lucide-react";
import { FAQAccordion } from "@/components/shared/FAQAccordion";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/lib/contact";
export default function ContactPage() {
    const { t } = useI18n();
    return (<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <SectionTitle eyebrow={t("Contacto")} title={t("Consultas, encargos y talleres")} description={t("Escribinos para consultar disponibilidad, coordinar envios o resolver dudas sobre talleres online. Respondemos de forma manual y cercana.")}/>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={(event) => event.preventDefault()} className="rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-5 shadow-[0_18px_60px_rgba(74,55,40,0.07)] sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("Nombre")} id="name" placeholder={t("Tu nombre")}/>
            <Field label={t("Email")} id="email" placeholder={t("Email")} type="email"/>
          </div>
          <div className="mt-5">
            <Field label={t("Asunto")} id="subject" placeholder={t("Consulta por pieza, taller o envio")}/>
          </div>
          <div className="mt-5">
            <label htmlFor="message" className="text-sm font-medium text-[#342A24]">{t("Mensaje")}</label>
            <textarea id="message" rows={6} placeholder={t("Contanos que pieza o taller te interesa")} className="mt-2 w-full rounded-3xl border border-[#D8C3AA] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8F5F45]"/>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg" disabled title={t("Formulario visual sin backend por ahora")}>{t("Enviar consulta")}</Button>
            <WhatsAppButton />
          </div>
          <p className="mt-3 text-sm text-[#8B6E54]">{t("Formulario visual sin backend real por ahora. Para consultas reales, usar WhatsApp o email.")}</p>
        </form>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-6">
            <h2 className="text-xl font-semibold text-[#342A24]">{t("Datos de contacto")}</h2>
            <div className="mt-5 space-y-4 text-sm text-[#6C5C50]">
              <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#8F5F45]" aria-hidden="true"/> {t("Argentina")}</p>
              <a className="flex items-center gap-3 hover:text-[#6F4A39]" href={`mailto:${contactInfo.email}`}><Mail className="h-5 w-5 text-[#8F5F45]" aria-hidden="true"/> {contactInfo.email}</a>
              {contactInfo.instagramUrl ? (<a className="flex items-center gap-3 hover:text-[#6F4A39]" href={contactInfo.instagramUrl} target="_blank" rel="noreferrer"><Camera className="h-5 w-5 text-[#8F5F45]" aria-hidden="true"/> {contactInfo.instagramUrl ? contactInfo.instagramHandle : t("Instagram pendiente de confirmar")}</a>) : (<p className="flex items-center gap-3"><Camera className="h-5 w-5 text-[#8F5F45]" aria-hidden="true"/> {contactInfo.instagramUrl ? contactInfo.instagramHandle : t("Instagram pendiente de confirmar")}</p>)}
              <p className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-5 w-5 text-[#8F5F45]" aria-hidden="true"/> {contactInfo.whatsappLabel}: {contactInfo.phoneDisplay}</p>
            </div>
          </div>
          <FAQAccordion />
        </aside>
      </div>
    </div>);
}
function Field({ label, id, placeholder, type = "text" }: {
    label: string;
    id: string;
    placeholder: string;
    type?: string;
}) {
    return (<div>
      <label htmlFor={id} className="text-sm font-medium text-[#342A24]">
        {label}
      </label>
      <input id={id} type={type} placeholder={placeholder} className="mt-2 h-12 w-full rounded-full border border-[#D8C3AA] bg-white px-4 text-sm outline-none transition focus:border-[#8F5F45]"/>
    </div>);
}
