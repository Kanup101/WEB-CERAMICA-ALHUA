import type { Experience } from "@/types/experience";

export const experiences: Experience[] = [{
  id: "barro-mates-y-encuentros",
  slug: "barro-mates-y-encuentros",
  title: "Barro, mates y encuentros",
  subtitle: {
    es: "Una experiencia para crear con las manos y encontrarnos alrededor del barro.",
    en: "An experience to create with your hands and connect through clay.",
  },
  description: {
    es: "En Salta, Yanina Cardozo te invita a hacer una pausa y acercarte a la cerámica desde la tierra, los materiales y el gesto de las manos. Una introducción a la cerámica regional y su contexto cultural abre el encuentro. Después, explorarás materiales y técnicas de modelado manual para crear una pieza con su acompañamiento. Entre mates, un aperitivo y conversaciones, compartiremos un momento relajado de creatividad e intercambio cultural. Una invitación para quienes visitan Salta desde Argentina o desde otros lugares del mundo.",
    en: "In Salta, Yanina Cardozo invites you to slow down and discover ceramics through earth, materials and the work of your hands. An introduction to regional ceramics and their cultural context opens the gathering. Then, explore materials and hand-building techniques as you create a piece with her guidance. Shared mate, a traditional infusion, an aperitif and conversation make room for a relaxed creative and cultural exchange. An invitation for visitors to Salta from Argentina and around the world.",
  },
  priceUSD: 35,
  currency: "USD",
  location: "Salta, Argentina",
  includes: [
    { icon: "materials", text: { es: "Materiales para la actividad", en: "Materials for the activity" } },
    { icon: "hand", text: { es: "Modelado manual de una pieza cerámica", en: "Hand-building a ceramic piece" } },
    { icon: "culture", text: { es: "Introducción a la cerámica regional", en: "Introduction to regional ceramics" } },
    { icon: "mate", text: { es: "Mates compartidos", en: "Shared mate infusion" } },
    { icon: "food", text: { es: "Un aperitivo", en: "An aperitif" } },
    { icon: "host", text: { es: "Acompañamiento de Yanina", en: "Guidance from Yanina" } },
  ],
  images: [
    { src: "/images/products/barro-2.webp", alt: { es: "Mano sosteniendo un fragmento de tierra de textura laminada", en: "Hand holding a fragment of earth with layered texture" } },
    { src: "/images/products/barro-1.webp", alt: { es: "Detalle de arcilla húmeda extendida sobre una superficie de trabajo", en: "Detail of wet clay spread across a work surface" } },
  ],
  featured: true,
  // Fechas, duración, cupos, idiomas y condiciones aún no confirmados.
}];

export function getExperienceBySlug(slug: string) {
  return experiences.find((experience) => experience.slug === slug);
}
