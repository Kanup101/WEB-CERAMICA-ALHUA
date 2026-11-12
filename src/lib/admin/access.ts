import "server-only";
import { getAuth } from "./auth.mjs";
import { database } from "./database.mjs";

export class AdminError extends Error {
 constructor(public status: number, message: string) { super(message); }
}
export async function requireAdmin(requestHeaders: Headers) {
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session) throw new AdminError(401, "Iniciá sesión para continuar.");
  if (!database().prepare("SELECT user_id FROM admin_users WHERE user_id = ?").get(session.user.id)) throw new AdminError(403, "Acceso no autorizado.");
  return session.user;
}
export function checkOrigin(request: Request) {
  const expected = new URL(process.env.BETTER_AUTH_URL || "http://invalid.local").origin;
  if (request.headers.get("origin") !== expected || request.headers.get("sec-fetch-site") === "cross-site") throw new AdminError(403, "Origen no autorizado.");
}
export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new AdminError(415, "Se requiere JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new AdminError(400, "Solicitud vacía.");
  const chunks: Uint8Array[] = []; let total = 0;
  for (;;) { const { value, done } = await reader.read(); if (done) break; total += value.length; if (total > 300_000) { await reader.cancel(); throw new AdminError(413, "Solicitud demasiado grande."); } chunks.push(value); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new AdminError(400, "JSON inválido."); }
}
