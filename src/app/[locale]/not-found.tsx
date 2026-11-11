"use client";
import { useI18n } from "@/lib/i18n/provider";
import { ButtonLink } from "@/components/ui/button";
export default function NotFound() {
  const { t } = useI18n();
  return <div className="mx-auto max-w-3xl px-5 py-20 text-center"><h1 className="font-brand text-4xl">{t("Página no encontrada")}</h1><p className="my-6">{t("No encontramos esta página. Podés volver al inicio y seguir explorando.")}</p><ButtonLink href="/">{t("Volver al inicio")}</ButtonLink></div>;
}
