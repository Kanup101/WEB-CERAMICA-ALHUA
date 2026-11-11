"use client";
import { useI18n } from "@/lib/i18n/provider";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ButtonLink } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { checkoutWhatsAppMessage } from "@/lib/contact";
export function CheckoutClient() {
    const { t, locale, money } = useI18n();
    const { items, totalARS } = useCart();
    const whatsappMessage = checkoutWhatsAppMessage(items, totalARS, locale);
    return (<div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow={t("Checkout")} title={t("Resumen de compra")} description={t("El checkout online estara disponible proximamente. Por ahora podes finalizar tu compra por WhatsApp con el resumen ya preparado.")}/>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.75fr]">
        <section className="rounded-3xl border border-[#E1D1BB] bg-[#FFF9EF] p-5 shadow-[0_18px_60px_rgba(74,55,40,0.07)] sm:p-6">
          <h2 className="text-xl font-semibold text-[#342A24]">{t("Productos seleccionados")}</h2>
          {items.length ? (<div className="mt-5 space-y-4">
              {items.map((item) => (<article key={item.product.id} className="flex gap-4 rounded-2xl border border-[#E1D1BB] bg-white p-3 sm:p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#EFE4D4]">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="96px"/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#8B6E54]">{t(item.product.category)}</p>
                    <h3 className="mt-1 font-semibold text-[#342A24]">{item.product.name}</h3>
                    <p className="mt-2 text-sm text-[#6C5C50]">
                      {item.quantity} x {money(item.product.priceARS)}
                    </p>
                    <p className="mt-1 font-semibold text-[#6F4A39]">{t("Subtotal")} {money(item.product.priceARS * item.quantity)}
                    </p>
                  </div>
                </article>))}
            </div>) : (<div className="mt-5 rounded-3xl border border-dashed border-[#D8C3AA] p-8 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-[#9A6B50]" aria-hidden="true"/>
              <p className="mt-4 text-[#6C5C50]">{t("Tu carrito esta vacio.")}</p>
              <ButtonLink href="/tienda" className="mt-5" variant="outline">{t("Volver a la tienda")}</ButtonLink>
            </div>)}
        </section>

        <aside className="h-fit rounded-3xl border border-[#E1D1BB] bg-[#3B3029] p-6 text-[#FFF9EF]">
          <p className="text-sm uppercase tracking-[0.16em] text-[#D8B79C]">{t("Total general")}</p>
          <p className="mt-3 text-4xl font-semibold">{money(totalARS)}</p>
          <p className="mt-5 text-sm leading-6 text-[#E7D2BA]">{t("El checkout online estara disponible proximamente. Por ahora podes finalizar tu compra por WhatsApp y coordinamos disponibilidad, envio o retiro de forma manual.")}</p>
          <div className="mt-6 flex flex-col gap-3">
            <WhatsAppButton message={whatsappMessage} label={t("Finalizar por WhatsApp")}/>
            <ButtonLink href="/tienda" variant="outline" className="border-[#D8B79C] text-[#FFF9EF] hover:bg-white/10">{t("Seguir viendo piezas")}</ButtonLink>
          </div>
          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-[#F4E8D9]">{t("Estructura preparada para futura integracion con Mercado Pago y Stripe, sin claves reales ni pagos activos.")}</div>
        </aside>
      </div>
    </div>);
}
