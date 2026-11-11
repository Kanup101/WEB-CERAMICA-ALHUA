# Experiencias turísticas — etapa 5A

## Objetivo y primera experiencia
Incorporar encuentros culturales presenciales sin modificar tienda, carrito, checkout ni talleres online.
**Barro, mates y encuentros**, con Yanina Cardozo, en Salta, Argentina: **USD 35 por persona**. Sin conversión a pesos, pagos online ni reserva confirmada desde el sitio.

## Arquitectura y funciones
- `src/types/experience.ts`: contrato tipado; datos sin confirmar opcionales.
- `src/data/experiences.ts`: catálogo y búsqueda por slug; textos ES/EN, imágenes con alt, precio e inclusiones.
- `src/components/experiences/ExperiencePages.tsx`: índice, tarjeta y detalle compartidos, enlaces de idioma y metadata.
- `/experiencias` y `/experiencias/[slug]`: rutas App Router; detalles pregenerados y 404 para slugs desconocidos.
- `/en/experiencias` y `/en/experiencias/[slug]`: traducciones reales del contenido y consultas.
- Home con selección destacada; Navbar y Footer conservan las rutas anteriores y suman Experiencias.
- `VideoBlock` se renderiza únicamente si existe `videoUrl` real (MP4 local); poster opcional.

Para agregar una experiencia, sumar un objeto completo al catálogo con slug único y al menos una imagen. No duplicar páginas. `available` queda sin definir hasta confirmar disponibilidad; no se interpreta como cupos libres. Los campos prácticos solo aparecen cuando tienen un valor confirmado.

## Idiomas
Se reutiliza `Locale` de `src/lib/i18n/config.ts`, sin dependencias. Contenido de experiencias en español e inglés, enlaces recíprocos y metadata por idioma. El contenedor inglés tiene `lang="en"`; el documento y la navegación global conservan español. Traducir el resto del sitio y adaptar el idioma del documento requerirá una etapa global de internacionalización. El idioma de la web no confirma idiomas de atención de la actividad.

## Fotografías
Se inspeccionaron y reutilizaron WEBP existentes, sin stock ni imágenes nuevas:
- `/images/products/barro-2.webp`: mano con fragmento de tierra de textura laminada; portada y galería.
- `/images/products/barro-1.webp`: arcilla sobre superficie de trabajo; galería.
Son imágenes del archivo del sitio; no se presentan como registro de asistentes o de esta experiencia. Faltan fotografías reales específicas del encuentro, especialmente modelado, mates y acompañamiento. No se borraron imágenes ni productos.

## WhatsApp
`experienceWhatsAppMessage(experience, locale)` en `src/lib/contact.ts` genera título, ubicación, precio USD y consulta por fechas y reserva. Se reutiliza `whatsappHref` con destino `5493874669134` y `encodeURIComponent`. El enlace `https://wa.me/` abre WhatsApp en móvil o su alternativa web en escritorio. Abrir la consulta no envía el mensaje automáticamente ni confirma una reserva. No hay backend ni formulario de reservas.

## Información pendiente de confirmar
- Duración definitiva.
- Ubicación exacta y punto de encuentro; no publicar direcciones privadas sin confirmación.
- Cantidad de participantes y disponibilidad de fechas.
- Idiomas disponibles para la actividad.
- Sistema de reservas y condiciones de contratación.
- Condiciones de cancelación.
- Conservación, entrega o envío de las piezas; no se promete cocción y entrega el mismo día.
- Fotografías reales de la experiencia.
- Video promocional.

## SEO y difusión futura
Metadata localizada, Open Graph de texto y enlaces de idiomas; no se inventa dominio de producción, reseñas ni valoraciones. Configurar dominio canónico e imagen social absoluta cuando se confirme el dominio público.
Las rutas aceptan parámetros como `?utm_source=hotel&utm_medium=referral` sin leerlos ni añadir seguimiento. En una etapa futura podrán usarse enlaces de campaña para hoteles y hostales, con un módulo privado sujeto a una especificación independiente. No se implementaron panel, autenticación, base de datos, CMS, email ni automatización.

## Verificación local
Validación realizada: lint sin errores; build de producción correcto en Next.js 16.4.6, con las cuatro rutas nuevas generadas. El primer intento de build encontró permisos de escritura en `.next`; el reintento con permisos ampliados terminó correctamente. Pruebas HTTP sobre home, índices ES/EN, detalles ES/EN y detalle con UTM: 200. Slugs inexistentes ES/EN: 404. Se comprobaron los 17 enlaces internos encontrados en esas páginas, existencia de las imágenes y generación/decodificación del enlace WhatsApp ES/EN con destino correcto y USD 35. No se realizó revisión visual interactiva en navegador ni envío de mensajes.

Ejecutar `npm.cmd run lint` y `npm.cmd run build`. Para probar: `npm.cmd run dev`, abrir las rutas ES/EN, alternar idiomas, navegar desde home, menú móvil y footer, y comprobar que WhatsApp contiene USD 35. Probar también el detalle con UTM y un slug inexistente (404). Revisar a 375, 768 y 1280 px. No se realizó deploy, commit ni push.
