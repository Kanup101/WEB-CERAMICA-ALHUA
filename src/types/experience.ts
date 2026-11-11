import type { Locale } from "@/lib/i18n/config";

export type LocalizedText = Record<Locale, string>;

export type Experience = {
  id: string;
  slug: string;
  title: string;
  subtitle: LocalizedText;
  description: LocalizedText;
  priceUSD: number;
  currency: "USD";
  location: string;
  duration?: LocalizedText;
  meetingPoint?: LocalizedText;
  includes: { icon: "materials" | "hand" | "culture" | "mate" | "food" | "host"; text: LocalizedText }[];
  images: { src: string; alt: LocalizedText }[];
  featured: boolean;
  available?: boolean;
  capacity?: number;
  language?: string[];
  availability?: LocalizedText;
  bookingConditions?: LocalizedText;
  pieceDelivery?: LocalizedText;
  videoUrl?: string;
  videoPoster?: string;
};
