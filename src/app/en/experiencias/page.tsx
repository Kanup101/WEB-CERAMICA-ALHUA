import { ExperiencesIndex, experienceMetadata } from "@/components/experiences/ExperiencePages";

export const metadata = experienceMetadata("en");
export default function Page() { return <ExperiencesIndex locale="en" />; }
