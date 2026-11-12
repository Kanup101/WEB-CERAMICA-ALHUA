import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import { unzipSync, strFromU8 } from "fflate";

const require = createRequire(import.meta.url), cache = new Map();
function load(file) {
  const filename = path.resolve(file);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  new Function("require", "exports", source)(name => name.startsWith("@/") ? load(path.join("src", name.slice(2)) + ".ts") : name.startsWith(".") ? load(path.resolve(path.dirname(filename), name) + ".ts") : require(name), exports);
  return exports;
}
const { exportXlsx, xlsxContentType } = load("src/lib/admin/xlsx.ts");
const { exportCsv, parseCsv, csvFields } = load("src/lib/admin/csv.ts");
export function workbookXml(bytes) {
  assert.equal(Buffer.from(bytes).subarray(0, 2).toString(), "PK", "A real ZIP-based XLSX, not renamed CSV");
  const entries = unzipSync(new Uint8Array(bytes));
  for (const entry of ["[Content_Types].xml", "_rels/.rels", "xl/workbook.xml", "xl/worksheets/sheet1.xml", "xl/styles.xml"]) assert.ok(entries[entry], `Missing OOXML entry ${entry}`);
  for (const [name, content] of Object.entries(entries)) {
    if (!name.endsWith(".xml") && !name.endsWith(".rels")) continue;
    const xml = strFromU8(content);
    assert.ok(!/<f(?:\s|>)/.test(xml), `${name}: formula found`);
    assert.ok(!/<hyperlink\b|TargetMode="External"/i.test(xml), `${name}: active external link found`);
    assert.ok(!xml.includes("�"), `${name}: corrupted Unicode`);
  }
  assert.ok(!Object.keys(entries).some(name => /externalLinks|vbaProject|hyperlink/i.test(name)), "No active external content");
  return Object.fromEntries(Object.entries(entries).filter(([name]) => name.endsWith(".xml")).map(([name, bytes]) => [name, strFromU8(bytes)]));
}
function decodeXml(text) { return text.replace(/&(?:#x([\da-f]+)|#(\d+)|amp|lt|gt|quot|apos);/gi, (entity, hex, decimal) => hex ? String.fromCodePoint(parseInt(hex, 16)) : decimal ? String.fromCodePoint(Number(decimal)) : ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" })[entity]); }
export function sheetCells(xml, sharedStrings = "") {
  const strings = [...sharedStrings.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(match => [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(text => decodeXml(text[1])).join(""));
  return Object.fromEntries([...xml.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].map(([, attrs, body]) => {
    const content = body || "";
    const address = /\br="([A-Z]+\d+)"/.exec(attrs)?.[1];
    const type = /\bt="([^"]+)"/.exec(attrs)?.[1];
    const text = type === "s" ? strings[Number(/<v>(\d+)<\/v>/.exec(content)?.[1])] : [...content.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(match => decodeXml(match[1])).join("");
    return [address, { type, text }];
  }));
}
const fixture = {
  id: "00000000-0000-4000-8000-000000000001", name: 'Hostería Ñandú, "Salta"; & encuentro', type: "hotel", city: "San Ramón de la Nueva Orán",
  email: "reservas@example.invalid", language: "es", source: "Directorio comercial autorizado", address: "Peña 001", website: "https://example.invalid",
  phone: "03870001234", whatsapp: "+5493870001234", contact_person: "María José Núñez", contact_reason: "Coordinación comercial",
  source_url: "https://example.invalid/origen?q=1&x=2", verified_at: "2026-11-11", email_verification: "verificado", status: "sin_contactar",
  notes: 'Primera línea, con coma; punto y coma\nSegunda línea: "habitación" & <consulta> — 한국어 中文', next_action: "Llamar", follow_up: "2026-12-01",
  created_at: "2026-11-11T23:30:12.000Z", updated_at: "2026-11-12T00:05:02.000Z", version: 1,
};

export async function testExport() {
  assert.equal(xlsxContentType, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  const bytes = await exportXlsx([fixture], true);
  const xml = workbookXml(bytes), cells = sheetCells(xml["xl/worksheets/sheet1.xml"], xml["xl/sharedStrings.xml"]);
  assert.equal(Object.keys(cells).length, 44, "22 fields, header + record");
  const expected = [fixture.name, "Hotel", fixture.city, fixture.email, "Español", fixture.source, fixture.address, fixture.website, fixture.phone, fixture.whatsapp, fixture.contact_person, fixture.contact_reason, fixture.source_url, fixture.verified_at, "Verificado", "Sin contactar", fixture.notes, fixture.next_action, fixture.follow_up, fixture.id, fixture.created_at, fixture.updated_at];
  function column(index) { return String.fromCharCode(65 + index); }
  expected.forEach((value, index) => { const cell = cells[`${column(index)}2`]; assert.ok(["s", "inlineStr"].includes(cell.type), `${column(index)}2 must be text`); assert.equal(cell.text, value, `${column(index)}2 value changed`); });
  assert.equal(cells.A1.text, "Nombre comercial"); assert.equal(cells.I1.text, "Teléfono comercial"); assert.equal(cells.Q1.text, "Notas internas"); assert.equal(cells.V1.text, "Última actualización (UTC)");
  assert.ok(xml["xl/styles.xml"].includes('formatCode="@"') || xml["xl/styles.xml"].includes('numFmtId="49"'), "Explicit text format");
  const attacks = ["=1+1", "+SUM(A1:A2)", "-1+2", "@SUM(A1:A2)", '\t=HYPERLINK("https://example.invalid")', "\r\n=CMD()", "001234567890123456789", "+549001234567"];
  for (const attack of attacks) {
    const attackXml = workbookXml(await exportXlsx([{ ...fixture, name: attack, phone: attack, whatsapp: attack, notes: attack }]));
    const result = sheetCells(attackXml["xl/worksheets/sheet1.xml"], attackXml["xl/sharedStrings.xml"]);
    for (const address of ["A2", "I2", "J2", "Q2"]) { assert.ok(["s", "inlineStr"].includes(result[address].type)); assert.equal(result[address].text, attack); }
  }
  const empty = sheetCells(workbookXml(await exportXlsx([]))["xl/worksheets/sheet1.xml"]);
  assert.equal(Object.keys(empty).length, 19, "Empty data still has 19 headings");
  const optionalXml = workbookXml(await exportXlsx([{ ...fixture, address: "", website: "", contact_person: "", contact_reason: "", source_url: "", next_action: "" }]));
  const optionalCells = sheetCells(optionalXml["xl/worksheets/sheet1.xml"], optionalXml["xl/sharedStrings.xml"]);
  assert.equal(optionalCells.I2.text, fixture.phone); assert.equal(optionalCells.J2.text, fixture.whatsapp); assert.equal(optionalCells.Q2.text, fixture.notes);
  const csv = exportCsv([fixture]);
  assert.deepEqual([...Buffer.from(csv).subarray(0, 3)], [0xEF, 0xBB, 0xBF]);
  assert.equal(csv.slice(1).split("\r\n")[0], csvFields.join(","));
  assert.ok(csv.includes('"03870001234"') && csv.includes('"\'+5493870001234"'));
  const csvRecord = parseCsv(csv)[0];
  assert.equal(csvRecord.data.name, fixture.name); assert.equal(csvRecord.data.notes, fixture.notes); assert.equal(csvRecord.data.phone, fixture.phone);
  for (const attack of attacks.slice(0, 6)) { const exported = exportCsv([{ ...fixture, notes: attack }]); assert.equal(parseCsv(exported)[0].data.notes, "'" + attack); }
  assert.equal(parseCsv('name,type,city,email,language,source\r\nEjemplo,hotel,Salta,ejemplo@example.invalid,es,Fuente')[0].data.email, "ejemplo@example.invalid");
  console.log("PASS export: real OOXML, all columns, UTF-8, accents/CJK, multiline notes, phones/zeros/long numbers, literal formula payloads, empty sheet and CSV import compatibility.");
}
if (process.argv[1]?.endsWith("test-admin-export.mjs")) await testExport();
