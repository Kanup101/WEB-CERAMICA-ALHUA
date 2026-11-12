# Panel privado de difusión turística — etapa 6A

## Alcance

Primera versión operativa para gestionar contactos comerciales legítimos de alojamientos, seguimientos y borradores de difusión. El panel está en español; la web pública mantiene sus seis idiomas. No se importan hoteles de internet ni se precargan contactos. La experiencia **Barro, mates y encuentros** conserva **USD 35 por persona**.

No hay envíos de correo, Gmail, SMTP, proveedores de marketing, scraping, pagos ni seguimiento de aperturas. Registrar una comunicación o preparar un borrador no significa que se haya enviado un mensaje.

## Arquitectura y rutas

| Ruta | Función |
| --- | --- |
| `/admin` | Acceso privado; redirige al resumen o al login |
| `/admin/login` | Inicio de sesión real |
| `/admin/difusion` | Indicadores y seguimientos |
| `/admin/difusion/alojamientos` | Listado, búsqueda, filtros, paginación, CSV |
| `/admin/difusion/alojamientos/nuevo` | Alta de alojamiento |
| `/admin/difusion/alojamientos/[id]` | Consulta, edición, historial, comunicaciones y baja |
| `/admin/difusion/campanas` | Creación y edición de borradores |

El layout administrativo es independiente del layout público. No hay enlaces al panel en Navbar ni Footer públicos. `src/proxy.ts` excluye `/admin` de las redirecciones de idioma y agrega `noindex`/`no-store`; **no se usa como barrera única de seguridad**.

Los Route Handlers en `/api/admin/[[...path]]` autentican cada petición. `src/lib/admin/repository.ts` vuelve a verificar sesión y permiso administrativo en cada operación, incluso las lecturas, exportaciones y vistas previas. Las páginas privadas también verifican la sesión en servidor antes de renderizar. El cliente no recibe contactos antes de autenticarse.

`AdminPanel.tsx` contiene las pantallas; `models.ts` define contratos y estados; `validation.ts` contiene los esquemas Zod; `csv.ts` maneja CSV. Base de datos y autenticación no se importan en componentes cliente.

## Dependencias y runtime

