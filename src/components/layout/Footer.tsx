"use client";
import { useI18n } from "@/lib/i18n/provider";
import Link from "@/lib/i18n/Link";
import { Camera, Mail, MapPin } from "lucide-react";
import { contactInfo, whatsappHref } from "@/lib/contact";
export function Footer() {
    const { t } = useI18n();
    return (<footer className="border-t border-[#E1D1BB] bg-[#3B3029] text-[#FFF9EF]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="font-brand text-4xl font-semibold">Yanina Cardozo</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#E7D2BA]">{t("Artista ceramista en Argentina: piezas utilitarias, objetos unicos y talleres online para acercarte al proceso ceramico.")}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D8B79C]">{t("Explorar")}</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#F4E8D9]">
            <Link href="/tienda">{t("Tienda")}</Link>
            <Link href="/talleres">{t("Talleres")}</Link>
            <Link href="/experiencias">{t("Experiencias")}</Link>
            <Link href="/sobre-yanina">{t("Sobre Yanina")}</Link>
            <Link href="/contacto">{t("Contacto")}</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D8B79C]">{t("Contacto")}</h3>
          <div className="mt-4 space-y-3 text-sm text-[#F4E8D9]">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {t("Argentina")}</p>
            <a className="flex items-center gap-2" href={`mailto:${contactInfo.email}`}><Mail className="h-4 w-4"/> {contactInfo.email}</a>
            {contactInfo.instagramUrl ? (<a className="flex items-center gap-2" href={contactInfo.instagramUrl} target="_blank" rel="noreferrer"><Camera className="h-4 w-4"/> {contactInfo.instagramUrl ? contactInfo.instagramHandle : t("Instagram pendiente de confirmar")}</a>) : (<p className="flex items-center gap-2"><Camera className="h-4 w-4"/> {contactInfo.instagramUrl ? contactInfo.instagramHandle : t("Instagram pendiente de confirmar")}</p>)}
            <a href={whatsappHref(t("Hola Yanina, quiero hacer una consulta."))} target="_blank" rel="noreferrer">WhatsApp {contactInfo.phoneDisplay}</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-[#D8B79C]">{t("Yanina Cardozo Ceramica Creativa. Sitio preparado para ecommerce, talleres y futuras integraciones.")}</div>
    </footer>);
}
