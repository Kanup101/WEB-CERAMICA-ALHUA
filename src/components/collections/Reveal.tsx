"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Progressive enhancement: content stays visible without JavaScript or IntersectionObserver. */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = element.current;
    if (!node || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    node.dataset.reveal = "pending";
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { delete node.dataset.reveal; observer.disconnect(); }
    }, { rootMargin: "0px 0px 60px 0px", threshold: 0.05 });
    observer.observe(node);
    return () => { observer.disconnect(); delete node.dataset.reveal; };
  }, []);
  return <div ref={element} className={`exhibition-reveal ${className}`}>{children}</div>;
}
