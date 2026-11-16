import type { MessageKey } from "@/lib/i18n/messages";

/** Only documented facts belong in materials/techniques. Unknown values stay null. */
export type ArtworkContent = {
  id: string;
  title: string;
  titleIsEditorial: boolean;
  collectionSlug: string;
  visualComposition: MessageKey;
  materials: MessageKey[];
  mainMaterial: MessageKey | null;
  complementaryMaterials: MessageKey[];
  techniques: MessageKey[];
  modelingTechnique: MessageKey | null;
  surfaceTreatment: MessageKey | null;
  glazesOrPigments: MessageKey | null;
  firingTechnique: MessageKey | null;
  artistIntent: MessageKey | null;
  artistIntentVerified: boolean;
  function: MessageKey | null;
  curatorialReading: MessageKey | null;
  verificationSources: string[];
  reviewStatus: "visual-observed-pending-artist" | "artist-approved";
  images: { originalName: string; alt: MessageKey; visualDescription: MessageKey }[];
};
