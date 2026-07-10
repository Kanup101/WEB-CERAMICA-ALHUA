"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatARS } from "@/lib/utils";
import { useState } from "react";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, totalARS, totalItems, removeItem, updateQuantity } = useCart();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C3AA] bg-[#FFF9EF] text-[#4B4038] transition hover:bg-[#F0E5D6]"
        aria-label="Abrir carrito"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        {totalItems > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#6F4A39] px-1 text-xs font-semibold text-white">
            {totalItems}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-[#342A24]/35"
            aria-label="Cerrar carrito"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#FFF9EF] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E1D1BB] p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-[#8B6E54]">Carrito</p>
                <h2 className="text-xl font-semibold text-[#342A24]">Tu seleccion</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-[#4B4038] hover:bg-[#F0E5D6]"
                aria-label="Cerrar carrito"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 rounded-2xl border border-[#E1D1BB] bg-white p-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EFE4D4]">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-[#342A24]">{item.product.name}</h3>
                        <p className="text-sm text-[#8B6E54]">
                          {formatARS(item.product.priceARS)} por unidad
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#342A24]">
                          Subtotal {formatARS(item.product.priceARS * item.quantity)}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-[#D8C3AA]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-2"
                              aria-label="Restar cantidad"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-2"
                              aria-label="Sumar cantidad"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            className="rounded-full p-2 text-[#8B6E54] hover:bg-[#F0E5D6]"
                            aria-label="Quitar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#D8C3AA] p-8 text-center text-[#6C5C50]">
                  <ShoppingBag className="mx-auto h-8 w-8 text-[#9A6B50]" aria-hidden="true" />
                  <p className="mt-4 font-medium text-[#342A24]">Tu carrito esta vacio.</p>
                  <p className="mt-2 text-sm leading-6">Explora la tienda y guarda tus piezas favoritas para consultar disponibilidad.</p>
                  <Link
                    href="/tienda"
                    onClick={() => setOpen(false)}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-[#D8C3AA] px-5 text-sm font-medium text-[#4B4038] hover:bg-[#F0E5D6]"
                  >
                    Ver piezas
                  </Link>
                </div>
              )}
            </div>

            <div className="border-t border-[#E1D1BB] p-5">
              <div className="flex items-center justify-between text-lg font-semibold text-[#342A24]">
                <span>Total</span>
                <span>{formatARS(totalARS)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                aria-disabled={!items.length}
                className={`mt-4 inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-base font-medium transition ${
                  items.length
                    ? "bg-[#6F4A39] text-[#FFF9EF] hover:bg-[#593A2D]"
                    : "pointer-events-none bg-[#D8C3AA] text-[#FFF9EF]"
                }`}
              >
                Finalizar compra
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
