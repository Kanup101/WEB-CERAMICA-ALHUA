"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import Link from "@/lib/i18n/Link";
import { useI18n } from "@/lib/i18n/provider";
import { getCollections } from "@/data/collections";
import { getPhotoContent } from "@/data/artworks";
import type { Collection } from "@/types/collection";
import { ArtworkInformation } from "./ArtworkInformation";
import { CollectionLightbox } from "./CollectionLightbox";
import { Reveal } from "./Reveal";

function CollectionCover({ collection, index, featured }: { collection: Collection; index: number; featured: boolean }) {
  const { t } = useI18n();
  const image = collection.images.find(item => item.id === collection.cover) ?? collection.images[0];
  const content = getPhotoContent(image.originalName, t);
  const Heading = featured ? "h3" : "h2";
  return <Reveal className={`editorial-item editorial-position-${index % 6}`}>
    <Link href={`/colecciones/${collection.slug}`} className="editorial-collection" aria-label={collection.name}>
      <div className="editorial-cover">
        <Image src={index === 0 ? image.src : image.thumbnail} alt={content?.alt ?? image.alt} width={image.width} height={image.height} preload={!featured && index === 0} sizes="(max-width: 767px) 92vw, (max-width: 1200px) 52vw, 700px" />
        <span className="cover-arrow" aria-hidden="true"><ArrowUpRight /></span>
      </div>
      <div className="editorial-caption"><span className="collection-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><Heading className="font-brand">{collection.name}</Heading><span className="collection-image-count">{t("{count} fotografías", { count: collection.images.length })}</span></div>
    </Link>
  </Reveal>;
}

export function CollectionGrid({ featured = false }: { featured?: boolean }) {
  const { t } = useI18n();
  const collections = getCollections();
  // A deliberately composed selection; independent from the commercial inventory.
  const selection = featured ? ["cuando-la-tierra-me-mira", "paisajes-del-valle", "vasija-silbadora-ritual"].map(slug => collections.find(item => item.slug === slug)).filter((item): item is Collection => !!item) : collections;
  return <>
    {!selection.length && <p>{t("Colecciones próximamente")}</p>}
    <div className={featured ? "editorial-grid feature-grid" : "editorial-grid"}>
      {selection.map((collection, index) => <CollectionCover key={collection.id} collection={collection} index={index} featured={featured} />)}
    </div>
  </>;
}

export function CollectionsFeature() {
  const { t } = useI18n();
  return <section className="collection-exhibition exhibition-feature" aria-labelledby="home-collections-title">
    <div className="exhibition-shell">
      <header className="feature-header"><div><p className="exhibition-eyebrow">{t("Archivo de obras")}</p><h2 id="home-collections-title" className="font-brand">{t("Colecciones")}</h2></div><Link href="/colecciones" className="exhibition-text-link">{t("Ver todas las colecciones")}<ArrowUpRight aria-hidden="true" /></Link></header>
      <CollectionGrid featured />
    </div>
  </section>;
}

export function CollectionsIndex() {
  const { t } = useI18n();
  return <section className="collection-exhibition exhibition-catalog">
    <div className="exhibition-shell">
      <header className="exhibition-header">
        <div className="exhibition-kicker"><p>{t("Archivo de obras")}</p><p>{t("{count} colecciones", { count: getCollections().length })}</p></div>
        <h1 className="font-brand">{t("Colecciones")}</h1>
        <div className="exhibition-byline"><span>{"Yanina Cardozo"}</span><a href="#collection-archive" className="exhibition-text-link">{t("Explorar las colecciones")}<ArrowDown aria-hidden="true" /></a></div>
      </header>
      <div id="collection-archive"><CollectionGrid /></div>
    </div>
  </section>;
}

export function CollectionDetail({ collection }: { collection: Collection }) {
  const { t } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const cover = collection.images.find(image => image.id === collection.cover) ?? collection.images[0];
  const images = [cover, ...collection.images.filter(image => image.id !== cover.id)];
  const otherCollections = getCollections().filter(item => item.id !== collection.id);
  const currentIndex = getCollections().findIndex(item => item.id === collection.id);
  const next = otherCollections[currentIndex % otherCollections.length];
  return <section className="collection-exhibition exhibition-detail">
    <div className="exhibition-shell">
      <header className="collection-heading">
        <Link href="/colecciones" className="exhibition-text-link"><ArrowLeft aria-hidden="true" />{t("Volver a colecciones")}</Link>
        <div className="collection-title-line"><h1 className="font-brand">{collection.name}</h1><span>{t("{count} fotografías", { count: images.length })}</span></div>
      </header>
      <div className="artwork-walk">
        {images.map((image, index) => {
          const content = getPhotoContent(image.originalName, t);
          // The cover changes presentation order only; the lightbox follows that same order.
          return <Reveal key={image.id} className={`artwork-stop artwork-stop-${index % 4} ${image.width > image.height ? "landscape-stop" : ""}`}>
            <figure>
              <button type="button" className="artwork-image-button" data-photo={image.originalName} aria-label={t("Ampliar fotografía {number}", { number: index + 1 })} onClick={() => setActive(index)}>
                <Image src={index === 0 ? image.src : image.thumbnail} alt={content?.alt ?? image.alt} width={image.width} height={image.height} preload={index === 0} sizes="(max-width: 767px) 92vw, (min-width: 1440px) 850px, 65vw" />
                <span className="image-enlarge" aria-hidden="true"><Plus /></span>
              </button>
              <figcaption className="artwork-caption">
                <p className="exhibition-eyebrow">{String(index + 1).padStart(2, "0")}<span aria-hidden="true"> / </span>{String(images.length).padStart(2, "0")}</p>
                <h2 className="font-brand">{content?.artwork.title ?? collection.name}</h2>
                {content && <p className="artwork-description">{content.description}</p>}
                {content && <ArtworkInformation artwork={content.artwork} />}
              </figcaption>
            </figure>
          </Reveal>;
        })}
      </div>
      {next && <footer className="exhibition-next"><p className="exhibition-eyebrow">{t("Continuar el recorrido")}</p><Link href={`/colecciones/${next.slug}`} className="font-brand">{next.name}<ArrowUpRight aria-hidden="true" /></Link></footer>}
    </div>
    {active !== null && <CollectionLightbox collection={{ ...collection, images }} initialIndex={active} onClose={() => setActive(null)} />}
  </section>;
}
