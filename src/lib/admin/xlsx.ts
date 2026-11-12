import writeExcelFile from "write-excel-file/node";
import type { SheetData } from "write-excel-file/node";
import { csvFields } from "./csv";
import { commercialStates, lodgingTypes, verificationStates } from "./models";
import type { Lodging } from "./models";
import { localeNames } from "@/lib/i18n/config";

export const xlsxContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const labels: Record<typeof csvFields[number] | "id" | "created_at" | "updated_at", string> = {
  name: "Nombre comercial", type: "Tipo de alojamiento", city: "Ciudad", email: "Correo comercial",
  language: "Idioma preferido", source: "Fuente del contacto", address: "Dirección comercial", website: "Sitio web",
  phone: "Teléfono comercial", whatsapp: "WhatsApp comercial", contact_person: "Persona de contacto",
  contact_reason: "Razón para conservar el contacto", source_url: "URL de origen",
  verified_at: "Fecha de verificación (AAAA-MM-DD)", email_verification: "Verificación del correo", status: "Estado comercial",
  notes: "Notas internas", next_action: "Próxima acción", follow_up: "Seguimiento (AAAA-MM-DD)",
  id: "ID", created_at: "Fecha de creación (UTC)", updated_at: "Última actualización (UTC)",
};

export async function exportXlsx(rows: Lodging[], management = false): Promise<Uint8Array> {
  const fields = management ? [...csvFields, "id", "created_at", "updated_at"] as const : csvFields;
  const data: SheetData = [fields.map(field => ({ type: String, value: labels[field], fontWeight: "bold", backgroundColor: "#E7D2BA", wrap: true, height: 36 }))];
  for (const row of rows) {
    data.push(fields.map(field => {
      let value = String(row[field] ?? "");
      if (field === "type") value = lodgingTypes[row.type];
      else if (field === "status") value = commercialStates[row.status];
      else if (field === "email_verification") value = verificationStates[row.email_verification];
      else if (field === "language") value = localeNames[row.language];
      // A genuine XLSX string cell, never a formula, number or inferred hyperlink.
      // Preserve +54, leading zeros, long numbers, ISO dates and arbitrary notes verbatim.
      return { type: String, value, format: "@", wrap: true, alignVertical: "top" };
    }));
  }
  const buffer = await writeExcelFile(data, {
    sheet: management ? "Gestión completa" : "Contactos elegibles",
    stickyRowsCount: 1,
    columns: fields.map(field => ({ width: field === "notes" || field === "contact_reason" ? 55 : 30 })),
  }).toBuffer();
  return new Uint8Array(buffer);
}
