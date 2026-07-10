# Yanina Cardozo | Ceramica Creativa

Primera version estable de la web ecommerce inicial para Yanina Cardozo, artista ceramista.

Incluye landing, tienda estatica, detalle de piezas, talleres online, historia de marca, contacto, carrito visual del lado del cliente y arquitectura preparada para integrar pagos, CMS y base de datos en etapas posteriores.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Componentes UI estilo shadcn/ui
- Lucide React
- Datos mock en TypeScript

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La app corre por defecto en `http://localhost:3000`.

En PowerShell con politica de scripts restringida puede ser necesario usar:

```bash
npm.cmd run dev
```

## Calidad y build

```bash
npm run lint
npm run build
```

Equivalentes recomendados en Windows/PowerShell:

```bash
npm.cmd run lint
npm.cmd run build
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
- Sobre Yanina y Contacto con FAQ.
- Carrito cliente con agregar, quitar, cambiar cantidad y total.
- Carrito persistente con `localStorage`.
- Checkout placeholder con resumen y consulta por WhatsApp.
- SEO inicial por paginas principales.
- Script de conversion de imagenes reales a WEBP con `sharp`.

## Imagenes

Las imagenes originales se colocan en `public/images/originales/`, carpeta ignorada por Git.

Para convertir JPG, JPEG o PNG a WEBP optimizado:

```bash
npm run images:convert
```

Las WEBP finales quedan en `public/images/products/` y son las que debe usar la web.

## Configuracion sensible

No se incluyen claves reales ni variables sensibles. Los archivos `.env*`, builds y dependencias locales quedan excluidos por `.gitignore`.

## Proximas etapas

- Reemplazar placeholders por fotografia real optimizada.
- Conectar productos y talleres a CMS o base de datos.
- Integrar checkout real con Mercado Pago para Argentina.
- Preparar Stripe para ventas internacionales.
- Agregar autenticacion/admin para cargar stock y precios.
- Implementar i18n completo `es/en`.
- Sumar emails transaccionales y formularios con backend.
