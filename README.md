# Alhua Ceramica Creativa

Web ecommerce inicial para una marca de ceramica artesanal premium: landing, tienda estatica, detalle de piezas, talleres online, historia de marca, contacto y carrito visual.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Componentes UI estilo shadcn/ui
- Lucide React
- Datos mock en TypeScript

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
```

La app corre por defecto en `http://localhost:3000`.

En PowerShell con politica de scripts restringida puede ser necesario usar:

```bash
npm.cmd run dev
```

## Estructura principal

```text
src/app/                 Rutas App Router
src/components/          Componentes reutilizables
src/contexts/            CartContext cliente
src/data/                Productos y talleres mock
src/lib/payments/        Placeholders Mercado Pago y Stripe
src/lib/i18n/            Config base para futuro idioma ingles
src/types/               Tipos de producto, taller y carrito
public/images/           Placeholders locales reemplazables
```

## Funcionalidad incluida

- Home con hero, piezas destacadas, talleres, historia, proceso y newsletter visual.
- Tienda con grilla, filtros por categoria y orden visual.
- Detalle de pieza con galeria, ficha tecnica, cuidados, stock y relacionados.
- Talleres y detalle de taller con informacion completa.
- Sobre Alhua y Contacto con FAQ.
- Carrito cliente con agregar, quitar, cambiar cantidad y total.
- Checkout placeholder.
- SEO inicial por paginas principales.

## Proximas etapas

- Reemplazar placeholders por fotografia real optimizada.
- Conectar productos y talleres a CMS o base de datos.
- Integrar checkout real con Mercado Pago para Argentina.
- Preparar Stripe para ventas internacionales.
- Agregar autenticacion/admin para cargar stock y precios.
- Implementar i18n completo `es/en`.
- Sumar emails transaccionales y formularios con backend.
