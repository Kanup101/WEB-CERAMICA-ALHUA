"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EFE4D4]">
        <Image src={active} alt={name} fill priority className="object-contain p-2" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(image)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-2xl border bg-[#EFE4D4] transition",
              active === image ? "border-[#6F4A39] ring-2 ring-[#D8B79C]" : "border-[#E1D1BB]",
            )}
          >
            <span className="sr-only">Ver imagen {index + 1} de {name}</span>
            <Image src={image} alt="" fill className="object-cover" sizes="120px" />
          </button>
        ))}
      </div>
    </div>
  );
}
