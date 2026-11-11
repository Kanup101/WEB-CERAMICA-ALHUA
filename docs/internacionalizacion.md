# Internacionalización integral — etapa 5B

## Alcance y auditoría inicial

Se revisaron rutas, componentes, metadata, configuración i18n, catálogos y carrito antes de migrar. Git estaba limpio. Solo existían `es` y `en` en la configuración y versiones inglesas aisladas de experiencias. Se leyeron las guías locales de Next 16.4.6 sobre proxy, layouts, parámetros dinámicos y generación estática.

Cobertura: home, tienda, diez productos completos, tres talleres, experiencia turística, contacto y FAQ, ambas rutas de biografía, carrito, checkout, newsletter, estados vacíos, atributos accesibles, WhatsApp, 404 y SEO. **352 mensajes por idioma**, sin servicios de traducción en tiempo real ni fallback silencioso al español. No se añadieron dependencias ni se modificaron Next, React o el lockfile.

## Arquitectura

Se evaluaron las guías oficiales de [next-intl para App Router](https://next-intl.dev/docs/getting-started/app-router) y [routing con proxy en Next 16](https://next-intl.dev/docs/routing/setup). Se eligió una ampliación local: este catálogo no necesita ICU ni gestión externa. React, APIs de Next e `Intl.NumberFormat` cubren el alcance sin dependencias nuevas.

- `messages/{es,en,de,fr,ko,zh-CN}.json`: única fuente de textos localizados. Las claves estables son los textos originales en español, siguiendo un enfoque similar a gettext. Para corregir redacción, modificar el valor, no renombrar la clave.
- `src/lib/i18n/config.ts`: listado tipado de idiomas, nombres nativos, rutas y formatos monetarios.
- `src/lib/i18n/messages.ts`: contrato `MessageKey`, diccionarios y `getTranslator(locale)` para servidor y datos. Una traducción inexistente provoca un error; nunca muestra otro idioma como sustituto.
- `src/lib/i18n/provider.tsx`: proveedor y `useI18n()`, con `t`, `locale` y `money` para cliente.
- `src/lib/i18n/Link.tsx`: enlaces internos localizados; mantiene URLs externas, consultas y fragmentos.
- `src/proxy.ts`: español público sin prefijo, reescritura interna a `/es` y preferencia por cookie.
- `src/app/[locale]/layout.tsx`: `html lang`, proveedor i18n y `CartProvider` existente.
- `src/app/[locale]/[[...path]]/page.tsx`: valida ubicaciones, genera metadata y selecciona vistas. Se pregeneran **22 ubicaciones × 6 idiomas = 132 páginas**. Un slug desconocido devuelve 404.
- `src/views/`: vistas compartidas. Los componentes cliente se prerenderizan en HTML; metadata y selección de rutas se resuelven en servidor.
- `src/lib/i18n/routes.ts`: ubicaciones públicas, metadata y dominio.

Los productos y talleres separan `content`, con referencias tipadas a mensajes, de sus datos invariantes. Las experiencias usan referencias tipadas para subtítulo, descripción, ubicación, información práctica, inclusiones y alt. Cada entidad mantiene un único ID, slug, precio, stock/cupo e imágenes. Los getters producen su vista localizada.

## Idiomas y selector

| Código | Nombre nativo | Inicio |
| --- | --- | --- |
| es | Español | `/` |
| en | English | `/en` |
| de | Deutsch | `/de` |
| fr | Français | `/fr` |
| ko | 한국어 | `/ko` |
| zh-CN | 简体中文 | `/zh-CN` |

`LanguageSwitcher.tsx` está en escritorio y menú móvil, con etiqueta accesible y selector nativo operable por teclado. Conserva página, slug, query y hash. Guarda `yanina-locale` en cookie durante un año y en localStorage; el servidor usa la cookie. Si localStorage falla, la cookie permite mantener la elección. La navegación de documento actualiza también `html lang`.

Sin elección previa se usa español. Un prefijo explícito determina el idioma de esa visita. Una URL sin prefijo, con preferencia extranjera guardada, redirige a la misma ubicación localizada. No se usan geolocalización ni cambios automáticos por el idioma del navegador. `/es/...` redirige al español sin prefijo y guarda esa elección.

## Rutas anteriores

Siguen accesibles `/`, `/tienda`, `/tienda/[slug]`, `/talleres`, `/talleres/[slug]`, `/experiencias`, `/experiencias/barro-mates-y-encuentros`, `/sobre-yanina`, `/sobre-alhua`, `/contacto` y `/checkout`. Todas tienen los cinco prefijos extranjeros. Las URLs inglesas de experiencias se conservan exactamente. Los archivos antiguos se reemplazaron por vistas y una entrada compartida, con copias previas fuera del código.

`/sobre-alhua` conserva su contenido y canonicaliza a `/sobre-yanina`. Checkout no se indexa. Ningún slug de catálogo cambió.

## Agregar traducciones

1. Agregar una clave con valor español a `messages/es.json` y la misma clave traducida a los otros cinco JSON.
2. Mantener los nombres de variables entre llaves, por ejemplo `{count}`.
3. En cliente usar `const { t } = useI18n()`; en servidor `getTranslator(locale)`. Las claves tienen tipado estricto.
4. Usar frases completas con variables para nombres, importes y cantidades; evitar concatenar fragmentos que impongan el orden del español.
5. Navegar con `Link` de `@/lib/i18n/Link` o `ButtonLink`.
6. Ejecutar `npm.cmd run test:i18n`, lint y build. El prebuild ejecuta la auditoría automáticamente.

La auditoría comprueba paridad exacta, variables, valores vacíos, marcadores simulados, texto JSX fijo y atributos visibles sin localizar. Las coincidencias legítimas entre idiomas, como «Total», están identificadas. Las excepciones de identidad son nombres artísticos, Yanina Cardozo, WhatsApp, datos de contacto y símbolos.

### Productos

Agregar un registro a `productRecords` en `src/data/products.ts`. Conservar nombre artístico, ID, slug, precio, stock e imágenes como invariantes. `content` contiene claves para descripción, concepto, materiales, medidas, técnica y cuidados. Agregarlas a los seis JSON. Una categoría nueva requiere ampliar `ProductCategory`, `productCategories` y sus traducciones. Consumir `getProducts(locale)` o `getProductBySlug(slug, locale)`; no mostrar directamente las referencias de `content`.

### Talleres

Agregar un registro a `workshopRecords`. Precios, cupos, imágenes y slug son compartidos. Título comercial, subtítulo, descripción, duración, nivel, modalidad, materiales, inclusiones y presentación de video van en `content`, con las claves completas en los seis JSON. Consumir `getWorkshops(locale)` o `getWorkshopBySlug`.

### Experiencias

Agregar un registro a `experienceRecords`. Conservar título artístico e identidad compartidos. Textos, ubicación, información práctica, inclusiones, alt y nombres de idiomas de atención confirmados usan `MessageKey`. Consumir `getExperiences(locale)` o `getExperienceBySlug`. No rellenar datos desconocidos para completar una traducción.

**Barro, mates y encuentros mantiene USD 35 por persona.** Siguen pendientes duración, punto de encuentro, cupos, idiomas de atención, fechas, condiciones, entrega de piezas, fotos específicas y video. La traducción de la web no confirma que la actividad se imparta en esos seis idiomas.

### Otro idioma

Ampliar `locales`, `localeNames`, `numberLocales`, el registro de diccionarios, el código Open Graph y las pruebas. Crear un JSON completo. Routing, selector, pregeneración, alternativos y sitemap derivan del listado compartido; no duplicar páginas.

## Carrito, importes y WhatsApp

`src/contexts/CartContext.tsx` y la clave **`alhua-cart` permanecen sin cambios**. Se verifica en navegador que el mismo carrito persista entre idiomas. Sus categorías y avisos se presentan en el idioma actual; los nombres artísticos no se traducen. El drawer usa un portal al body para cubrir el viewport, evitando el recorte causado por el filtro del encabezado. Solo cambia su presentación.

`Intl.NumberFormat` aplica formato regional y código de moneda explícito, sin convertir importes: productos en ARS y experiencia en USD.

`src/lib/contact.ts` genera consultas general, de producto, taller, compra y experiencia en los seis idiomas. Mantiene **5493874669134**, nombres artísticos y precios. Se comprobaron los enlaces decodificados; no se enviaron mensajes ni se incorporaron pagos o reservas confirmadas.

El formulario de contacto conserva el envío deshabilitado y su aviso traducido. La newsletter tampoco guarda suscripciones; el aviso y la validación local son explícitos y traducidos, sin prometer registros inexistentes.

## SEO y dominio

Títulos, descripciones y Open Graph localizados; detalles de producto/taller usan sus datos traducidos. `html lang` correcto y enlaces a las seis variantes con `hreflang`. Los canónicos excluyen UTM.

Configurar **`NEXT_PUBLIC_SITE_URL`** con el origen real al confirmar el dominio. Sin esa variable, los canónicos y alternativos son relativos y el sitemap está vacío; no se inventa host de producción ni se usa localhost como canonical. Con la variable, metadata y sitemap generan URLs absolutas en los seis idiomas. No se realizó deploy.

## Tipografía y responsive

Se mantiene la serif de marca con fuentes de respaldo del sistema para coreano y chino, sin descargas. Los botones permiten varias líneas y el menú cambia a móvil antes de comprimir la navegación. Se revisaron capturas de alemán, coreano y chino para comprobar lectura y caracteres nativos. Los placeholders de video permiten traducciones largas.

## Pruebas

- `npm.cmd run test:i18n`: 352 claves × 6 idiomas, variables, catálogos, formatos, WhatsApp, navegación y auditoría de JSX/atributos.
- `npm.cmd run test:i18n:http`: con servidor en `http://localhost:3105`, verifica las 132 páginas, enlaces internos, lang, hreflang, metadata, rutas previas, 404, UTM y preferencia. `TEST_BASE_URL` cambia el origen de prueba.
- `npm.cmd run test:i18n:browser`: Chrome aislado mediante depuración local, sin paquetes adicionales. Requiere Chrome con `--headless=new --remote-debugging-port=9225 --user-data-dir=<carpeta-temporal-nueva>` y pestaña `about:blank`. Puede configurarse `CHROME_DEBUG_URL`. No usar el perfil personal.
- `npm.cmd run lint` y `npm.cmd run build`: comprobaciones obligatorias.

Navegador: compra/consulta en seis idiomas, persistencia, selector, query/hash, formularios, menú móvil y 22 rutas por idioma a **375, 768 y 1440 px: 396 comprobaciones responsive**. También se verifica que el carrito cubra el viewport. Estas pruebas no envían compras ni confirman reservas.

Prueba manual: `npm.cmd run dev`, visitar `http://localhost:3000/`, `/en`, `/de`, `/fr`, `/ko` y `/zh-CN`; agregar una pieza, cambiar idioma y continuar a WhatsApp desde checkout. Probar taller, experiencia y slug inexistente. La preferencia puede redirigir la raíz: elegir Español o borrar `yanina-locale` para volver al idioma predeterminado.

## Resultado de validación de esta entrega

Lint y build completados correctamente en Next 16.4.6. Auditoría: 352 mensajes completos por idioma, sin textos JSX o atributos públicos sin localizar. HTTP: 132 páginas, enlaces internos y seis 404 correctos. Chrome: recorridos de compra y consulta, persistencia y 396 verificaciones responsive correctas, sin excepciones de ejecución. Carrito móvil comprobado visualmente a 375 × 1000 px, cubriendo todo el viewport. Capturas revisadas de alemán, francés, coreano y chino.

Se compararon con Git todos los campos originales de los diez productos y tres talleres: permanecen iguales en su vista española. Carrito, imágenes y lockfile no presentan cambios funcionales o de datos; el contexto del carrito permanece intacto. También se probó el SEO con un origen ficticio usado exclusivamente en el test: genera 120 entradas de sitemap (excluyendo checkout y la biografía duplicada). Sin origen configurado no publica URLs inventadas.

## Pendientes y límites

No quedan traducciones sin redactar en el alcance actual. Se recomienda revisión editorial con hablantes nativos antes del lanzamiento internacional, especialmente de conceptos artísticos, terminología cerámica, mate y textos coreanos/chinos. Es revisión de calidad sobre traducciones existentes, no contenido simulado ni falta de cobertura. No se añadieron biografías, tradiciones ni condiciones comerciales nuevas.

Quedan el dominio real para SEO absoluto y los datos comerciales no confirmados de la experiencia. Formularios, pagos y reservas mantienen las limitaciones funcionales anteriores. Sin CMS, panel, autenticación, deploy, commit ni push.
