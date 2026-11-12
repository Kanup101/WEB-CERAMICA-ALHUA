import { lodgingSchema } from "./validation";
import type { Lodging } from "./models";
export const csvFields = ["name", "type", "city", "email", "language", "source", "address", "website", "phone", "whatsapp", "contact_person", "contact_reason", "source_url", "verified_at", "email_verification", "status", "notes", "next_action", "follow_up"] as const;
export function parseCsv(source: string) {
  if (source.length > 250_000) throw Error("El CSV supera 250 KB.");
  const rows: string[][] = []; let row: string[] = [], cell = "", quoted = false, endedQuote = false;
  const text = source.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) { if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (char === '"') { quoted = false; endedQuote = true; } else cell += char; }
    else if (char === '"') { if (cell || endedQuote) throw Error("Comillas CSV inválidas."); quoted = true; }
    else if (char === ",") { row.push(cell); cell = ""; endedQuote = false; }
    else if (char === "\n" || char === "\r") { row.push(cell); if (row.some(value => value.trim())) rows.push(row); row = []; cell = ""; endedQuote = false; if (char === "\r" && text[i + 1] === "\n") i++; }
    else { if (endedQuote) throw Error("Contenido después de comillas CSV."); cell += char; }
  }
  if (quoted) throw Error("Comillas CSV sin cerrar.");
  row.push(cell); if (row.some(value => value.trim())) rows.push(row);
  if (rows.length < 2 || rows.length > 501) throw Error("El CSV debe contener entre 1 y 500 contactos.");
  const headers = rows.shift()!.map(value => value.trim());
  if (new Set(headers).size !== headers.length || headers.some(key => !csvFields.includes(key as typeof csvFields[number]))) throw Error("Encabezados desconocidos o duplicados. Usá la plantilla CSV.");
  return rows.map((values, index) => {
    const raw = Object.fromEntries(headers.map((key, position) => [key, values[position] ?? ""]));
    raw.status ||= "sin_contactar"; raw.email_verification ||= "pendiente";
    const parsed = lodgingSchema.safeParse(raw);
    return { row: index + 2, data: parsed.success && values.length === headers.length ? parsed.data : null, error: values.length !== headers.length ? "Cantidad de columnas incorrecta" : parsed.success ? "" : parsed.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ") };
  });
}
function cell(value: unknown) {
  const text = String(value ?? "");
  const safe = /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
}
export function exportCsv(rows: Lodging[], management = false) {
  const fields = management ? [...csvFields, "id", "created_at", "updated_at"] as const : csvFields;
  return "\uFEFF" + [fields.join(","), ...rows.map(row => fields.map(field => cell(row[field])).join(","))].join("\r\n");
}
