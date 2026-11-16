"use client";
import { useI18n } from "@/lib/i18n/provider";
import type { ArtworkContent } from "@/types/artwork";
import type { MessageKey } from "@/lib/i18n/messages";

export function ArtworkInformation({ artwork }: { artwork: ArtworkContent }) {
  const { t } = useI18n();
  const pending = t("Pendiente de confirmación de Yanina.");
  const fields: [MessageKey, MessageKey | null][] = [
    ["Material principal", artwork.mainMaterial],
    ["Técnica de modelado", artwork.modelingTechnique],
    ["Tratamiento de superficie", artwork.surfaceTreatment],
    ["Esmaltes o pigmentos", artwork.glazesOrPigments],
    ["Técnica de cocción", artwork.firingTechnique],
    ["Función de la obra", artwork.function],
    ["Intención de la artista", artwork.artistIntentVerified ? artwork.artistIntent : null],
  ];
  return <details className="artwork-information">
    <summary>{t("Materiales e intención")}<span aria-hidden="true">+</span></summary>
    <dl>
      {fields.map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{value ? t(value) : pending}</dd></div>)}
      <div><dt>{t("Materiales complementarios")}</dt><dd>{artwork.complementaryMaterials.length ? artwork.complementaryMaterials.map(key => t(key)).join(" · ") : pending}</dd></div>
    </dl>
    {artwork.curatorialReading && <div className="curatorial-reading"><h4>{t("Lectura curatorial")}</h4><p>{t(artwork.curatorialReading)}</p><small>{t("Interpretación propuesta; no atribuida a la artista.")}</small></div>}
  </details>;
}
