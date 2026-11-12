import { getAuth } from "@/lib/admin/auth.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function handle(request: Request) {
  const action = new URL(request.url).pathname.replace(/^\/api\/auth/, "");
  if (!((request.method === "POST" && ["/sign-in/email", "/sign-out"].includes(action)) || (request.method === "GET" && action === "/get-session"))) return Response.json({ error: "Ruta no disponible." }, { status: 404 });
  try {
    const response = await getAuth().handler(request);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch { return Response.json({ error: "Administración no configurada. Consultá el procedimiento de instalación." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
export const GET = handle;
export const POST = handle;
