import "server-only";
import { randomUUID } from "node:crypto";
import { database, transaction } from "./database.mjs";
import { requireAdmin, AdminError } from "./access";
import { lodgingSchema, communicationSchema, campaignSchema, deleteSchema } from "./validation";
import { commercialStates, lodgingTypes, verificationStates } from "./models";
import type { Lodging, Campaign, Communication, History } from "./models";
import { parseCsv, exportCsv, csvFields } from "./csv";
import { exportXlsx } from "./xlsx";

type DB = ReturnType<typeof database>;
const now = () => new Date().toISOString();
function history(db: DB, id: string, actor: string, kind: string, summary: string) { db.prepare("INSERT INTO lodging_history VALUES (?, ?, ?, ?, ?, ?)").run(randomUUID(), id, actor, kind, summary, now()); }
function insertLodging(db: DB, input: unknown, actor: string) {
  const parsed = lodgingSchema.parse(input); const { version: ignored, ...data } = parsed; void ignored;
  if (db.prepare("SELECT id FROM lodgings WHERE email = ?").get(data.email)) throw new AdminError(409, "Ya existe un alojamiento con ese correo.");
  const record = { id: randomUUID(), ...data, created_at: now(), updated_at: now(), version: 1 };
  const fields = Object.keys(record);
  db.prepare(`INSERT INTO lodgings (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")})`).run(...Object.values(record));
  history(db, record.id, actor, "creacion", "Contacto comercial creado; procedencia registrada.");
  return record;
}
function existing(id: string) { const row = database().prepare("SELECT * FROM lodgings WHERE id = ?").get(id) as Lodging | undefined; if (!row) throw new AdminError(404, "Alojamiento inexistente."); return row; }

