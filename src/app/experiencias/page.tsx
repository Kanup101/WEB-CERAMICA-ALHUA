import { ExperiencesIndex, experienceMetadata } from "@/components/experiences/ExperiencePages";

export const metadata = experienceMetadata("es");
export default function Page() { return <ExperiencesIndex locale="es" />; }
