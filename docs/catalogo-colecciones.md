# Catálogo de colecciones — Etapa 7B

## Estado actual

16 colecciones públicas, 40 fotografías visibles; 17 colecciones internas, 58 fotografías conservadas. Pinchuda reúne pinchuda1.png y pichuda2.png. Aros y collares conserva sus 18 fotografías, orden y WebP, con published: false. No se eliminaron ni modificaron originales o derivados. La ejecución requerida de images:collections reutilizó las 58 conversiones; no hubo reconversión. Pesos sin cambios: 127.997.967 bytes originales y 11.255.280 bytes optimizados incluyendo miniaturas (91,21 % de reducción).

| Colección | Slug | Publicación | Fotos |
| --- | --- | --- | ---: |
| Ojo de loca | ojodeloca | Publicada | 3 |
| Aros y collares | aros-collares | Oculta | 18 |
| Obra | obra | Publicada | 5 |
| Antaras | antaras | Publicada | 2 |
| Boca de loca | bocadeloca | Publicada | 1 |
| Figura | figura | Publicada | 6 |
| Copas | copas | Publicada | 2 |
| Derbake | derbake | Publicada | 1 |
| Pinchuda | pinchuda | Publicada | 2 |
| Hurna | hurna | Publicada | 1 |
| Vasija silvadora peluca | vasijasilvadora-peluca | Publicada | 5 |
| Máscara | mascara | Publicada | 1 |
| Tambor | tambor | Publicada | 3 |
| Taza biblioteca | taza-biblioteca | Publicada | 2 |
| Vasija silvadora | vasija-silvadora | Publicada | 3 |
| Vasija silvadora picolargo | vasijasilvadora-picolargo | Publicada | 2 |
| Venus silbato | venus-silbato | Publicada | 1 |

## Dirección de arte

El catálogo, las galerías y la sección de portada usan un fondo crema continuo, tipografía de marca, márgenes amplios, escalas alternadas y composición asimétrica en doce columnas. No hay tarjetas comerciales, marcos blancos decorativos ni texto Abrir colección. Los títulos permanecen visibles en pantalla táctil. Las fotos conservan su proporción completa; el hover amplía solo un 1,2 %, sin recortar la obra. La portada selecciona Ojo de loca, Figura y Vasija silvadora peluca.

Cada colección comienza con su portada de gran formato. El recorrido alterna posiciones y escalas, con descripciones junto a la fotografía en escritorio y debajo en móvil. Los datos técnicos están en un desplegable opcional. El visor modal incorpora ficha sin abandonar la imagen, flechas, Escape, navegación táctil horizontal, confinamiento nativo del foco y restauración al cerrar. Los controles tienen foco visible y un mínimo de 44 px en el visor. Las entradas usan IntersectionObserver y CSS; sin JavaScript las fotos no quedan ocultas. prefers-reduced-motion desactiva los movimientos y apariciones. Sin bibliotecas de animación nuevas ni scroll-jacking.

Referencias consultadas mediante navegación web, sin copiar imágenes ni código:

