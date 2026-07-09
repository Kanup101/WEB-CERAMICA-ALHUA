export type Workshop = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  priceARS: number;
  priceUSD?: number;
  duration: string;
  modality: string;
  level: string;
  image: string;
  includes: string[];
  materialsNeeded: string[];
  featured: boolean;
  availableSpots: number;
};
