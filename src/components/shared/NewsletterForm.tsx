"use client";
import { useI18n } from "@/lib/i18n/provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export function NewsletterForm() {
    const { t } = useI18n();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    return (<form noValidate className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => {
            event.preventDefault();
            const email = event.currentTarget.elements.namedItem("newsletter-email") as HTMLInputElement;
            setError(!email.validity.valid);
            setSubmitted(email.validity.valid);
        }}>
      <div className="flex-1">
        <label className="sr-only" htmlFor="newsletter-email">{t("Email")}</label>
        <input id="newsletter-email" name="newsletter-email" type="email" required placeholder={t("Email")} aria-invalid={error} aria-describedby="newsletter-status" className="h-12 w-full rounded-full border border-[#D2BDA3] bg-white px-5 text-sm text-[#342A24] outline-none transition placeholder:text-[#9C8B7B] focus:border-[#8F5F45]"/>
        <p id="newsletter-status" role="status" aria-live="polite" className="mt-2 text-sm">{error ? t("Ingresá un email válido.") : submitted ? t("Gracias. Te avisaremos cuando haya novedades.") : t("Este sitio no guarda suscripciones todavía. Podés consultar las novedades por WhatsApp.")}</p>
      </div>
      <Button type="submit" size="lg">{t("Suscribirme")}</Button>
    </form>);
}
