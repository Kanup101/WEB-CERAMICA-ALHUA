import type { Metadata } from "next";
import "../globals.css";
export const metadata: Metadata = { title: "Administración | Yanina Cardozo", robots: { index: false, follow: false, nocache: true } };
export const dynamic = "force-dynamic";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body className="min-h-screen bg-[#F5EFE6] text-[#342A24]">{children}</body></html>;
}
