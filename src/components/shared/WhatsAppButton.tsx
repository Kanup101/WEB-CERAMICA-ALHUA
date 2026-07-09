import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const phone = "5491100000000";

export function whatsappHref(message = "Hola Alhua, quiero hacer una consulta.") {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppButton({ message }: { message?: string }) {
  return (
    <ButtonLink href={whatsappHref(message)} variant="secondary" target="_blank" rel="noreferrer">
      <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
      Consultar por WhatsApp
    </ButtonLink>
  );
}
