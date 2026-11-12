import { ZodError } from "zod";
import { z } from "zod";
import { requireAdmin, AdminError, checkOrigin, readJson } from "@/lib/admin/access";
import * as repository from "@/lib/admin/repository";
import { localizedPath } from "@/lib/i18n/config";
import { siteOrigin } from "@/lib/i18n/routes";
import { xlsxContentType } from "@/lib/admin/xlsx";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const responseHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" };
async function handle(request: Request) {
  try {
    await requireAdmin(request.headers);
    const url = new URL(request.url), parts = url.pathname.replace(/^\/api\/admin\/?/, "").split("/").filter(Boolean);
    if (request.method !== "GET") checkOrigin(request);
    const h = request.headers;
    let data: unknown;
    if (request.method === "GET") {
      if (parts.join("/") === "dashboard") data = await repository.dashboard(h);
      else if (parts.join("/") === "alojamientos") data = await repository.listLodgings(h, url.searchParams);
      else if (parts[0] === "alojamientos" && parts.length === 2) data = await repository.lodgingDetail(h, z.uuid().parse(parts[1]));
      else if (parts.join("/") === "campanas") {
        const rows = await repository.listCampaigns(h);
        data = rows.map(row => ({ ...row, experience_url: (siteOrigin() || "") + localizedPath(`/experiencias/${row.experience_slug}`, row.language), eligible: 0 }));
        for (const row of data as { language: string; eligible: number }[]) row.eligible = (await repository.eligibleRecipients(h, row.language)).length;
      } else if (parts.join("/") === "exportar" || parts.join("/") === "plantilla") {
        const template = parts[0] === "plantilla", management = url.searchParams.get("scope") === "gestion";
        const format = z.enum(["csv", "xlsx"]).parse(url.searchParams.get("format") || "csv");
        if (template && format !== "csv") throw new AdminError(400, "La plantilla de importación utiliza CSV.");
        const filename = template ? "plantilla-alojamientos" : management ? "gestion-completa-no-usar-para-envios" : "contactos-elegibles";
        if (format === "xlsx") {
          const bytes = await repository.contactXlsx(h, management);
          return new Response(new Uint8Array(bytes), { headers: { ...responseHeaders, "Content-Type": xlsxContentType, "Content-Disposition": `attachment; filename="${filename}.xlsx"` } });
        }
        return new Response(await repository.contactCsv(h, template, management), { headers: { ...responseHeaders, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${filename}.csv"` } });
      }
      else throw new AdminError(404, "Ruta inexistente.");
    } else if (request.method === "POST") {
      const body = await readJson(request);
      if (parts.join("/") === "alojamientos") data = await repository.createLodging(h, body);
      else if (parts[0] === "alojamientos" && parts[2] === "comunicaciones" && parts.length === 3) data = await repository.addCommunication(h, z.uuid().parse(parts[1]), body);
      else if (parts.join("/") === "campanas") data = await repository.saveCampaign(h, body);
      else if (parts.join("/") === "campanas/iniciales") data = await repository.seedCampaigns(h);
      else if (parts.join("/") === "importar") { const input = z.object({ csv: z.string().max(250_000), confirm: z.boolean() }).strict().parse(body); data = await repository.importContacts(h, input.csv, input.confirm); }
      else throw new AdminError(404, "Ruta inexistente.");
    } else if (request.method === "PUT" && parts.length === 2) {
      const id = z.uuid().parse(parts[1]), body = await readJson(request);
      if (parts[0] === "alojamientos") data = await repository.updateLodging(h, id, body);
      else if (parts[0] === "campanas") data = await repository.saveCampaign(h, body, id);
      else throw new AdminError(404, "Ruta inexistente.");
    } else if (request.method === "DELETE" && parts[0] === "alojamientos" && parts.length === 2) data = await repository.deleteLodging(h, z.uuid().parse(parts[1]), await readJson(request));
    else throw new AdminError(405, "Método no permitido.");
    return Response.json(data, { headers: responseHeaders });
  } catch (error) {
    if (error instanceof ZodError) return Response.json({ error: error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ") }, { status: 422, headers: responseHeaders });
    if (error instanceof AdminError) return Response.json({ error: error.message }, { status: error.status, headers: responseHeaders });
    console.error("Administrative operation failed", error instanceof Error ? error.name : "UnknownError");
    return Response.json({ error: "No se pudo completar la operación. Revisá la configuración o intentá nuevamente." }, { status: 503, headers: responseHeaders });
  }
}
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
