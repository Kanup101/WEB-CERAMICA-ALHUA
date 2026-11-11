"use client";
import { useI18n } from "@/lib/i18n/provider";
import Image from "next/image";
type VideoBlockProps = {
    title: string;
    description?: string;
    videoUrl?: string;
    videoType?: "local" | "youtube" | "vimeo";
    poster?: string;
};
export function VideoBlock({ title, description, videoUrl, videoType = "local", poster }: VideoBlockProps) {
    const { t } = useI18n();
    const hasVideo = Boolean(videoUrl);
    return (<section className="overflow-hidden rounded-[2rem] border border-[#D8B79C] bg-[#FFF9EF] shadow-[0_18px_60px_rgba(74,55,40,0.07)]">
      <div className={hasVideo ? "relative aspect-video bg-[#E6C1AA]" : "relative min-h-96 bg-[#E6C1AA] sm:min-h-80"}>
        {hasVideo && videoType === "local" ? (<video className="h-full w-full object-cover" controls preload="metadata" poster={poster}>
            <source src={videoUrl} type="video/mp4"/>{t("Tu navegador no puede reproducir este video.")}</video>) : null}

        {hasVideo && (videoType === "youtube" || videoType === "vimeo") ? (<iframe className="h-full w-full" src={videoUrl} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>) : null}

        {!hasVideo ? (<div className="absolute inset-0 flex items-center justify-center">
            {poster ? (<Image src={poster} alt="" fill className="object-cover opacity-45" sizes="(min-width: 1024px) 60vw, 100vw"/>) : null}
            <div className="relative mx-5 max-w-md rounded-3xl bg-[#FFF9EF]/90 p-6 text-center backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8F5F45]">{t("Video")}</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#342A24]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6C5C50]">
                {description || t("Proximamente: video introductorio del taller.")}
              </p>
            </div>
          </div>) : null}
      </div>

      {hasVideo ? (<div className="p-6">
          <h3 className="text-2xl font-semibold text-[#342A24]">{title}</h3>
          {description ? <p className="mt-3 text-sm leading-6 text-[#6C5C50]">{description}</p> : null}
        </div>) : null}
    </section>);
}
