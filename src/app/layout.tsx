import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alhua Ceramica Creativa | Ceramica artesanal argentina",
    template: "%s | Alhua Ceramica Creativa",
  },
  description:
    "Piezas unicas de ceramica artesanal argentina, objetos hechos a mano y talleres online de ceramica creativa.",
  keywords: [
    "ceramica artesanal",
    "ceramica creativa",
    "piezas unicas de ceramica",
    "talleres online de ceramica",
    "ceramica hecha a mano en Argentina",
    "ceramica artesanal argentina",
  ],
  openGraph: {
    title: "Alhua Ceramica Creativa",
    description: "Ceramica artesanal premium, piezas unicas y talleres online.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