- Next.js **16.4.6** y React conservan sus versiones.
- **Better Auth 1.7.21**: autenticación y gestión de sesiones mantenida, con integración oficial para Next. Documentación consultada: [SQLite](https://better-auth.com/docs/adapters/sqlite), [Next](https://better-auth.com/docs/integrations/next), [cookies](https://better-auth.com/docs/concepts/cookies) y [rate limiting](https://better-auth.com/docs/concepts/rate-limit).
- **Zod 4.6.7**: validación del lado del servidor.
- **Node.js 24.16 o posterior**: SQLite integrado (`node:sqlite`), probado en Windows; no requiere compilar un driver nativo adicional. La documentación de Better Auth identifica este driver como Release Candidate en Node 24.

Las versiones de las dependencias nuevas quedan fijadas para reproducir el esquema probado. Actualizaciones de Better Auth deben revisar su esquema y crear migraciones nuevas, sin editar migraciones ya aplicadas.

## Instalación local y primer administrador

1. Usar Node 24.16+ y ejecutar `npm.cmd install` o `npm.cmd ci` con el lockfile.
2. **Si no existe `.env.local` ni hay un secreto configurado**, ejecutar:

   ```powershell
   npm.cmd run admin:create
   ```

   El comando crea `.env.local` con un secreto criptográficamente aleatorio que no imprime, configura SQLite local, aplica migraciones y solicita nombre, correo y contraseña. La contraseña se introduce dos veces **sin eco**, nunca como argumento del comando. No existe contraseña predeterminada.

3. Si ya hay un `.env.local`, el comando no lo sobrescribe. Completar las variables indicadas en `.env.example`: `BETTER_AUTH_SECRET` aleatorio de al menos 32 caracteres y `BETTER_AUTH_URL` con el origen exacto de acceso. La contraseña debe tener entre 14 y 128 caracteres. Para generar un secreto local, puede usarse `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"` en una terminal privada y guardarlo en `.env.local`; no compartirlo ni subirlo a Git.
4. Reiniciar Next para que lea el archivo de entorno:

   ```powershell
   npm.cmd run dev
   ```

5. Abrir **`http://localhost:3000/admin/login`** y usar la cuenta creada. `admin:create` también permite crear administradores adicionales desde una terminal de confianza; no hay registro público ni API de creación de usuarios.

Para automatización controlada, `admin:create --stdin` acepta un objeto JSON por stdin con nombre, correo y contraseña. No pasar credenciales en argumentos, repositorios, registros o variables `NEXT_PUBLIC_`. Las pruebas usan esta modalidad con credenciales aleatorias y una base temporal, nunca la base operativa.

### Variables

| Variable | Uso |
| --- | --- |
| `BETTER_AUTH_SECRET` | Secreto privado de autenticación; obligatorio, sin valor por defecto |
| `BETTER_AUTH_URL` | Origen exacto del panel, incluido puerto local; obligatorio |
| `ADMIN_DATABASE_PATH` | Archivo SQLite; por defecto `.data/admin.sqlite` |
| `NEXT_PUBLIC_SITE_URL` | Solo dominio público confirmado, opcional; no es una credencial |
| `NEXT_DIST_DIR` | Directorio de build alternativo usado por el servidor aislado de pruebas |

El origen de autenticación tiene que coincidir con el usado en el navegador. Para probar el administrador desde un celular en LAN, configurar explícitamente ese origen en desarrollo y reiniciar; no mezclar `localhost` y la IP. La autorización de recursos de desarrollo mediante `allowedDevOrigins` se conserva. En producción, el administrador exige un origen **HTTPS**.

## Persistencia y migraciones

SQLite guarda los datos entre reinicios en disco. Se habilitan claves foráneas, WAL y espera de bloqueos de cinco segundos. Las transacciones cubren escrituras e historial; el campo `version` evita sobrescribir silenciosamente una edición concurrente.

- `migrations/001_auth.sql`: usuarios, cuentas con hash, sesiones, verificaciones, limitador persistente y permisos administrativos.
- `migrations/002_diffusion.sql`: alojamientos, historial, comunicaciones y campañas, con índices y restricciones de integridad.
- `schema_migrations`: registra nombre, checksum y fecha de cada migración.

Para actualizar una instalación:

```powershell
npm.cmd run admin:migrate
```

Las migraciones aplicadas son inmutables. Si cambia un checksum se aborta. Antes de nuevas migraciones sobre una instalación ya versionada se crea un respaldo consistente mediante la API de backup SQLite, junto al archivo de base de datos. No se hicieron migraciones destructivas ni se modificó una base administrativa preexistente.

`.data/`, bases SQLite, archivos WAL/SHM, respaldos y `.env*` están fuera de Git; `.env.example` está expresamente permitido. No guardar la base en `public`: el código rechaza esa configuración. Restringir permisos de archivos y copias al usuario del servicio; en Windows revisar ACL NTFS, porque los modos Unix no sustituyen sus permisos.

El panel no ejecuta migraciones en cada petición. La instalación exige el procedimiento anterior. Sin secreto o esquema válido, falla de forma cerrada y no entrega contactos.

## Autenticación y seguridad

Better Auth gestiona hash de contraseña (scrypt por defecto), tokens, cookies y revocación. La aplicación no implementa su propio cifrado ni usa localStorage para autenticar.

- Cookies HttpOnly, SameSite=Lax y Secure con HTTPS; en producción se exige HTTPS.
- Sesiones guardadas en SQLite, duración de ocho horas con actualización por actividad; sin caché de sesión en cookie.
- Permiso adicional en `admin_users`, verificado en cada operación. Una sesión válida sin ese permiso recibe 403.
- Registro público deshabilitado; el handler solo expone login, logout y lectura de la propia sesión. No expone reset por email ni servicios de correo.
- Limitador activo también en desarrollo, persistido en SQLite: cinco intentos de login por quince minutos. En la conexión directa todos comparten el contador, evitando confiar en `X-Forwarded-For` falsificable. Para una infraestructura con proxy, definir una política de IP confiable antes de cambiar este comportamiento.
- Mutaciones con validación estricta de Origin, rechazo de `Sec-Fetch-Site: cross-site`, Content-Type JSON y tamaño máximo. Better Auth también valida su origen de confianza.
- Validación Zod, consultas SQL parametrizadas, UUID de servidor y estados enumerados.
- Texto de usuarios renderizado como texto, sin HTML arbitrario; URLs limitadas a HTTP/HTTPS.
- Datos administrativos sin caché y con `noindex`; no aparecen en el sitemap ni en los enlaces públicos.
- Errores operativos genéricos: no se devuelven consultas SQL, rutas de archivos ni secretos al navegador.

El despliegue debe mantener Node y dependencias al día y ofrecer TLS. No se habilitó MFA en esta etapa; puede incorporarse con la biblioteca en una etapa posterior. La recuperación de acceso se realiza desde una terminal de confianza creando otra cuenta administrativa; no se implementó recuperación por correo.

## Alojamientos y estados

La ficha contiene identificación, tipo, ciudad, dirección/sitio opcionales, email comercial único sin distinguir mayúsculas, teléfono/WhatsApp opcionales, idioma, fuente y URL, fecha/verificación del correo, estado, notas, próxima acción, seguimiento y fechas del registro. Una persona de contacto opcional exige una razón explícita para conservar ese dato. Un correo marcado como verificado exige fecha; el panel **no realiza verificación SMTP automática**.

Estados: Sin contactar, Contacto preparado, Contactado, Respuesta recibida, Interesado, Colaboración acordada, Sin interés y No contactar. Se registran altas, campos modificados, transiciones de estado y comunicaciones con actor y fecha. Los indicadores derivan de estados actuales: pendientes agrupa Sin contactar/Preparado; realizados agrupa estados desde Contactado hasta Sin interés; respuestas agrupa Respuesta/Interesado/Acuerdo/Sin interés. No son estadísticas de envío automático.

**No contactar** se excluye siempre de las listas de difusión y los seguimientos. La eliminación definitiva requiere escribir el email y elimina la ficha con su historial. Para conservar una solicitud de baja, usar No contactar en lugar de borrar la ficha.

## Comunicaciones

Registro manual de fecha, canal, tipo, resumen, resultado y próximo seguimiento, con fecha de creación propia. Canales: email, WhatsApp, teléfono, presencial y otro. No se envía nada ni se cambia automáticamente el estado a Contactado. El administrador debe registrar únicamente hechos que hayan ocurrido.

## Campañas

El botón **Crear borradores iniciales ES/EN** guarda dos borradores reales editables de **Barro, mates y encuentros | Difusión turística**. Es explícito e idempotente: no sobrescribe borradores existentes. No se precargan contactos ni se afirma que se haya enviado una campaña.

Cada borrador tiene objetivo, idioma, asunto, texto, experiencia asociada, estado (Borrador/Lista para revisión/Archivada), fechas y versión. Hay un borrador por experiencia e idioma. El formulario admite los seis idiomas, con redacción manual para los cuatro no incluidos inicialmente. Cada ficha muestra un enlace a la experiencia en su idioma; sin dominio confirmado es relativo, y con `NEXT_PUBLIC_SITE_URL` es absoluto. Antes de un futuro envío, incorporar el enlace en el contenido final revisado.

Los candidatos se calculan en el servidor: correo marcado como verificado, idioma coincidente y estado distinto de No contactar y Sin interés. Esto prepara campañas supervisadas, no autoriza ni ejecuta envíos.

## Exportación Excel y CSV

- **Excel recomendado:** los botones XLSX generan un libro OOXML real, independiente del separador regional. Teléfonos, WhatsApp, fechas e identificadores se guardan como texto explícito, preservando prefijos, ceros y valores originales. Los encabezados y estados se muestran en español; las fechas conservan ISO y los timestamps indican UTC. Las celdas no contienen fórmulas ni enlaces activos.
- **Compatibilidad CSV:** se mantienen las URLs anteriores, UTF-8 con BOM, coma, CRLF y plantilla de importación. Para abrir CSV en Excel argentino hay que importar con separador coma y columnas de teléfono como Texto; la descarga XLSX evita esos pasos. Ver [diagnóstico y pruebas de exportación](exportacion-alojamientos.md).

- **Difusión:** exportación de contactos elegibles; excluye No contactar, Sin interés y emails sin verificar.
- **Gestión completa:** exportación administrativa de todos los registros, incluyendo estados, ID y fechas. El nombre del archivo indica que **no es una lista de envío**.
- **Plantilla:** encabezados para importar, sin contactos ficticios.
- **Importación:** UTF-8, coma como separador, comillas CSV, máximo 500 filas/250 KB. Vista previa, errores por fila, confirmación explícita y resumen de aceptados/rechazados. La validación y los duplicados se revisan de nuevo bajo transacción al confirmar. Nunca sobrescribe registros existentes.
- La fuente es obligatoria. Usar datos comerciales pertinentes obtenidos legítimamente.
- Los CSV exportados neutralizan celdas que podrían interpretarse como fórmulas en hojas de cálculo. La exportación de gestión con metadatos no es la plantilla de importación.

## Pruebas

```powershell
npm.cmd run test:admin
npm.cmd run lint
npm.cmd run build
```

`test:admin` crea una base y credenciales aleatorias temporales, provisiona un administrador, inicia un servidor aislado en `http://localhost:3120` y realiza peticiones reales. No toca la base operativa ni modifica los carritos del usuario. Comprueba:

- Acceso anónimo denegado a todas las páginas privadas y endpoints de datos/exportación.
- Cookies HttpOnly/SameSite y Secure con configuración HTTPS de producción.
- Registro público bloqueado, origen ajeno rechazado y sesión sin permiso administrativo denegada.
- Login/logout, revocación y limitación de intentos reiterados.
- Alta, edición, duplicados, validación, búsquedas, filtros, paginación y bajas.
- Historial, comunicaciones, concurrencia y exclusión de No contactar.
- Borradores, importación con vista previa/confirmación y ambas exportaciones.
- Datos y sesiones tras reiniciar el servidor; páginas públicas de los seis idiomas.

Con Chrome aislado en `about:blank` y depuración local en puerto 9225, `node scripts/test-admin.mjs --browser` agrega pruebas de interfaz: login, creación de contacto y logout mediante entrada real de ratón/teclado; cinco pantallas a 360, 768 y 1440 px y ausencia de excepciones. No usar el perfil personal de Chrome. Los directorios temporales se verifican antes de su limpieza.

Las validaciones de esta entrega pasaron. También pasó la auditoría de los 352 mensajes públicos por idioma. `AGENTS.md` fue actualizado automáticamente por Next al iniciar el servidor de pruebas; no se cambió la regla de leer su documentación local.

## Despliegue y evolución

Para esta implementación se necesita un proceso Node persistente, HTTPS, almacenamiento local/volumen persistente, permisos restringidos, copias de seguridad supervisadas y un único escritor SQLite. **No asumir persistencia del disco de una función serverless** ni compartir el archivo entre máquinas. Mantener base y respaldos fuera del bundle y de directorios públicos. Ejecutar migraciones antes de iniciar la nueva versión y probar restauración.

Una migración a PostgreSQL debe reemplazar el adaptador en `database.mjs`, conectar Better Auth a su dialecto PostgreSQL, convertir placeholders/collations y crear nuevas migraciones para claves, índices y fechas. Las consultas están concentradas en el repositorio, y la interfaz consume contratos HTTP independientes de SQLite. No se implementa PostgreSQL ni un ORM adicional en esta etapa.

Pendientes deliberados: proveedor de email, envíos supervisados, bajas externas verificables, segmentación avanzada, MFA y políticas de conservación/revisión editorial. Antes de esas integraciones, revisar las obligaciones aplicables y el proceso de bajas. No se realizó deploy, commit ni push.

La auditoría npm no detectó alertas de producción en las dependencias nuevas. Informó siete alertas moderadas en herramientas transitivas de lint (cadena typescript-eslint/minimatch); no se ejecutó una actualización general que pudiera cambiar Next o React.
