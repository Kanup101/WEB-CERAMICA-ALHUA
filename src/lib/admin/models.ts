export const lodgingTypes = { hotel: "Hotel", hostal: "Hostal", hostel: "Hostel", apart_hotel: "Apart hotel", agencia: "Agencia turística", otro: "Otro" } as const;
export const commercialStates = { sin_contactar: "Sin contactar", preparado: "Contacto preparado", contactado: "Contactado", respuesta: "Respuesta recibida", interesado: "Interesado", acuerdo: "Colaboración acordada", sin_interes: "Sin interés", no_contactar: "No contactar" } as const;
export const verificationStates = { pendiente: "Pendiente", verificado: "Verificado", invalido: "Inválido" } as const;
export const campaignStates = { borrador: "Borrador", revision: "Lista para revisión", archivada: "Archivada" } as const;
export const channels = { email: "Email", whatsapp: "WhatsApp", telefono: "Teléfono", presencial: "Presencial", otro: "Otro" } as const;
export type Lodging = {
 id: string; name: string; type: keyof typeof lodgingTypes; city: string; address: string; website: string;
 email: string; phone: string; whatsapp: string; contact_person: string; contact_reason: string;
 language: "es" | "en" | "de" | "fr" | "ko" | "zh-CN"; source: string; source_url: string; verified_at: string;
 email_verification: keyof typeof verificationStates; status: keyof typeof commercialStates;
 notes: string; next_action: string; follow_up: string; created_at: string; updated_at: string; version: number;
};
export type Campaign = { id: string; name: string; objective: string; language: Lodging["language"]; subject: string; body: string; experience_slug: string; status: keyof typeof campaignStates; created_at: string; updated_at: string; version: number };
export type Communication = { id: string; date: string; channel: keyof typeof channels; type: string; summary: string; result: string; follow_up: string; created_at: string };
export type History = { id: string; kind: string; summary: string; created_at: string };
