import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout proximamente",
  description:
    "Resumen de compra de Alhua Ceramica Creativa. Checkout online proximamente y consultas por WhatsApp para piezas unicas de ceramica artesanal.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
