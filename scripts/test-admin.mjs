import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { DatabaseSync } from "node:sqlite";
import { workbookXml, sheetCells } from "./test-admin-export.mjs";

const folder = fs.mkdtempSync(path.join(os.tmpdir(), "yanina-admin-test-"));
const base = "http://localhost:3120";
const env = { ...process.env, NODE_ENV: "development", NEXT_DIST_DIR: ".next-admin-test", ADMIN_DATABASE_PATH: path.join(folder, "admin.sqlite"), BETTER_AUTH_SECRET: randomBytes(48).toString("hex"), BETTER_AUTH_URL: base, NEXT_TELEMETRY_DISABLED: "1" };
const credentials = { name: "Administrador de prueba aislada", email: "admin@example.invalid", password: randomBytes(32).toString("base64url") };
const provision = spawnSync(process.execPath, ["scripts/admin-create.mjs", "--stdin"], { env, input: JSON.stringify(credentials), encoding: "utf8" });
assert.equal(provision.status, 0, provision.stderr);
const db = new DatabaseSync(env.ADMIN_DATABASE_PATH);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM lodgings").get().n, 0);
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM campaigns").get().n, 0);
const hash = db.prepare("SELECT password FROM account").get().password;
assert.notEqual(hash, credentials.password); assert.ok(hash.length > 60);
db.close();
const productionCheck = spawnSync(process.execPath, ["--input-type=module", "-e", `
import assert from 'node:assert/strict';
import {createAuth} from './src/lib/admin/auth.mjs';
let source='';for await(const chunk of process.stdin)source+=chunk;
const response=await createAuth().api.signInEmail({body:JSON.parse(source),asResponse:true});
assert.equal(response.status,200);
assert.ok(response.headers.getSetCookie().some(value=>/HttpOnly/i.test(value)&&/Secure/i.test(value)&&/SameSite=Lax/i.test(value)));
process.exit(0);
`], { env: { ...env, NODE_ENV: "production", BETTER_AUTH_URL: "https://admin.example.invalid" }, input: JSON.stringify(credentials), encoding: "utf8" });
assert.equal(productionCheck.status, 0, productionCheck.stderr);
let server, logs = "";
async function start() {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "localhost", "--port", "3120"], { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  server.stdout.on("data", data => { logs += data; }); server.stderr.on("data", data => { logs += data; });
  for (let i = 0; i < 180; i++) {
    if (server.exitCode !== null) throw Error("Test server failed: " + logs.slice(-3000));
    try { if ((await fetch(base + "/admin/login")).status === 200) return; } catch { /* waiting for the local server */ }
    await delay(250);
  }
  throw Error("Test server did not start: " + logs.slice(-3000));
}
async function stop() { if (server && server.exitCode === null) { const exited = new Promise(resolve => server.once("exit", resolve)); server.kill(); await Promise.race([exited, delay(4000)]); } }
let cookie = "";
async function request(route, method = "GET", body, authenticated = true, origin = base) {
  return fetch(base + route, { method, redirect: "manual", headers: { ...(authenticated ? { Cookie: cookie } : {}), ...(method === "GET" ? {} : { Origin: origin, "Content-Type": "application/json" }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
async function json(route, method = "GET", body) { const response = await request(route, method, body); const data = await response.json(); assert.ok(response.ok, `${method} ${route}: ${response.status} ${JSON.stringify(data)}`); return data; }
try {
  await start();
  for (const route of ["/admin", "/admin/difusion", "/admin/difusion/alojamientos", "/admin/difusion/alojamientos/nuevo", "/admin/difusion/alojamientos/00000000-0000-4000-8000-000000000000", "/admin/difusion/campanas"]) {
    const response = await request(route, "GET", undefined, false);
    assert.equal(response.status, 307, route); assert.ok(response.headers.get("location").endsWith("/admin/login")); assert.ok(response.headers.get("x-robots-tag").includes("noindex"));
  }
  for (const route of ["dashboard", "alojamientos", "alojamientos/00000000-0000-4000-8000-000000000000", "campanas", "exportar", "plantilla"]) assert.equal((await request("/api/admin/" + route, "GET", undefined, false)).status, 401);
  for (const suffix of ["?format=xlsx", "?scope=gestion&format=xlsx"]) assert.equal((await request("/api/admin/exportar" + suffix, "GET", undefined, false)).status, 401);
  for (const method of ["POST", "PUT", "DELETE"]) assert.equal((await request("/api/admin/alojamientos", method, {}, false)).status, 401);
  assert.equal((await request("/api/auth/sign-up/email", "POST", credentials, false)).status, 404);
  assert.equal((await request("/api/auth/sign-in/email", "POST", credentials, false, "https://attacker.invalid")).status, 403);
  const login = await request("/api/auth/sign-in/email", "POST", credentials, false);
  assert.equal(login.status, 200, await login.text());
  const cookies = login.headers.getSetCookie();
  assert.ok(cookies.some(value => /HttpOnly/i.test(value) && /SameSite=Lax/i.test(value)));
  cookie = cookies.map(value => value.split(";")[0]).join("; ");
  const permissionsDb = new DatabaseSync(env.ADMIN_DATABASE_PATH);
  const adminId = permissionsDb.prepare("SELECT user_id FROM admin_users").get().user_id;
  permissionsDb.prepare("DELETE FROM admin_users WHERE user_id = ?").run(adminId);
  assert.equal((await request("/api/admin/alojamientos")).status, 403, "A valid session without admin permission must be rejected");
  permissionsDb.prepare("INSERT INTO admin_users (user_id) VALUES (?)").run(adminId); permissionsDb.close();
  assert.equal((await json("/api/admin/dashboard")).total, 0);
  const input = { name: 'Alojamiento de prueba aislada, Ñandú "Salta"', type: "hotel", city: "Salta", email: "contacto@example.invalid", language: "es", source: "Fixture local autorizada de test", status: "sin_contactar", email_verification: "verificado", verified_at: "2026-11-11", follow_up: "2026-12-01", phone: "03870001234", whatsapp: "+5493870001234", notes: 'Nota con coma, punto y coma; y "comillas"\nSegunda línea: María José' };
  assert.equal((await request("/api/admin/alojamientos", "POST", input, true, "https://attacker.invalid")).status, 403);
  assert.equal((await request("/api/admin/alojamientos", "POST", { ...input, email: "invalid" })).status, 422);
  assert.equal((await request("/api/admin/alojamientos", "POST", { ...input, website: "javascript:alert(1)" })).status, 422);
  const lodging = await json("/api/admin/alojamientos", "POST", input);
  const download = await request("/api/admin/exportar?format=xlsx");
  assert.equal(download.status, 200); assert.equal(download.headers.get("content-type"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  assert.ok(download.headers.get("content-disposition").includes('filename="contactos-elegibles.xlsx"'));
  assert.ok(download.headers.get("cache-control").includes("no-store"));
  const downloadedXml = workbookXml(await download.arrayBuffer());
  const downloadedCells = sheetCells(downloadedXml["xl/worksheets/sheet1.xml"], downloadedXml["xl/sharedStrings.xml"]);
  assert.equal(downloadedCells.A2.text, input.name); assert.equal(downloadedCells.I2.text, input.phone); assert.equal(downloadedCells.J2.text, input.whatsapp); assert.equal(downloadedCells.Q2.text, input.notes);
  assert.equal((await request("/api/admin/exportar?format=pdf")).status, 422);
  assert.equal((await request("/api/admin/plantilla?format=xlsx")).status, 400);
  assert.equal((await request("/api/admin/alojamientos", "POST", input)).status, 409);
  assert.equal((await json("/api/admin/alojamientos?q=" + encodeURIComponent("prueba aislada"))).total, 1);
  assert.equal((await json("/api/admin/alojamientos?status=interesado")).total, 0);
  assert.equal((await json("/api/admin/alojamientos?page=2")).rows.length, 0);
  await json(`/api/admin/alojamientos/${lodging.id}`, "PUT", { ...input, version: 1, status: "interesado", notes: "Registro editado" });
  assert.equal((await request(`/api/admin/alojamientos/${lodging.id}`, "PUT", { ...input, version: 1 })).status, 409);
  await json(`/api/admin/alojamientos/${lodging.id}/comunicaciones`, "POST", { date: "2026-11-11", channel: "telefono", type: "Conversación registrada manualmente", summary: "Prueba aislada del historial", result: "Interés registrado", follow_up: "2026-12-02" });
  let detail = await json(`/api/admin/alojamientos/${lodging.id}`);
  assert.equal(detail.communications.length, 1); assert.ok(detail.history.length >= 3);
  assert.equal(detail.lodging.follow_up, "2026-12-02");
  assert.equal((await json("/api/admin/dashboard")).interested, 1);
  let csv = await (await request("/api/admin/exportar")).text(); assert.ok(csv.includes(input.email));
  await json(`/api/admin/alojamientos/${lodging.id}`, "PUT", { ...input, version: detail.lodging.version, status: "no_contactar" });
  csv = await (await request("/api/admin/exportar")).text(); assert.ok(!csv.includes(input.email));
  const managementCsv = await (await request("/api/admin/exportar?scope=gestion")).text(); assert.ok(managementCsv.includes(input.email) && managementCsv.includes("no_contactar"));
  const excludedXml = workbookXml(await (await request("/api/admin/exportar?format=xlsx")).arrayBuffer());
  const excludedCells = sheetCells(excludedXml["xl/worksheets/sheet1.xml"], excludedXml["xl/sharedStrings.xml"]);
  assert.equal(Object.keys(excludedCells).length, 19, "Suppressed contact excluded from the XLSX");
  const allXml = workbookXml(await (await request("/api/admin/exportar?scope=gestion&format=xlsx")).arrayBuffer());
  const allCells = sheetCells(allXml["xl/worksheets/sheet1.xml"], allXml["xl/sharedStrings.xml"]);
  assert.equal(allCells.D2.text, input.email); assert.equal(allCells.P2.text, "No contactar"); assert.equal(allCells.I2.text, input.phone);
  console.log("PASS XLSX downloads: MIME, filenames, authentication, Unicode, phones, notes, eligible exclusion and full management export.");
  assert.equal((await json("/api/admin/campanas/iniciales", "POST", {})).created, 2);
  assert.equal((await json("/api/admin/campanas/iniciales", "POST", {})).created, 0);
  const campaigns = await json("/api/admin/campanas"); assert.equal(campaigns.length, 2);
  assert.ok(campaigns.every(row => row.body.includes("USD 35") && row.eligible === 0));
  assert.ok(campaigns.find(row => row.language === "en").experience_url.startsWith("/en/experiencias/"));
  const campaign = campaigns[0];
  const campaignInput = Object.fromEntries(["name", "objective", "language", "subject", "body", "experience_slug", "status", "version"].map(key => [key, campaign[key]]));
  await json(`/api/admin/campanas/${campaign.id}`, "PUT", { ...campaignInput, status: "revision", subject: "Asunto revisado" });
  const source = 'name,type,city,email,language,source\r\nImportado,hotel,Salta,importado@example.invalid,en,Fixture local\r\nDuplicado,hotel,Salta,contacto@example.invalid,es,Fixture local\r\nInvalido,hotel,Salta,no-es-email,es,Fixture local';
  const preview = await json("/api/admin/importar", "POST", { csv: source, confirm: false }); assert.equal(preview.accepted, 1); assert.equal(preview.rejected, 2);
  assert.equal((await json("/api/admin/dashboard")).total, 1);
  const imported = await json("/api/admin/importar", "POST", { csv: source, confirm: true }); assert.equal(imported.accepted, 1);
  assert.equal((await json("/api/admin/importar", "POST", { csv: source, confirm: true })).accepted, 0);
  const importedRow = (await json("/api/admin/alojamientos?q=importado@example.invalid")).rows[0];
  assert.equal((await request(`/api/admin/alojamientos/${importedRow.id}`, "DELETE", { confirm: "wrong@example.invalid", version: 1 })).status, 400);
  await json(`/api/admin/alojamientos/${importedRow.id}`, "DELETE", { confirm: importedRow.email, version: 1 });
  assert.equal((await request(`/api/admin/alojamientos/${importedRow.id}`)).status, 404);
  console.log("PASS: authorization, CSRF, real login, CRUD, filters, history, optimistic locking, CSV preview/import/export, suppression and campaigns.");
  await stop(); await start();
  detail = await json(`/api/admin/alojamientos/${lodging.id}`); assert.equal(detail.lodging.status, "no_contactar"); assert.equal(detail.communications.length, 1);
  assert.equal((await json("/api/admin/campanas")).length, 2);
  console.log("PASS: data and sessions persist after server restart.");
  for (const locale of ["", "/en", "/de", "/fr", "/ko", "/zh-CN"]) {
    const response = await fetch(base + (locale || "/"), { redirect: "manual" }); assert.equal(response.status, 200, `${locale || "/"}: ${response.headers.get("location")}`);
    const html = await response.text(); assert.ok(html.includes(`<html lang="${locale.slice(1) || "es"}"`)); assert.ok(!html.includes('href="/admin'));
  }
  if (process.argv.includes("--browser")) { const { testAdminBrowser } = await import("./admin-browser.mjs"); await testAdminBrowser(base, credentials, lodging.id); }
  await json("/api/auth/sign-out", "POST", {});
  assert.equal((await request("/api/admin/alojamientos")).status, 401);
  let blocked = false;
  for (let i = 0; i < 7; i++) { const response = await request("/api/auth/sign-in/email", "POST", { ...credentials, password: "Invalid-and-random-password" }, false); if (response.status === 429) { blocked = true; break; } }
  assert.ok(blocked, "Persistent login throttling must be active in development too");
  console.log("PASS: logout revokes session; repeated login attempts throttled; all six public homes retained.");
  assert.ok(!logs.includes(credentials.password));
  console.log("All administrative integration tests passed. Only an isolated temporary database was used.");
} finally {
  await stop();
  // Only the exact temporary directory allocated by this test may be removed.
  const temporaryRoot = path.resolve(os.tmpdir()) + path.sep;
  const resolved = path.resolve(folder);
  if (resolved.startsWith(temporaryRoot) && path.basename(resolved).startsWith("yanina-admin-test-")) fs.rmSync(resolved, { recursive: true, force: true });
}
