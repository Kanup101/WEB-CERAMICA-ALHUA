import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let connection;
// Runtime data lives on a persistent volume, never inside the traced server bundle.
export function databasePath() {
  const filename = path.resolve(/* turbopackIgnore: true */ process.env.ADMIN_DATABASE_PATH || ".data/admin.sqlite");
  const comparable = process.platform === "win32" ? filename.toLowerCase() : filename;
  const publicDirectory = path.join(process.cwd(), "public");
  const publicComparable = process.platform === "win32" ? publicDirectory.toLowerCase() : publicDirectory;
  if (comparable === publicComparable || comparable.startsWith(publicComparable + path.sep)) throw new Error("The administrative database must be outside the public directory.");
  return filename;
}
export function database() {
  if (!connection) {
    const filename = databasePath();
    fs.mkdirSync(path.dirname(filename), { recursive: true, mode: 0o700 });
    connection = new DatabaseSync(filename);
    connection.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
  }
  return connection;
}
/** @template T @param {(db: ReturnType<typeof database>) => T} work @returns {T} */
export function transaction(work) {
  const db = database(); db.exec("BEGIN IMMEDIATE");
  try { const result = work(db); db.exec("COMMIT"); return result; }
  catch (error) { db.exec("ROLLBACK"); throw error; }
}
