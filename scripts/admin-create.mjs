import nextEnv from "@next/env";
import fs from "node:fs";
import { randomBytes } from "node:crypto";
import readline from "node:readline";
import { createInterface } from "node:readline/promises";
import { migrate } from "./admin-migrate.mjs";
import { database } from "../src/lib/admin/database.mjs";
import { createAuth } from "../src/lib/admin/auth.mjs";

nextEnv.loadEnvConfig(process.cwd());
async function hiddenPassword(prompt) {
  if (!process.stdin.isTTY) throw Error("Usá una terminal interactiva para introducir la contraseña.");
  process.stdout.write(prompt);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true); process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const done = () => { process.stdin.off("keypress", keypress); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write("\n"); };
    function keypress(text, key) {
      if (key?.ctrl && key.name === "c") { done(); reject(Error("Cancelado.")); }
      else if (key?.name === "return") { done(); resolve(value); }
      else if (key?.name === "backspace") value = value.slice(0, -1);
      else if (text && !key?.ctrl && !key?.meta) value += text;
    }
    process.stdin.on("keypress", keypress);
  });
}
try {
  if (!process.env.BETTER_AUTH_SECRET) {
    if (fs.existsSync(".env.local")) throw Error("Configurá BETTER_AUTH_SECRET en .env.local; el archivo existente no se sobrescribe.");
    const secret = randomBytes(48).toString("base64url");
    fs.writeFileSync(".env.local", `BETTER_AUTH_SECRET=${secret}\nBETTER_AUTH_URL=http://localhost:3000\nADMIN_DATABASE_PATH=.data/admin.sqlite\n`, { flag: "wx", mode: 0o600 });
    process.env.BETTER_AUTH_SECRET = secret;
    process.env.BETTER_AUTH_URL ||= "http://localhost:3000";
    console.log("Configuración local creada sin mostrar el secreto. Reiniciá Next después de este procedimiento.");
  }
  let input;
  if (process.argv.includes("--stdin")) {
    // For controlled provisioning/tests. The secret is never accepted in command arguments.
    let source = ""; for await (const chunk of process.stdin) { source += chunk; if (source.length > 4096) throw Error("Entrada demasiado grande."); } input = JSON.parse(source);
  } else {
    const terminal = createInterface({ input: process.stdin, output: process.stdout });
    const name = await terminal.question("Nombre administrativo: "); const email = await terminal.question("Correo administrativo: "); terminal.close();
    const password = await hiddenPassword("Contraseña (14–128 caracteres; no se muestra): ");
    if (password !== await hiddenPassword("Repetí la contraseña: ")) throw Error("Las contraseñas no coinciden.");
    input = { name, email, password };
  }
  const { z } = await import("zod");
  const credentials = z.object({ name: z.string().trim().min(1).max(100), email: z.email().trim().toLowerCase(), password: z.string().min(14).max(128) }).strict().parse(input);
  await migrate();
  const result = await createAuth(true).api.signUpEmail({ body: credentials });
  database().prepare("INSERT INTO admin_users (user_id) VALUES (?)").run(result.user.id);
  console.log("Administrador creado. El registro público está deshabilitado. Ingresá por /admin/login.");
  process.exit(0);
} catch (error) { console.error(error instanceof Error && error.name !== "ZodError" ? error.message : "Datos administrativos inválidos."); process.exit(1); }
