"use client";
import { useI18n } from "@/lib/i18n/provider";
import Link from "@/lib/i18n/Link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
export function Navbar() {
    const { t } = useI18n();
    const navItems = [
        { href: "/tienda", label: t("Tienda") },
        { href: "/talleres", label: t("Talleres") },
        { href: "/experiencias", label: t("Experiencias") },
        { href: "/sobre-yanina", label: t("Sobre Yanina") },
        { href: "/contacto", label: t("Contacto") },
    ];
    const [open, setOpen] = useState(false);
    return (<header className="sticky top-0 z-40 border-b border-[#E6D7C2] bg-[#FFF9EF]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label={t("Principal")}>
        <Link href="/" className="font-brand text-3xl font-semibold tracking-tight text-[#342A24]">
          Yanina Cardozo
          <span className="block text-xs font-normal uppercase tracking-[0.2em] text-[#8B6E54]">{t("Ceramica Creativa")}</span>
        </Link>
        <div className="hidden items-center gap-4 xl:flex">
          {navItems.map((item) => (<Link key={item.href} href={item.href} className="text-sm font-medium text-[#4B4038] hover:text-[#8F5F45]">
              {item.label}
            </Link>))}
        </div>
        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher />
          <CartDrawer />
        </div>
        <div className="flex items-center gap-2 xl:hidden">
          <CartDrawer />
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[#D8C3AA] p-2 text-[#342A24]" aria-label={t("Abrir menu")} aria-expanded={open} aria-controls="mobile-navigation">
            {open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </button>
        </div>
      </nav>
      {open ? (<div id="mobile-navigation" className="border-t border-[#E6D7C2] bg-[#FFF9EF] px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (<Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl px-3 py-2 text-sm font-medium text-[#4B4038] hover:bg-[#F0E5D6]">
                {item.label}
              </Link>))}
            <LanguageSwitcher />
          </div>
        </div>) : null}
    </header>);
}
