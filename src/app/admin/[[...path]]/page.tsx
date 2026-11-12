import { headers } from "next/headers";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { requireAdmin, AdminError } from "@/lib/admin/access";
import { AdminPanel } from "@/components/admin/AdminPanel";
export const runtime = "nodejs";
export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const route = path.join("/");
  if (route === "login") return <AdminPanel route="login" />;
  try { await requireAdmin(await headers()); }
  catch (error) {
    if (error instanceof AdminError && error.status === 403) return <main className="p-10"><h1>Acceso no autorizado</h1><p>La cuenta no tiene permisos administrativos.</p><Link href="/admin/login">Volver al acceso</Link></main>;
    redirect("/admin/login");
  }
  if (!route) redirect("/admin/difusion");
  if (!(["difusion", "difusion/alojamientos", "difusion/alojamientos/nuevo", "difusion/campanas"].includes(route) || /^difusion\/alojamientos\/[a-f0-9-]{36}$/.test(route))) notFound();
  return <AdminPanel route={route} />;
}
