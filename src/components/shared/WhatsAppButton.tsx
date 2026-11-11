"use client";
import { useI18n } from "@/lib/i18n/provider";
import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { whatsappHref } from "@/lib/contact";
export function WhatsAppButton({ message, label, }: {
    message?: string;
    label?: string;
}) {
    const { t } = useI18n();
    return (<ButtonLink href={whatsappHref(message || t("Hola Yanina, quiero hacer una consulta."))} variant="secondary" target="_blank" rel="noreferrer">
      <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true"/>
      {label || t("Consultar por WhatsApp")}
    </ButtonLink>);
}
