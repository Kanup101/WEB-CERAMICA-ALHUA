import Link from "next/link";
import { Camera, Mail, MapPin } from "lucide-react";
import { whatsappHref } from "@/components/shared/WhatsAppButton";

export function Footer() {
  return (
    <footer className="border-t border-[#E1D1BB] bg-[#3B3029] text-[#FFF9EF]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl font-semibold">Alhua</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#E7D2BA]">
            Ceramica artesanal creada en Argentina: piezas utilitarias, objetos unicos y talleres online para habitar el oficio con calma.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D8B79C]">Explorar</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#F4E8D9]">
            <Link href="/tienda">Tienda</Link>
            <Link href="/talleres">Talleres</Link>
            <Link href="/sobre-alhua">Sobre Alhua</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D8B79C]">Contacto</h3>
          <div className="mt-4 space-y-3 text-sm text-[#F4E8D9]">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Argentina</p>
            <a className="flex items-center gap-2" href="mailto:hola@alhua.com"><Mail className="h-4 w-4" /> hola@alhua.com</a>
            <a className="flex items-center gap-2" href="https://instagram.com" target="_blank" rel="noreferrer"><Camera className="h-4 w-4" /> Instagram</a>
            <a href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-[#D8B79C]">
        Alhua Ceramica Creativa. Preparada para ecommerce, pagos e internacionalizacion.
      </div>
    </footer>
  );
}