export async function listLodgings(h: Headers, params: URLSearchParams) {
  await requireAdmin(h);
  const q = (params.get("q") || "").trim().slice(0, 200);
  const status = params.get("status") || "", type = params.get("type") || "", verification = params.get("verification") || "";
  if ((status && !(status in commercialStates)) || (type && !(type in lodgingTypes)) || (verification && !(verification in verificationStates))) throw new AdminError(400, "Filtro inválido.");
  const page = Math.max(1, Math.min(1_000_000, Number.parseInt(params.get("page") || "1", 10) || 1));
  const where = ["1=1"], args: string[] = [];
  if (q) { where.push("(name LIKE ? OR city LIKE ? OR email LIKE ?)"); args.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  if (status) { where.push("status = ?"); args.push(status); }
  if (type) { where.push("type = ?"); args.push(type); }
  if (verification) { where.push("email_verification = ?"); args.push(verification); }
  const clause = where.join(" AND ");
  const total = (database().prepare(`SELECT COUNT(*) AS n FROM lodgings WHERE ${clause}`).get(...args) as { n: number }).n;
  const rows = database().prepare(`SELECT * FROM lodgings WHERE ${clause} ORDER BY created_at DESC, id LIMIT 20 OFFSET ?`).all(...args, (page - 1) * 20) as Lodging[];
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / 20)) };
}
export async function lodgingDetail(h: Headers, id: string) {
  await requireAdmin(h);
  return { lodging: existing(id), history: database().prepare("SELECT * FROM lodging_history WHERE lodging_id = ? ORDER BY created_at DESC").all(id) as History[], communications: database().prepare("SELECT * FROM communications WHERE lodging_id = ? ORDER BY date DESC, created_at DESC").all(id) as Communication[] };
}
export async function createLodging(h: Headers, input: unknown) { const user = await requireAdmin(h); return transaction(db => insertLodging(db, input, user.id)); }
export async function updateLodging(h: Headers, id: string, input: unknown) {
  const user = await requireAdmin(h); const { version, ...data } = lodgingSchema.parse(input);
  if (!version) throw new AdminError(400, "Falta la versión del registro.");
  return transaction(db => {
    const old = existing(id);
    if (db.prepare("SELECT id FROM lodgings WHERE email = ? AND id <> ?").get(data.email, id)) throw new AdminError(409, "Ya existe ese correo en otro alojamiento.");
    const entries = Object.entries(data);
    const result = db.prepare(`UPDATE lodgings SET ${entries.map(([key]) => `${key} = ?`).join(",")}, updated_at = ?, version = version + 1 WHERE id = ? AND version = ?`).run(...entries.map(([, value]) => value), now(), id, version);
    if (!result.changes) throw new AdminError(409, "Otro administrador modificó el registro. Recargá antes de guardar.");
    const changed = entries.filter(([key, value]) => old[key as keyof Lodging] !== value).map(([key]) => key);
    if (changed.length) history(db, id, user.id, "edicion", `Campos modificados: ${changed.join(", ")}.${old.status !== data.status ? ` Estado: ${commercialStates[old.status]} → ${commercialStates[data.status]}.` : ""}`);
    return existing(id);
  });
}
export async function deleteLodging(h: Headers, id: string, input: unknown) {
  await requireAdmin(h); const data = deleteSchema.parse(input);
  transaction(db => { const row = existing(id); if (data.confirm.toLowerCase() !== row.email.toLowerCase()) throw new AdminError(400, "Confirmá el correo del alojamiento para eliminarlo."); if (!db.prepare("DELETE FROM lodgings WHERE id = ? AND version = ?").run(id, data.version).changes) throw new AdminError(409, "El registro cambió. Recargá la página."); });
  return { deleted: true };
}
export async function addCommunication(h: Headers, id: string, input: unknown) {
  const user = await requireAdmin(h); const data = communicationSchema.parse(input);
  return transaction(db => {
    existing(id); const row = { id: randomUUID(), lodging_id: id, actor_id: user.id, ...data, created_at: now() };
    const fields = Object.keys(row); db.prepare(`INSERT INTO communications (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")})`).run(...Object.values(row));
    if (data.follow_up) db.prepare("UPDATE lodgings SET follow_up = ?, updated_at = ?, version = version + 1 WHERE id = ?").run(data.follow_up, now(), id);
    history(db, id, user.id, "comunicacion", `Registro manual por ${data.channel}: ${data.type}. No se envió ningún mensaje desde el panel.`);
    return row;
  });
}
export async function dashboard(h: Headers) {
  await requireAdmin(h);
  const groups = database().prepare("SELECT status, COUNT(*) AS n FROM lodgings GROUP BY status").all() as { status: string; n: number }[];
  const count = (...states: string[]) => groups.filter(row => states.includes(row.status)).reduce((sum, row) => sum + row.n, 0);
  return { total: groups.reduce((sum, row) => sum + row.n, 0), pending: count("sin_contactar", "preparado"), contacted: count("contactado", "respuesta", "interesado", "acuerdo", "sin_interes"), responses: count("respuesta", "interesado", "acuerdo", "sin_interes"), interested: count("interesado"), collaborations: count("acuerdo"), followUps: database().prepare("SELECT * FROM lodgings WHERE follow_up <> '' AND status <> 'no_contactar' ORDER BY follow_up, name LIMIT 20").all() as Lodging[] };
}
export async function listCampaigns(h: Headers) { await requireAdmin(h); return database().prepare("SELECT * FROM campaigns ORDER BY created_at DESC").all() as Campaign[]; }
export async function saveCampaign(h: Headers, input: unknown, id?: string) {
  await requireAdmin(h); const { version, ...data } = campaignSchema.parse(input);
  return transaction(db => {
    if (db.prepare("SELECT id FROM campaigns WHERE experience_slug = ? AND language = ? AND id <> ?").get(data.experience_slug, data.language, id || "")) throw new AdminError(409, "Ya existe un borrador para esta experiencia e idioma. Editá el existente.");
    if (id) {
      const entries = Object.entries(data);
      if (!version || !db.prepare(`UPDATE campaigns SET ${entries.map(([key]) => `${key} = ?`).join(",")}, updated_at = ?, version = version + 1 WHERE id = ? AND version = ?`).run(...entries.map(([, value]) => value), now(), id, version).changes) throw new AdminError(409, "El borrador cambió o no existe. Recargá antes de guardar.");
      return { id };
    }
    const record = { id: randomUUID(), ...data, created_at: now(), updated_at: now(), version: 1 };
    const fields = Object.keys(record); db.prepare(`INSERT INTO campaigns (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")})`).run(...Object.values(record)); return record;
  });
}
export async function seedCampaigns(h: Headers) {
  await requireAdmin(h);
  const created = [];
  for (const language of ["es", "en"] as const) {
    if (database().prepare("SELECT id FROM campaigns WHERE experience_slug = ? AND language = ?").get("barro-mates-y-encuentros", language)) continue;
    const es = language === "es";
    created.push(await saveCampaign(h, { name: "Barro, mates y encuentros | Difusión turística", objective: es ? "Presentar la experiencia a alojamientos de Salta y conversar sobre posibles colaboraciones." : "Introduce the experience to accommodation providers in Salta and discuss possible collaborations.", language, subject: es ? "Una experiencia de cerámica para sus huéspedes en Salta" : "A ceramics experience for your guests in Salta", body: es ? "Hola,\n\nSoy Yanina Cardozo. Quisiera presentarles Barro, mates y encuentros, una experiencia de cerámica en Salta por USD 35 por persona. Incluye materiales, modelado manual de una pieza, introducción a la cerámica regional, mates compartidos, un aperitivo y mi acompañamiento.\n\nMe gustaría conversar sobre la posibilidad de acercar esta propuesta a sus huéspedes. Las fechas y condiciones se coordinan directamente; consultar no confirma una reserva. La entrega de las piezas queda sujeta a confirmación.\n\nPueden conocer la propuesta en el enlace de la experiencia que acompaña este borrador. Si prefieren no recibir nuevas comunicaciones, pueden indicármelo y lo registraré.\n\nGracias,\nYanina Cardozo" : "Hello,\n\nI am Yanina Cardozo. I would like to introduce Barro, mates y encuentros, a ceramics experience in Salta for USD 35 per person. It includes materials, hand-building a piece, an introduction to regional ceramics, shared mate (a traditional infusion), an aperitif and my guidance.\n\nI would love to discuss sharing this activity with your guests. Dates and conditions are arranged directly; an enquiry is not a confirmed booking. Collection of pieces must be confirmed.\n\nYou can explore the activity through the experience link accompanying this draft. If you prefer not to receive further communications, please let me know so I can record your preference.\n\nThank you,\nYanina Cardozo", experience_slug: "barro-mates-y-encuentros", status: "borrador" }));
  }
  return { created: created.length };
}
export async function eligibleRecipients(h: Headers, language?: string) {
  await requireAdmin(h);
  return database().prepare("SELECT * FROM lodgings WHERE status NOT IN ('no_contactar','sin_interes') AND email_verification = 'verificado'" + (language ? " AND language = ?" : "") + " ORDER BY name").all(...(language ? [language] : [])) as Lodging[];
}
export async function contactCsv(h: Headers, template = false, management = false) {
  await requireAdmin(h);
  if (template) return "\uFEFF" + csvFields.join(",") + "\r\n";
  if (management) return exportCsv(database().prepare("SELECT * FROM lodgings ORDER BY name").all() as Lodging[], true);
  return exportCsv(await eligibleRecipients(h));
}
export async function contactXlsx(h: Headers, management = false) {
  await requireAdmin(h);
  const rows = management ? database().prepare("SELECT * FROM lodgings ORDER BY name").all() as Lodging[] : await eligibleRecipients(h);
  return exportXlsx(rows, management);
}
export async function importContacts(h: Headers, source: string, confirm: boolean) {
  const user = await requireAdmin(h);
  let rows; try { rows = parseCsv(source); } catch (error) { throw new AdminError(400, error instanceof Error ? error.message : "CSV inválido."); }
  // Revalidate under the write lock at confirmation: no silent overwrite or stale preview.
  const process = (db: DB) => {
    const seen = new Set<string>(); let accepted = 0;
    const results = rows.map(row => {
      let error = row.error;
      if (row.data && (seen.has(row.data.email) || db.prepare("SELECT id FROM lodgings WHERE email = ?").get(row.data.email))) error = "Correo duplicado; no se sobrescribe el contacto existente.";
      if (row.data) seen.add(row.data.email);
      if (!error && row.data) { if (confirm) insertLodging(db, row.data, user.id); accepted++; }
      return { row: row.row, name: row.data?.name || "", email: row.data?.email || "", accepted: !error && !!row.data, error };
    });
    return { confirmed: confirm, accepted, rejected: results.length - accepted, rows: results };
  };
  return confirm ? transaction(process) : process(database());
}