- [COTTA Studio](https://cotta-studio.com/): separación entre proyectos y tienda y protagonismo de la fotografía.
- [Simone Bodmer-Turner](https://simonebodmerturner.com/): referencia propuesta de fotografía escultórica y sobriedad. La portada y About no ofrecieron texto extraíble; se consultaron resultados de sus fotografías oficiales. No fue posible inspeccionar su sitio completo en Chrome porque el entorno bloquea Internet externo.
- [Edmund de Waal](https://www.edmunddewaal.com/making/works): estructura de archivo y relación explícita entre imagen y datos documentados.
- [Florian Gadsby](https://www.floriangadsby.com/gallery/): descripción próxima a la imagen y precisión de datos técnicos respaldados por documentación del autor.

## Fuentes, fusión y redirecciones

La fuente sigue siendo exclusivamente public/colecciones, registrada como public/Colecciones en este checkout. La fuente nunca se modifica. No se usaron imágenes de la tienda ni public/images/originales. Los WebP permanecen en public/images/collections/<slug>/.

src/data/collections-settings.json contiene pichuda: { mergeInto: 'pinchuda' }. El procesador fusiona el grupo lógico y conserva las rutas existentes de pichuda2.png bajo images/collections/pichuda, su ID, hash, dimensiones y peso. No mueve, borra ni vuelve a codificar esa foto. Pinchuda tiene orden explícito de sus dos originales. Una segunda regeneración no recrea la colección independiente.

next.config.ts incorpora redirecciones permanentes 308 de /colecciones/pichuda, /es/colecciones/pichuda, /en/colecciones/pichuda, /de/colecciones/pichuda, /fr/colecciones/pichuda, /ko/colecciones/pichuda y /zh-CN/colecciones/pichuda a Pinchuda en el idioma correspondiente. La variante /es termina en la URL española canónica sin prefijo. Los parámetros de consulta se conservan. No se modificaron allowedDevOrigins ni la configuración del servidor.

Aros y collares no aparece en portada, catálogo, publicPaths, navegación entre colecciones ni sitemap; su página responde 404 en los seis idiomas. Los archivos siguen disponibles como recursos estáticos, ya que se pidió conservar los WebP: ocultar una colección no es un mecanismo de privacidad de imágenes.

## Fichas y traducciones

43 fichas editoriales en src/data/artworks.json: 25 asociadas a fotos públicas y 18 de Aros y collares guardadas sin publicar. Las 58 fotografías fueron inspeccionadas visualmente. Cada fotografía tiene descripción propia y alt descriptivo en es, en, de, fr, ko y zh-CN. Las fotos idénticas conservan descripciones iguales: no se inventan diferencias visuales. Las vistas claras de una misma pieza comparten ficha y materiales. Los conjuntos fotografiados se registran como conjuntos; una ficha no equivale necesariamente a una única pieza física. Las asociaciones y rótulos numerados son editoriales y siguen pendientes de validación de Yanina.

No hay confirmación documental de materiales, modelado, superficie, esmaltes/pigmentos, cocción, función o intención para estas fichas. Todos esos campos permanecen vacíos, con el estado pendiente mostrado en los seis idiomas. No se reutilizaron afirmaciones de la tienda para rellenarlos. No se publican interpretaciones culturales, rituales o religiosas. curatorialReading permanece null; si posteriormente se incorpora, tendrá etiqueta y advertencia de lectura propuesta, separada de la intención confirmada de la artista.

El modelo ArtworkContent está en src/types/artwork.ts. Contiene ID, título editorial, colección principal, composición visual, materiales, materiales complementarios, técnicas, campos técnicos específicos, función, intención, artistIntentVerified, lectura curatorial, fuentes de verificación, estado de revisión y relación de imágenes por originalName. Las descripciones y alt referencian claves artwork.photo.* en los seis diccionarios. getArtworkForImage y getPhotoContent resuelven la relación sin duplicar materiales en cada foto. Obra 4.jpg y Vasija silvadora 1.jpg comparten ficha: son duplicados exactos del mismo contenido en dos colecciones.

El archivo [fichas-artisticas-pendientes.md](fichas-artisticas-pendientes.md) contiene la revisión completa por foto y los puntos que debe confirmar Yanina. No hubo imágenes imposibles de inspeccionar. No se implementó CMS ni se modificó el administrador.

## Mantenimiento

- Para restaurar Aros y collares: cambiar published a true en su configuración, ejecutar npm.cmd run images:collections y hacer build. Sus 18 fichas y traducciones ya están preparadas, con materiales e intención pendientes. Para ocultarla de nuevo, usar false. No borrar fotos.
- Para cambiar portada u orden: cover e imageOrder usan nombres originales exactos; order ordena colecciones. Ejecutar images:collections después del cambio. No editar el manifiesto generado a mano.
- Para añadir fotos: colocar originales solo en public/colecciones, usar base y número inequívocos, ejecutar images:collections y revisar el manifiesto. Asociar cada foto a una ficha existente o nueva, inspeccionarla y agregar descripciones y alt en los seis idiomas. El prebuild impide publicar imágenes sin descripción o con claves faltantes.
- Para confirmar información: editar la ficha única en artworks.json, agregar la fuente en verificationSources y las traducciones documentadas en messages/*.json. Rellenar los campos específicos; para publicar artistIntent se requiere artistIntentVerified: true. Mantener null si falta confirmación. Separar cualquier lectura curatorial de lo que afirma la artista.
- Los títulos de colección conservan sus nombres artísticos. Los rótulos numerados de ficha son identificadores editoriales; Yanina puede sustituirlos por títulos confirmados.
- Para nuevas colecciones: nuevo nombre base más ficha, traducciones y ajustes opcionales. La fusión configurada de Pichuda se conserva en cada ejecución. No generar una nueva categoría Pichuda.

## Rendimiento, SEO y compatibilidad

next/image usa tamaños responsive, dimensiones reservadas y carga diferida. Solo se precarga la portada de catálogo/detalle; el resto usa los WebP existentes y miniaturas. El visor carga el archivo grande solicitado, sin precargar todas las ampliaciones. Las descripciones, alt, metadata y etiquetas están localizados. El selector conserva la colección al cambiar de idioma.

Canonical, hreflang, Open Graph y sitemap se integran con las rutas existentes y excluyen Aros y Pichuda. Mantener NEXT_PUBLIC_SITE_URL con el dominio real para sitemap y URLs sociales absolutas; sin dominio se conserva la política previa de sitemap vacío y enlaces relativos. No se inventa un dominio de producción.

Se preservan tienda, precios, productos, carrito, checkout, talleres, experiencias, Better Auth, SQLite, campañas, alojamientos, XLSX y configuración de desarrollo. No se instalaron dependencias, no se hizo deploy, commit ni push. Los dos videos sin seguimiento preexistentes no forman parte de esta etapa.

## Componentes y archivos

Nuevos componentes: ArtworkInformation, CollectionLightbox, Reveal. CollectionCover y CollectionsFeature forman parte de CollectionPages, que ahora implementa el diseño editorial. Nuevo modelo y datos: src/types/artwork.ts, src/data/artworks.ts y src/data/artworks.json.

Archivos actualizados en esta etapa: src/components/collections/CollectionPages.tsx, src/app/globals.css, src/views/Home.tsx, src/lib/i18n/routes.ts, src/data/collections-settings.json, src/data/collections-manifest.json, scripts/process-collections.mjs, scripts/test-collections.mjs, scripts/test-collections-browser.mjs, messages/{es,en,de,fr,ko,zh-CN}.json, next.config.ts, package.json y este documento. Nuevos scripts: scripts/audit-artworks.mjs, scripts/test-collections-http.mjs. El prebuild ejecuta la auditoría previa de idiomas y la nueva auditoría de fichas.

## Comprobación

Desde la raíz del proyecto:

```powershell
npm.cmd run images:collections
node scripts/test-collections.mjs
npm.cmd run lint
npm.cmd run build
npm.cmd run start -- --hostname localhost --port 3105
```

En otra consola, con ese servidor activo:

```powershell
node scripts/test-collections-http.mjs
node scripts/test-collections-browser.mjs
npm.cmd run test:i18n:http
```

Pruebas responsive: 360, 390, 768 y 1440 px. Revisar /, /colecciones, /colecciones/pinchuda, /colecciones/ojodeloca; la URL antigua /colecciones/pichuda debe redirigir. /colecciones/aros-collares debe dar 404. Abrir visor, desplegar ficha, usar flechas, Escape y gesto horizontal; cambiar los seis idiomas. Se probaron movimientos reducidos, restauración del foco, menú móvil, agregar al carrito y ausencia de excepciones JavaScript. Se revisaron capturas del catálogo y galería. La prueba táctil automatizada simula eventos; es recomendable revisar también en un teléfono físico.

Las pruebas administrativas se ejecutaron con base temporal aislada mediante npm.cmd run test:admin: autenticación, CRUD, campañas, exportaciones, persistencia y sesiones aprobados. No se accedió a datos privados de producción.

Git recomendado: git status --short, git diff --check y git diff. Agregar solo rutas revisadas; no usar git add . porque hay videos ajenos. Los originales y derivados ya existentes no se alteraron. Después de revisar, el usuario puede ejecutar git commit -m "Rediseña colecciones como exposición editorial". No se ejecuta automáticamente.

<details>
<summary>Registro histórico de la Etapa 7 (estado anterior; prevalece la documentación 7B de arriba)</summary>

# Catálogo de colecciones

Implementación local de la etapa 7, 16 de noviembre de 2026. Sin deploy, commit ni push.

## Fuentes y archivos

La única fuente autorizada es public/colecciones. La carpeta incorporada en este equipo figura en Git como public/Colecciones (C mayúscula); Windows resuelve ambas grafías. El procesador reconoce esa misma carpeta en sistemas sensibles a mayúsculas, sin moverla ni renombrarla. No utiliza public/images/originales ni inventario comercial. La carpeta fuente no se modifica: no se escriben originales, no se borran ni se recortan fotografías.

Salida: public/images/collections/<slug>/*.webp, incluyendo versiones -thumb.webp. Los nombres incluyen un ID de la ruta original y hash del contenido para evitar colisiones. No se eliminan archivos procesados, aunque dejen de referenciarse en el catálogo.

Manifiesto: src/data/collections-manifest.json. Configuración editorial: src/data/collections-settings.json. Modelos: src/types/collection.ts; acceso: src/data/collections.ts. El manifiesto contiene relación con originales, hashes, dimensiones originales y de salida, formato, orientación, peso, portadas, orden, publicación, advertencias y errores por archivo.

## Resultado

58 fotografías encontradas y procesadas, 18 colecciones, 116 WebP (58 ampliaciones y 58 miniaturas). Originales: 127.997.967 bytes (122,07 MiB). Salida incluyendo miniaturas: 11.255.280 bytes (10,73 MiB). Reducción: 91,21 %. La segunda ejecución reutilizó las 58 conversiones. Ningún archivo quedó sin clasificar y no hubo errores de conversión.

| Colección | Slug estable | Fotografías |
| --- | --- | ---: |
| Antaras | antaras | 2 |
| Aros y collares | aros-collares | 18 |
| Boca de loca | bocadeloca | 1 |
| Copas | copas | 2 |
| Derbake | derbake | 1 |
| Figura | figura | 6 |
| Hurna | hurna | 1 |
| Máscara | mascara | 1 |
| Obra | obra | 5 |
| Ojo de loca | ojodeloca | 3 |
| Pichuda | pichuda | 1 |
| Pinchuda | pinchuda | 1 |
| Tambor | tambor | 3 |
| Taza biblioteca | taza-biblioteca | 2 |
| Vasija silvadora | vasija-silvadora | 3 |
| Vasija silvadora peluca | vasijasilvadora-peluca | 5 |
| Vasija silvadora picolargo | vasijasilvadora-picolargo | 2 |
| Venus silbato | venus-silbato | 1 |

## Dudas y duplicados conservados

Pichuda y Pinchuda se conservan en grupos diferentes: confirmar si son nombres distintos o una variante ortográfica. Se conserva Hurna sin corregirlo a otro título. No hay archivos de Grabados, Paisajes ni una colección independiente llamada Obras: se publica el grupo Obra derivado de los nombres existentes. No se inventaron grupos por apariencia.

Dos pares de duplicados exactos, también verificados por píxeles: figura1.png / figura2.png y Obra 4.jpg / Vasija silvadora 1.jpg. Ambos archivos de cada par permanecen en el manifiesto y en sus grupos. No se deduplicaron ni fusionaron automáticamente.

Los nombres sin número (bocadeloca.png, hurna.png, mascara.png, vasijasilvadora_picolargo.png, venus_silbato.png) se conservan. El nombre sin número precede a las variantes numeradas. Los saltos de numeración no generan fotografías ficticias. Boca de loca, Ojo de loca y las separaciones de Vasija silvadora son ajustes de lectura configurados explícitamente, sin cambiar originales ni slugs. Los nombres artísticos no se traducen.

Advertencias del procesador:

- Pichuda y Pinchuda: posible variante ortografica; se mantienen como colecciones separadas.
- Hurna: grafia conservada del archivo; confirmar titulo artistico.
- bocadeloca.png: numeración alternativa, edición o nombre sin número; conservado para revisión.
- figura2.png: duplicado binario de figura1.png; ambos conservados.
- figura2.png: mismos píxeles que figura1.png; ambos conservados.
- hurna.png: numeración alternativa, edición o nombre sin número; conservado para revisión.
- mascara.png: numeración alternativa, edición o nombre sin número; conservado para revisión.
- Vasija silvadora 1.jpg: duplicado binario de Obra 4.jpg; ambos conservados.
- Vasija silvadora 1.jpg: mismos píxeles que Obra 4.jpg; ambos conservados.
- vasijasilvadora_picolargo.png: numeración alternativa, edición o nombre sin número; conservado para revisión.
- venus_silbato.png: numeración alternativa, edición o nombre sin número; conservado para revisión.

## Conversión técnica

Sharp, WebP calidad 88 y esfuerzo 6, orientación EXIF automática, conversión de perfil ICC a sRGB para consistencia web, proporciones intactas. Límite 2400 × 2400 para ampliaciones y 720 × 720 para miniaturas, ajuste inside sin ampliación. Sin filtros, retoques, generación, recortes ni cambios de las piezas. Se conservan las ediciones ya presentes en las fotografías. Revisar visualmente las primeras conversiones antes de publicar; la compresión con pérdida no permite garantizar identidad visual absoluta por medios automáticos.

Se reconocen JPG/JPEG/PNG/WEBP sin distinguir mayúsculas, espacios, guiones y guiones bajos. La numeración se ordena numéricamente, incluida la variante Obra 1_1. Los sufijos editada/mejorada/retocada/edited/enhanced/retouched se detectan como variantes y se conservan. Los duplicados binarios y de píxeles se informan. Las coincidencias parciales no fusionan grupos. Un original ilegible produce un error por archivo; si ya tenía un registro válido, se mantiene ese registro anterior y el comando finaliza con error. Si falta la fuente, se detiene sin sustituir el manifiesto.

## Mantenimiento

1. Agregar fotos solamente a public/colecciones (public/Colecciones en este checkout). Usar un nombre base inequívoco y número: antaras3.jpg. Para una nueva colección, usar una base nueva, por ejemplo grabados1.jpg.
2. Ejecutar npm.cmd run images:collections desde la raíz del proyecto.
3. Revisar advertencias, manifiesto y calidad visual. El hash evita convertir nuevamente entradas sin cambios; no borrar derivados antiguos sin una instrucción expresa.
4. Editar src/data/collections-settings.json para personalizar cada slug. Ejemplo:

```json
{
  "antaras": {
    "name": "Antaras",
    "order": 0,
    "published": true,
    "cover": "antaras2.png",
    "imageOrder": ["antaras2.png", "antaras1.png"]
  }
}
```

cover y imageOrder usan nombres originales exactos, incluida la extensión. published: false oculta la colección de portada, catálogo, rutas y sitemap. order define la prioridad. Los nombres no listados en imageOrder aparecen después, en orden natural. No editar manualmente el manifiesto generado: se regenera. Después de cambiar ajustes, volver a ejecutar images:collections y hacer build; reiniciar el servidor de producción para ver el catálogo regenerado.

## Páginas y componentes

Colecciones en portada reemplaza Piezas destacadas, con tres tarjetas como máximo y acceso al catálogo completo. CollectionGrid, CollectionsIndex y CollectionDetail están en src/components/collections/CollectionPages.tsx. Las tarjetas y galerías cargan miniaturas; el visor solicita una imagen grande al abrirse. next/image, tamaños responsive, proporciones reservadas y lazy loading. Fotografías completas con contain, sin recorte.

Rutas integradas en el catch-all existente: /colecciones y /colecciones/[slug]. También /en, /de, /fr, /ko y /zh-CN con los mismos slugs. El selector conserva la colección actual. Visor modal con controles anterior/siguiente, Escape, flechas de teclado, foco contenido por dialog nativo y restaurado al cerrar; gestos horizontales táctiles. Navbar y footer incluyen Inicio y Colecciones. Menú móvil con altura limitada y desplazamiento vertical.

Metadata localizada, canonical, hreflang, Open Graph y sitemap usan el sistema existente. Configurar NEXT_PUBLIC_SITE_URL con el dominio real antes de publicar: sin él, se conservan enlaces canonical/hreflang relativos, sitemap vacío según la política previa y se omiten imágenes sociales para no generar URLs falsas de localhost. Los alt usan solamente el nombre conocido de la colección.

Archivos existentes modificados: messages/{es,en,de,fr,ko,zh-CN}.json, package.json, src/views/Home.tsx, src/components/layout/{Navbar,Footer}.tsx, src/lib/i18n/routes.ts y src/app/[locale]/[[...path]]/page.tsx. No se cambiaron productos, carrito, checkout, Better Auth, base privada, experiencias, campañas, versiones mayores ni allowedDevOrigins. Dos videos sin seguimiento ya estaban presentes al comenzar; no forman parte de este trabajo.

## Validaciones y comprobación

- npm.cmd run lint
- npm.cmd run build (incluye auditoría i18n de 362 mensajes × 6 idiomas y 41 rutas × 6 idiomas).
- node scripts/test-collections.mjs: agrupación, numeración, variantes, hash de los 58 originales, decodificación de 116 WebP, proporciones, ausencia de ampliaciones y de colisiones.
- npm.cmd run test:admin: autenticación, autorización, CRUD, sesiones, exportaciones y persistencia, con base temporal aislada.
- node scripts/test-collections-browser.mjs con servidor en http://localhost:3105; usa Chrome local en modo headless con un perfil temporal. CHROME_PATH y TEST_BASE_URL permiten configurar entorno. No utiliza perfiles personales.

Para revisar: npm.cmd run dev; abrir /, /colecciones, /colecciones/aros-collares y /colecciones/antaras. Abrir una foto, recorrer con flechas, cerrar con Escape, probar gesto horizontal en móvil y cambiar los seis idiomas. Comprobar /tienda, agregar un producto al carrito, /talleres, /experiencias y /admin/login. No ejecutar dev y build sobre el mismo directorio .next simultáneamente.

## Git sugerido

Revisar git status --short y git diff --check. Incorporar explícitamente los archivos enumerados y public/images/collections; revisar por separado si se desean versionar los originales public/Colecciones. No usar git add . porque hay videos ajenos a este cambio. Después de la revisión, el usuario puede ejecutar git commit -m "Agrega catálogo artístico de colecciones". No se ejecutaron commit, push ni deploy.

## Inventario completo

### Antaras

- antaras1.png: png, 1024 × 1536, EXIF 1, 2114272 bytes → /images/collections/antaras/antaras1-a2d8cc1ebf56ec93-1298a229ec.webp (1024 × 1536, 149718 bytes) + miniatura (36110 bytes).
- antaras2.png: png, 1024 × 1536, EXIF 1, 2761325 bytes → /images/collections/antaras/antaras2-b784d5d635946176-78cd2db9a2.webp (1024 × 1536, 301722 bytes) + miniatura (61322 bytes).

### Aros y collares

- aros_collares1.jpg: jpeg, 2205 × 3838, EXIF 1, 2669916 bytes → /images/collections/aros-collares/aros-collares1-b281a39d1e68ce31-476d21a007.webp (1379 × 2400, 137992 bytes) + miniatura (27668 bytes).
- aros_collares2.jpg: jpeg, 2296 × 4080, EXIF 1, 2561399 bytes → /images/collections/aros-collares/aros-collares2-6878c1f3e1558f42-5bfae1eb21.webp (1351 × 2400, 100262 bytes) + miniatura (19202 bytes).
- aros_collares3.jpg: jpeg, 4080 × 2296, EXIF 6, 2792843 bytes → /images/collections/aros-collares/aros-collares3-3ec5c91f02c2571d-8c33d01955.webp (1351 × 2400, 74506 bytes) + miniatura (16296 bytes).
- aros_collares4.jpg: jpeg, 1869 × 3432, EXIF 1, 2743217 bytes → /images/collections/aros-collares/aros-collares4-b75a7310e6c9e614-987644ba0e.webp (1307 × 2400, 97410 bytes) + miniatura (19556 bytes).
- aros_collares5.jpg: jpeg, 1621 × 3120, EXIF 1, 2612603 bytes → /images/collections/aros-collares/aros-collares5-4afb0990cf5b2e17-a33b216ecc.webp (1247 × 2400, 95312 bytes) + miniatura (16926 bytes).
- aros_collares6.jpg: jpeg, 1885 × 3796, EXIF 1, 2534456 bytes → /images/collections/aros-collares/aros-collares6-2fae2d9caa3913f1-8ca94d1d06.webp (1192 × 2400, 127040 bytes) + miniatura (23822 bytes).
- aros_collares7.jpg: jpeg, 2296 × 4080, EXIF 1, 2627808 bytes → /images/collections/aros-collares/aros-collares7-0df12065c2b04843-0019701396.webp (1351 × 2400, 115352 bytes) + miniatura (21670 bytes).
- aros_collares8.jpg: jpeg, 2296 × 4080, EXIF 1, 1721398 bytes → /images/collections/aros-collares/aros-collares8-9887c6fbf9b56014-e0c6c7f822.webp (1351 × 2400, 200340 bytes) + miniatura (30924 bytes).
- aros_collares9.jpg: jpeg, 4080 × 2296, EXIF 6, 2530867 bytes → /images/collections/aros-collares/aros-collares9-2cf75f461f8e9165-552e61489c.webp (1351 × 2400, 119742 bytes) + miniatura (26274 bytes).
- aros_collares10.jpg: jpeg, 2046 × 3527, EXIF 1, 3010000 bytes → /images/collections/aros-collares/aros-collares10-d58421822dbe2a3c-83452ebea6.webp (1392 × 2400, 158168 bytes) + miniatura (29936 bytes).
- aros_collares11.jpg: jpeg, 1958 × 3829, EXIF 1, 3235461 bytes → /images/collections/aros-collares/aros-collares11-fcc2183c3b132112-4eb574c0d6.webp (1227 × 2400, 147748 bytes) + miniatura (25804 bytes).
- aros_collares12.jpg: jpeg, 1828 × 3047, EXIF 1, 2409637 bytes → /images/collections/aros-collares/aros-collares12-a5316f168e7ef4f0-d5ef5a5cce.webp (1440 × 2400, 116730 bytes) + miniatura (20574 bytes).
- aros_collares13.jpg: jpeg, 1531 × 2975, EXIF 1, 2654876 bytes → /images/collections/aros-collares/aros-collares13-abfa073db5913350-3119b0f7e2.webp (1235 × 2400, 88656 bytes) + miniatura (15984 bytes).
- aros_collares14.jpg: jpeg, 1979 × 3452, EXIF 1, 2333745 bytes → /images/collections/aros-collares/aros-collares14-c5e3599817eb8c39-a7e2fb834a.webp (1376 × 2400, 89510 bytes) + miniatura (18064 bytes).
- aros_collares15.jpg: jpeg, 1534 × 2934, EXIF 1, 2178022 bytes → /images/collections/aros-collares/aros-collares15-a9742d3927f65985-d934d3c86c.webp (1255 × 2400, 86708 bytes) + miniatura (15730 bytes).
- aros_collares16.jpg: jpeg, 2296 × 4080, EXIF 1, 2701800 bytes → /images/collections/aros-collares/aros-collares16-9f2646c3f8f5caed-392c122ec7.webp (1351 × 2400, 71138 bytes) + miniatura (13240 bytes).
- aros_collares17.jpg: jpeg, 1790 × 3133, EXIF 1, 2292632 bytes → /images/collections/aros-collares/aros-collares17-850c968a5c941e0e-fcb179f52e.webp (1371 × 2400, 99596 bytes) + miniatura (19236 bytes).
- aros_collares18.jpg: jpeg, 1814 × 3372, EXIF 1, 2396386 bytes → /images/collections/aros-collares/aros-collares18-f6707a4ab7c272c0-756c68367e.webp (1291 × 2400, 108052 bytes) + miniatura (19434 bytes).

### Boca de loca

- bocadeloca.png: png, 1024 × 1536, EXIF 1, 2064904 bytes → /images/collections/bocadeloca/bocadeloca-36425560110adf9d-65f77562b3.webp (1024 × 1536, 130298 bytes) + miniatura (26920 bytes).

### Copas

- Copas1.png: png, 1448 × 1086, EXIF 1, 2180884 bytes → /images/collections/copas/copas1-98ed0ed05de2bc83-39cb73cd80.webp (1448 × 1086, 174102 bytes) + miniatura (57708 bytes).
- Copas2.png: png, 1448 × 1086, EXIF 1, 2240644 bytes → /images/collections/copas/copas2-a69095df38b43b49-7f80235c71.webp (1448 × 1086, 187226 bytes) + miniatura (59814 bytes).

### Derbake

- derbake2.png: png, 1024 × 1536, EXIF 1, 2010276 bytes → /images/collections/derbake/derbake2-28b297738a01ceed-d3486af9a9.webp (1024 × 1536, 101898 bytes) + miniatura (25600 bytes).

### Figura

- figura1.png: png, 1024 × 1536, EXIF 1, 2088630 bytes → /images/collections/figura/figura1-1b93791c3a5d929e-083e485172.webp (1024 × 1536, 138284 bytes) + miniatura (27670 bytes).
- figura2.png: png, 1024 × 1536, EXIF 1, 2088630 bytes → /images/collections/figura/figura2-f96620db7170f67d-083e485172.webp (1024 × 1536, 138284 bytes) + miniatura (27670 bytes).
- figura3.png: png, 1024 × 1536, EXIF 1, 2520077 bytes → /images/collections/figura/figura3-3a04d3cce67b4c17-67a1146e16.webp (1024 × 1536, 204934 bytes) + miniatura (41100 bytes).
- figura4.png: png, 1024 × 1536, EXIF 1, 2182858 bytes → /images/collections/figura/figura4-3a8e560e27b43dd8-d142757ba8.webp (1024 × 1536, 135398 bytes) + miniatura (32244 bytes).
- figura5.png: png, 1024 × 1536, EXIF 1, 2116602 bytes → /images/collections/figura/figura5-98761e6838951fca-5001bd72c5.webp (1024 × 1536, 136652 bytes) + miniatura (29522 bytes).
- figura6.png: png, 2172 × 724, EXIF 1, 2074885 bytes → /images/collections/figura/figura6-fd3eb54d28c270ad-474b51e717.webp (2172 × 724, 202480 bytes) + miniatura (27334 bytes).

### Hurna

- hurna.png: png, 1024 × 1536, EXIF 1, 2057546 bytes → /images/collections/hurna/hurna-5c5dc350479b7344-2f28406b2d.webp (1024 × 1536, 132368 bytes) + miniatura (36636 bytes).

### Máscara

- mascara.png: png, 1024 × 1536, EXIF 1, 1925821 bytes → /images/collections/mascara/mascara-37434dbb9b15b76e-5a5f641ec2.webp (1024 × 1536, 66724 bytes) + miniatura (17390 bytes).

### Obra

- Obra 2.png: png, 1122 × 1402, EXIF 1, 2769725 bytes → /images/collections/obra/obra-2-5fcf64f2baa45434-be864cb568.webp (1122 × 1402, 307162 bytes) + miniatura (89526 bytes).
- Obra 3.png: png, 1122 × 1402, EXIF 1, 2677993 bytes → /images/collections/obra/obra-3-3811c4aba939aa2b-093319fd44.webp (1122 × 1402, 269402 bytes) + miniatura (72280 bytes).
- Obra 4.jpg: jpeg, 917 × 1305, EXIF 1, 135173 bytes → /images/collections/obra/obra-4-1c09a039b7c6b104-8ddfda2d5a.webp (917 × 1305, 142150 bytes) + miniatura (62704 bytes).
- Obra 5.png: png, 1448 × 1086, EXIF 1, 2298629 bytes → /images/collections/obra/obra-5-1ab9a6e89ade0e79-9130a5d84e.webp (1448 × 1086, 163034 bytes) + miniatura (37766 bytes).
- Obra 6.png: png, 1122 × 1402, EXIF 1, 2812182 bytes → /images/collections/obra/obra-6-76161bd3508a18a6-e391d132de.webp (1122 × 1402, 324160 bytes) + miniatura (91282 bytes).

### Ojo de loca

- ojodeloca1.png: png, 1024 × 1536, EXIF 1, 2090404 bytes → /images/collections/ojodeloca/ojodeloca1-d3f7922b06e74d12-a74275e0f0.webp (1024 × 1536, 127432 bytes) + miniatura (27660 bytes).
- ojodeloca2.png: png, 1024 × 1536, EXIF 1, 2025073 bytes → /images/collections/ojodeloca/ojodeloca2-6cf107a2e5a6b792-f402767ea0.webp (1024 × 1536, 109200 bytes) + miniatura (25052 bytes).
- ojodeloca3.png: png, 1024 × 1536, EXIF 1, 1919782 bytes → /images/collections/ojodeloca/ojodeloca3-dc8f3c4fadbdd612-4a5dbba892.webp (1024 × 1536, 90234 bytes) + miniatura (20486 bytes).

### Pichuda

- pichuda2.png: png, 1024 × 1536, EXIF 1, 2097174 bytes → /images/collections/pichuda/pichuda2-8369a57d74ba6b80-4df1da7f47.webp (1024 × 1536, 122916 bytes) + miniatura (26536 bytes).

### Pinchuda

- pinchuda1.png: png, 1024 × 1536, EXIF 1, 2036457 bytes → /images/collections/pinchuda/pinchuda1-57b06078c5875e06-bd2aa73a66.webp (1024 × 1536, 121878 bytes) + miniatura (25808 bytes).

### Tambor

- Tambor 1.png: png, 1122 × 1402, EXIF 1, 3052923 bytes → /images/collections/tambor/tambor-1-6983e2b7614bc0c8-912ec93f6b.webp (1122 × 1402, 362772 bytes) + miniatura (104176 bytes).
- Tambor 3.png: png, 1254 × 1254, EXIF 1, 3007879 bytes → /images/collections/tambor/tambor-3-71a7a12d71ca42a9-e3e35e456a.webp (1254 × 1254, 344980 bytes) + miniatura (122674 bytes).
- Tambor 4.png: png, 1448 × 1086, EXIF 1, 2411397 bytes → /images/collections/tambor/tambor-4-abd006278ffb00e5-0b7b6a4040.webp (1448 × 1086, 203486 bytes) + miniatura (54060 bytes).

### Taza biblioteca

- Taza biblioteca 1.png: png, 874 × 868, EXIF 1, 2008247 bytes → /images/collections/taza-biblioteca/taza-biblioteca-1-fee17cfb2b7edef3-9bd1e19d3a.webp (874 × 868, 153106 bytes) + miniatura (120932 bytes).
- Taza biblioteca 2.png: png, 1086 × 1448, EXIF 1, 2304798 bytes → /images/collections/taza-biblioteca/taza-biblioteca-2-909c770956ec9cea-4c15358be4.webp (1086 × 1448, 206160 bytes) + miniatura (68918 bytes).

### Vasija silvadora

- Vasija silvadora 1.jpg: jpeg, 917 × 1305, EXIF 1, 135173 bytes → /images/collections/vasija-silvadora/vasija-silvadora-1-efe1ec62a1e5a854-8ddfda2d5a.webp (917 × 1305, 142150 bytes) + miniatura (62704 bytes).
- Vasija silvadora 2.jpg: jpeg, 720 × 1600, EXIF 1, 117441 bytes → /images/collections/vasija-silvadora/vasija-silvadora-2-56dc00a2b7d831be-cd533b2f48.webp (720 × 1600, 114190 bytes) + miniatura (41782 bytes).
- Vasija silvadora 3.jpeg: jpeg, 1080 × 1080, EXIF 1, 120361 bytes → /images/collections/vasija-silvadora/vasija-silvadora-3-47fc309166b9aa59-e28eecf7a8.webp (1080 × 1080, 119722 bytes) + miniatura (74608 bytes).

### Vasija silvadora peluca

- vasijasilvadora_peluca1.png: png, 1024 × 1536, EXIF 1, 2202446 bytes → /images/collections/vasijasilvadora-peluca/vasijasilvadora-peluca1-b6cbf5f649ab6586-a20379a887.webp (1024 × 1536, 157874 bytes) + miniatura (48730 bytes).
- vasijasilvadora_peluca3.png: png, 1024 × 1536, EXIF 1, 2157590 bytes → /images/collections/vasijasilvadora-peluca/vasijasilvadora-peluca3-e6c31cabc3ea77a7-2605675eb5.webp (1024 × 1536, 151248 bytes) + miniatura (45204 bytes).
- vasijasilvadora_peluca4.png: png, 1024 × 1536, EXIF 1, 2279375 bytes → /images/collections/vasijasilvadora-peluca/vasijasilvadora-peluca4-416de53f5759f7e4-22cebcebb8.webp (1024 × 1536, 169876 bytes) + miniatura (49992 bytes).
- vasijasilvadora_peluca5.png: png, 1024 × 1536, EXIF 1, 2325485 bytes → /images/collections/vasijasilvadora-peluca/vasijasilvadora-peluca5-5775417d49fe7dba-bd418204cb.webp (1024 × 1536, 182214 bytes) + miniatura (51944 bytes).
- vasijasilvadora_peluca6.png: png, 1024 × 1536, EXIF 1, 2257478 bytes → /images/collections/vasijasilvadora-peluca/vasijasilvadora-peluca6-6dd552810db51413-d318458ef8.webp (1024 × 1536, 177848 bytes) + miniatura (50196 bytes).

### Vasija silvadora picolargo

- vasijasilvadora_picolargo.png: png, 1024 × 1536, EXIF 1, 2177368 bytes → /images/collections/vasijasilvadora-picolargo/vasijasilvadora-picolargo-dc15f778702c9535-692076d77f.webp (1024 × 1536, 139552 bytes) + miniatura (35520 bytes).
- vasijasilvadora_picolargo2.png: png, 1024 × 1536, EXIF 1, 2145772 bytes → /images/collections/vasijasilvadora-picolargo/vasijasilvadora-picolargo2-2c6de99ec7ad4901-e95264746f.webp (1024 × 1536, 138500 bytes) + miniatura (37754 bytes).

### Venus silbato

- venus_silbato.png: png, 1024 × 1536, EXIF 1, 1997222 bytes → /images/collections/venus-silbato/venus-silbato-13f6d35396fb2f08-bb05232169.webp (1024 × 1536, 117226 bytes) + miniatura (26784 bytes).

## Resultado final de las comprobaciones

Lint: aprobado sin errores ni advertencias. Build: aprobado, 250 páginas estáticas generadas, sin advertencias de metadataBase tras omitir imágenes sociales cuando no existe dominio configurado. Auditoría HTTP: 246 páginas localizadas aprobadas, además de metadatos, hreflang, rutas anteriores, 404, preferencias y parámetros UTM. Los 58 hashes originales y los 116 WebP fueron validados.

Navegador Chrome: catálogo y visor comprobados a 360, 768 y 1440 px; teclado, Escape, restauración del foco, menú móvil y ausencia de desbordamiento. Gesto horizontal comprobado mediante eventos táctiles simulados; conviene una revisión adicional en un teléfono físico. Selector de idioma conserva Aros y collares en los seis idiomas. Portada, tienda y agregar un producto al carrito aprobados, sin excepciones JavaScript. Captura móvil revisada visualmente: pieza completa, sin deformación ni recorte. Pruebas administrativas aisladas aprobadas. git diff --check sin errores.

Recomendaciones pendientes de decisión editorial: confirmar Hurna y la diferencia Pichuda/Pinchuda; decidir si los pares duplicados deben seguir apareciendo (actualmente ambos se conservan). Configurar el dominio público antes de cualquier futura publicación. No se requiere instalar dependencias nuevas.

</details>

## Validación final 7B

- images:collections: 58 encontradas, 58 reutilizadas, 17 grupos internos, 16 publicados; ninguna reconversión ni eliminación.
- Integridad: hashes de los 58 originales y decodificación de 116 WebP aprobados. Las 58 rutas, IDs, dimensiones y pesos coinciden con la línea base de Etapa 7.
- Lint: aprobado sin errores ni advertencias. Build: aprobado, con 238 páginas estáticas generadas.
- Auditoría: 440 mensajes en seis idiomas, 43 fichas, cobertura de las 40 fotos públicas y datos preparados para las 18 ocultas.
- HTTP: 234 páginas localizadas, siete redirecciones 308 con parámetros conservados, seis 404 de Aros y collares, descripciones y alt en seis idiomas. Sitemap sin duplicados, canonical, hreflang y portadas sociales probados con un dominio ficticio solo dentro del proceso de test.
- Navegador: 360, 390, 768 y 1440 px; visor, ficha opcional, teclado, foco, movimiento reducido, gesto táctil simulado y selector de seis idiomas aprobados. Portada, tienda y agregar al carrito aprobados; sin excepciones JavaScript.
- Administrador: autenticación, CRUD, campañas, XLSX, sesiones y persistencia aprobados con base temporal aislada.
- git diff --check: sin errores. Sin deploy, commit ni push.
