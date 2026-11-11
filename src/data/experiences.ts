import type { Experience } from "@/types/experience";
import type { Locale } from "@/lib/i18n/config";
import { getTranslator, type MessageKey } from "@/lib/i18n/messages";
type ExperienceRecord = Omit<Experience, "subtitle" | "description" | "includes" | "images" | "location" | "language" | "duration" | "meetingPoint" | "availability" | "bookingConditions" | "pieceDelivery"> & {
 location: MessageKey; language?: MessageKey[];
 subtitle: MessageKey; description: MessageKey; includes: {icon: Experience["includes"][number]["icon"];text:MessageKey}[]; images:{src:string;alt:MessageKey}[];
 duration?:MessageKey; meetingPoint?:MessageKey; availability?:MessageKey; bookingConditions?:MessageKey; pieceDelivery?:MessageKey;
};
export const experienceRecords: ExperienceRecord[] = [
  {
    "id": "barro-mates-y-encuentros",
    "slug": "barro-mates-y-encuentros",
    "title": "Barro, mates y encuentros",
    "subtitle": "Una experiencia para crear con las manos y encontrarnos alrededor del barro.",
    "description": "En Salta, Yanina Cardozo te invita a hacer una pausa y acercarte a la cerámica desde la tierra, los materiales y el gesto de las manos. Una introducción a la cerámica regional y su contexto cultural abre el encuentro. Después, explorarás materiales y técnicas de modelado manual para crear una pieza con su acompañamiento. Entre mates, un aperitivo y conversaciones, compartiremos un momento relajado de creatividad e intercambio cultural. Una invitación para quienes visitan Salta desde Argentina o desde otros lugares del mundo.",
    "priceUSD": 35,
    "currency": "USD",
    "location": "Salta, Argentina",
    "includes": [
      {
        "icon": "materials",
        "text": "Materiales para la actividad"
      },
      {
        "icon": "hand",
        "text": "Modelado manual de una pieza cerámica"
      },
      {
        "icon": "culture",
        "text": "Introducción a la cerámica regional"
      },
      {
        "icon": "mate",
        "text": "Mates compartidos"
      },
      {
        "icon": "food",
        "text": "Un aperitivo"
      },
      {
        "icon": "host",
        "text": "Acompañamiento de Yanina"
      }
    ],
    "images": [
      {
        "src": "/images/products/barro-2.webp",
        "alt": "Mano sosteniendo un fragmento de tierra de textura laminada"
      },
      {
        "src": "/images/products/barro-1.webp",
        "alt": "Detalle de arcilla húmeda extendida sobre una superficie de trabajo"
      }
    ],
    "featured": true
  }
];
export function getExperiences(locale: Locale): Experience[] {
 const t=getTranslator(locale);
 return experienceRecords.map(exp=>({...exp,location:t(exp.location),language:exp.language?.map(key=>t(key)),subtitle:t(exp.subtitle),description:t(exp.description),includes:exp.includes.map(i=>({...i,text:t(i.text)})),images:exp.images.map(i=>({...i,alt:t(i.alt)})),duration:exp.duration?t(exp.duration):undefined,meetingPoint:exp.meetingPoint?t(exp.meetingPoint):undefined,availability:exp.availability?t(exp.availability):undefined,bookingConditions:exp.bookingConditions?t(exp.bookingConditions):undefined,pieceDelivery:exp.pieceDelivery?t(exp.pieceDelivery):undefined}));
}
export function getExperienceBySlug(slug: string, locale: Locale = "es") { return getExperiences(locale).find(exp=>exp.slug===slug); }
