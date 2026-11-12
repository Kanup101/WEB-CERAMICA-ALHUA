import { z } from "zod";
import { locales } from "@/lib/i18n/config";
import { lodgingTypes, commercialStates, verificationStates, campaignStates, channels } from "./models";
const text = (length = 200) => z.string().trim().max(length).default("");
const required = (length = 200) => z.string().trim().min(1, "Campo obligatorio").max(length);
const url = text(1000).refine(value => { if (!value) return true; try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; } }, "URL HTTP/HTTPS inválida");
const date = z.union([z.iso.date(), z.literal("")]).default("");
export const lodgingSchema = z.object({
 name: required(), type: z.enum(Object.keys(lodgingTypes) as [keyof typeof lodgingTypes, ...(keyof typeof lodgingTypes)[]]), city: required(),
 address: text(400), website: url, email: z.email().trim().toLowerCase().max(254), phone: text(50), whatsapp: text(50),
 contact_person: text(), contact_reason: text(500), language: z.enum(locales), source: required(500), source_url: url,
 verified_at: date, email_verification: z.enum(Object.keys(verificationStates) as [keyof typeof verificationStates, ...(keyof typeof verificationStates)[]]),
 status: z.enum(Object.keys(commercialStates) as [keyof typeof commercialStates, ...(keyof typeof commercialStates)[]]),
 notes: text(5000), next_action: text(500), follow_up: date, version: z.number().int().positive().optional(),
}).strict().refine(value => !value.contact_person || !!value.contact_reason, { message: "Indicá la razón para conservar la persona de contacto", path: ["contact_reason"] })
.refine(value => value.email_verification !== "verificado" || !!value.verified_at, { message: "Un email verificado requiere fecha de verificación", path: ["verified_at"] });
export const communicationSchema = z.object({ date: z.iso.date(), channel: z.enum(Object.keys(channels) as [keyof typeof channels, ...(keyof typeof channels)[]]), type: required(), summary: required(3000), result: text(1000), follow_up: date }).strict();
export const campaignSchema = z.object({ name: required(), objective: required(2000), language: z.enum(locales), subject: required(250), body: required(15000), experience_slug: z.literal("barro-mates-y-encuentros"), status: z.enum(Object.keys(campaignStates) as [keyof typeof campaignStates, ...(keyof typeof campaignStates)[]]), version: z.number().int().positive().optional() }).strict();
export const deleteSchema = z.object({ confirm: z.email(), version: z.number().int().positive() }).strict();
export type LodgingInput = z.infer<typeof lodgingSchema>;
