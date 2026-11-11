import { notFound } from "next/navigation";
import Home from "@/views/Home";
import Store from "@/views/Store";
import ProductDetail from "@/views/ProductDetail";
import Workshops from "@/views/Workshops";
import WorkshopDetail from "@/views/WorkshopDetail";
import About from "@/views/About";
import Contact from "@/views/Contact";
import Checkout from "@/views/Checkout";
import { ExperiencesIndex, ExperienceDetail } from "@/components/experiences/ExperiencePages";
import { getExperienceBySlug } from "@/data/experiences";
import { isLocale, localizedPath, locales } from "@/lib/i18n/config";
import { publicPaths, routeMetadata, siteOrigin } from "@/lib/i18n/routes";

type Props = { params: Promise<{ locale: string; path?: string[] }> };
export function generateStaticParams() { return publicPaths.map(path => ({ path: path === "/" ? [] : path.slice(1).split("/") })); }
export async function generateMetadata({ params }: Props) {
  const { locale, path } = await params;
  if (!isLocale(locale)) notFound();
  return routeMetadata("/" + (path ?? []).join("/"), locale);
}
export default async function Page({ params }: Props) {
  const { locale, path = [] } = await params;
  if (!isLocale(locale)) notFound();
  const pathname = "/" + path.join("/");
  if (!publicPaths.includes(pathname)) notFound();
  let content: React.ReactNode;
  if (pathname === "/") content = <Home />;
  else if (pathname === "/tienda") content = <Store />;
  else if (pathname === "/talleres") content = <Workshops />;
  else if (pathname === "/experiencias") content = <ExperiencesIndex />;
  else if (pathname === "/sobre-yanina" || pathname === "/sobre-alhua") content = <About />;
  else if (pathname === "/contacto") content = <Contact />;
  else if (pathname === "/checkout") content = <Checkout />;
  else if (path[0] === "tienda") content = <ProductDetail slug={path[1]} />;
  else if (path[0] === "talleres") content = <WorkshopDetail slug={path[1]} />;
  else if (path[0] === "experiencias") {
    const experience = getExperienceBySlug(path[1], locale);
    if (!experience) notFound();
    content = <ExperienceDetail experience={experience} />;
  }
  const canonicalPath = pathname === "/sobre-alhua" ? "/sobre-yanina" : pathname;
  return <>
    {!siteOrigin() && <><link rel="canonical" href={localizedPath(canonicalPath, locale)} />{locales.map(value=><link key={value} rel="alternate" hrefLang={value} href={localizedPath(canonicalPath, value)} />)}</>}
    {content}
  </>;
}
