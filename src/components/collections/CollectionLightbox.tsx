"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Plus, Minus } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { getPhotoContent } from "@/data/artworks";
import type { Collection } from "@/types/collection";
import { ArtworkInformation } from "./ArtworkInformation";

export function CollectionLightbox({ collection, initialIndex, onClose }: { collection: Collection; initialIndex: number; onClose: () => void }) {
  const { t } = useI18n();
  const [active, setActive] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const images = collection.images;
  const image = images[active];
  const content = getPhotoContent(image.originalName, t);
  const move = (delta: number) => setActive(value => (value + delta + images.length) % images.length);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const element = dialog.current;
    element?.showModal();
    closeButton.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return createPortal(<dialog ref={dialog} className="exhibition-lightbox" aria-label={collection.name} onCancel={onClose} onKeyDown={event => {
    // Do not hijack the arrow keys while the visitor reads inside an open disclosure.
    if (event.key === "Escape") { event.preventDefault(); onClose(); }
    if (event.target instanceof HTMLElement && event.target.closest("summary, details[open]")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  }}>
    <header className="lightbox-header">
      <span className="font-brand">{collection.name}</span>
      <p id="collection-photo-count" aria-live="polite">{t("Fotografía {number} de {total}", { number: active + 1, total: images.length })}</p>
      <button ref={closeButton} type="button" onClick={onClose} aria-label={t("Cerrar visor")}><X aria-hidden="true" /></button>
    </header>
    <div className={`lightbox-body ${showInfo ? "with-information" : ""}`}>
      <div className="lightbox-image" onTouchStart={event => { if (event.touches.length === 1) touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchCancel={() => { touch.current = null; }} onTouchEnd={event => {
        if (!touch.current || !event.changedTouches.length) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? -1 : 1);
        touch.current = null;
      }}>
        <Image key={image.id} src={image.src} alt={content?.alt ?? image.alt} fill sizes={showInfo ? "(min-width: 900px) 70vw, 100vw" : "100vw"} className="lightbox-photograph" />
      </div>
      {showInfo && content && <aside id="lightbox-artwork" className="lightbox-information" key={image.id}>
        <p className="exhibition-eyebrow">{t("Ficha de la obra")}</p>
        <h2 className="font-brand">{content.artwork.title}</h2>
        <p className="artwork-description">{content.description}</p>
        <ArtworkInformation artwork={content.artwork} />
      </aside>}
    </div>
    <footer className="lightbox-footer">
      <div className="lightbox-arrows">
        <button type="button" disabled={images.length < 2} onClick={() => move(-1)} aria-label={t("Fotografía anterior")}><ChevronLeft aria-hidden="true" /></button>
        <button type="button" disabled={images.length < 2} onClick={() => move(1)} aria-label={t("Fotografía siguiente")}><ChevronRight aria-hidden="true" /></button>
      </div>
      {content && <button type="button" className="lightbox-info-toggle" onClick={() => setShowInfo(value => !value)} aria-expanded={showInfo} aria-controls={showInfo ? "lightbox-artwork" : undefined}>{showInfo ? t("Ocultar ficha") : t("Mostrar ficha")}{showInfo ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}</button>}
    </footer>
  </dialog>, document.body);
}
