import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Yanina Cardozo | Ceramica creativa",
    template: "%s | Yanina Cardozo",
  },
  description:
    "Yanina Cardozo, artista ceramista. Piezas unicas de ceramica artesanal argentina y talleres online de ceramica creativa.",
  keywords: [
    "ceramica artesanal",
    "ceramica creativa",
    "piezas unicas de ceramica",
    "talleres online de ceramica",
    "ceramica hecha a mano en Argentina",
    "ceramica artesanal argentina",
  ],
  openGraph: {
    title: "Yanina Cardozo | Ceramica creativa",
    description: "Piezas de ceramica artesanal, objetos unicos y talleres online.",
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
