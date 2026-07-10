import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { whatsappHref } from "@/lib/contact";

export function WhatsAppButton({
  message,
  label = "Consultar por WhatsApp",
}: {
  message?: string;
  label?: string;
}) {
  return (
    <ButtonLink href={whatsappHref(message)} variant="secondary" target="_blank" rel="noreferrer">
      <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
      {label}
    </ButtonLink>
  );
}
