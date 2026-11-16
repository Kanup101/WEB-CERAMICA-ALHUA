import manifest from "./collections-manifest.json";
import type { Collection } from "@/types/collection";
export const collectionRecords: Collection[] = manifest.collections;
export const getCollections = () => collectionRecords.filter(item => item.published && item.images.length).sort((a, b) => a.order - b.order);
export const getCollectionBySlug = (slug: string) => getCollections().find(item => item.slug === slug);
