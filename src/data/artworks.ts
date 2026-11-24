import records from "./artworks.json";
import type { ArtworkContent } from "@/types/artwork";
import type { MessageKey } from "@/lib/i18n/messages";

export const artworkRecords = records as ArtworkContent[];
const photoIndex = new Map(artworkRecords.flatMap(artwork => artwork.images.map(image => [image.originalName, { artwork, image }] as const)));
export const getArtworkForImage = (originalName: string) => photoIndex.get(originalName);
export function getPhotoContent(originalName: string, t: (key: MessageKey) => string) {
  const content = getArtworkForImage(originalName);
  return content ? {
    alt: `${content.artwork.title}. ${t(content.image.alt)}`,
    description: t(content.image.visualDescription),
    artwork: content.artwork,
  } : undefined;
}
