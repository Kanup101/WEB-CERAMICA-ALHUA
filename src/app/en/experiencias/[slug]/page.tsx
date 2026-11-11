import { notFound } from "next/navigation";
import { ExperienceDetail, experienceMetadata } from "@/components/experiences/ExperiencePages";
import { experiences, getExperienceBySlug } from "@/data/experiences";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return experiences.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) {
  const experience = getExperienceBySlug((await params).slug);
  if (!experience) notFound();
  return experienceMetadata("en", experience);
}
export default async function Page({ params }: Props) {
  const experience = getExperienceBySlug((await params).slug);
  if (!experience) notFound();
  return <ExperienceDetail experience={experience} locale="en" />;
}
