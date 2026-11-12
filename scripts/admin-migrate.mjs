import nextEnv from "@next/env";
import { backup } from "node:sqlite";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { database, databasePath } from "../src/lib/admin/database.mjs";

nextEnv.loadEnvConfig(process.cwd());
export async function migrate() {
  const db = database();
  db.exec("CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TEXT NOT NULL)");
  const applied = db.prepare("SELECT version, checksum FROM schema_migrations").all();
  const files = fs.readdirSync("migrations").filter(file => file.endsWith(".sql")).sort();
  const pending = files.filter(file => !applied.some(item => item.version === file));
  for (const item of applied) {
    const sql = fs.readFileSync(path.join("migrations", item.version), "utf8");
    if (createHash("sha256").update(sql).digest("hex") !== item.checksum) throw Error("An applied migration was changed; restore it before continuing.");
  }
  if (pending.length && applied.length) {
    const target = databasePath() + ".backup-" + Date.now();
    await backup(db, target);
    console.log("Pre-migration database backup created beside the database.");
  }
  for (const file of pending) {
    const sql = fs.readFileSync(path.join("migrations", file), "utf8");
    db.exec("BEGIN IMMEDIATE");
    try {
      db.exec(sql);
      db.prepare("INSERT INTO schema_migrations VALUES (?, ?, ?)").run(file, createHash("sha256").update(sql).digest("hex"), new Date().toISOString());
      db.exec("COMMIT"); console.log("Applied", file);
    } catch (error) { db.exec("ROLLBACK"); throw error; }
  }
  console.log("Administrative database is up to date.");
}
if (process.argv[1]?.endsWith("admin-migrate.mjs")) { await migrate(); process.exit(0); }
