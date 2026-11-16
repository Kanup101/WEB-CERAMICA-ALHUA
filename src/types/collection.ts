export type CollectionImage = {
  id: string; src: string; thumbnail: string; originalName: string;
  order: number; width: number; height: number; alt: string;
};
export type Collection = {
  id: string; slug: string; name: string; cover: string;
  images: CollectionImage[]; order: number; published: boolean;
};
