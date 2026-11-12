# Exportación de alojamientos compatible con Excel

## Diagnóstico

La implementación anterior descargaba **CSV**, no XLSX: extensión `.csv`, MIME `text/csv`, encabezados técnicos y columnas separadas por coma. Ya utilizaba UTF-8 con BOM (`EF BB BF`), CRLF y comillas escapadas; no se encontró un fallo de codificación en el generador.

Se comprobó que la configuración regional de Windows del entorno usa **`;` como separador de listas**, `,` decimal y `dd/MM/yyyy` para fechas. Al abrir un CSV con coma por doble clic, Excel puede colocar el contenido en una columna según esa configuración. Además, CSV no conserva tipos de celda: aunque un teléfono esté entre comillas, Excel puede interpretarlo como número, quitar ceros o mostrar notación científica. Cambiar solo el separador no resuelve ese segundo problema.

Referencias de Microsoft: [importación y separadores regionales](https://support.microsoft.com/en-us/excel/get-started/import-or-export-text-txt-or-csv-files), [CSV UTF-8 con BOM](https://support.microsoft.com/en-gb/excel/opening-csv-utf-8-files-correctly-in-excel).

## Corrección

Se agregó una descarga **XLSX real** mediante `write-excel-file` 4.1.1, solo en servidor. No se renombra un CSV: es un ZIP OOXML con workbook, hoja, estilos y cadenas Unicode. Se evaluó ExcelJS y se descartó por su mayor árbol de dependencias y las alertas que introducía; no forma parte de la implementación final.

- `Descargar Excel (.xlsx)`: contactos elegibles, con la misma autorización y exclusiones existentes.
- Gestión completa en Excel: incluye todos los contactos, incluso No contactar, para administración; su nombre indica que no es una lista para envíos.
- Todos los datos son celdas de texto explícitas con formato `@`. Se conservan `0387…`, `+549…`, números largos, nombres, correos, notas, comas, punto y coma, comillas y saltos de línea.
- Fechas de verificación/seguimiento: valor ISO `AAAA-MM-DD`, sin reinterpretación regional. Creación/actualización: timestamp ISO original en UTC, identificado en el encabezado. No se convierten husos horarios ni se alteran los valores guardados.
- Encabezados legibles en español, orden estable, anchos de columna, ajuste de texto y primera fila inmovilizada.
- Cadenas que empiezan por `=`, `+`, `-`, `@`, tabulaciones o saltos de línea permanecen como texto. No se usan objetos fórmula ni expresiones del tipo `="teléfono"`; no se añaden enlaces activos.
- MIME `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, nombre `.xlsx` y respuesta privada sin caché.

Rutas nuevas por parámetro, sin romper las anteriores:

```text
/api/admin/exportar?format=xlsx
/api/admin/exportar?scope=gestion&format=xlsx
```

Los CSV anteriores y `/api/admin/plantilla` mantienen su contrato: separador coma, BOM, encabezados técnicos y protección contra fórmulas mediante apóstrofo. La importación CSV no cambió. Ese formato sigue destinado al intercambio; XLSX es la opción para abrir directamente en Excel sin perder ceros.

## Pruebas

```powershell
npm.cmd run test:export
npm.cmd run test:admin
npm.cmd run lint
npm.cmd run build
```

La prueba del generador abre el ZIP con una biblioteca independiente, revisa sus XML y cadenas compartidas y comprueba:

- Estructura OOXML auténtica y ausencia de elementos fórmula, macros o relaciones externas.
- Las 19 columnas de difusión y las 22 de gestión, incluidos encabezados y orden.
- Unicode, tildes, ñ, coreano/chino, caracteres XML, notas con separadores/comillas y múltiples líneas.
- Teléfonos con cero inicial y `+`, números de más de 15 dígitos y ataques de fórmula como texto.
- Valores de fechas, campos vacíos sin desplazamientos y libro vacío con encabezados.
- CSV con BOM correcto, escapado de fórmulas e importación CSV existente.

La prueba de integración descarga bytes desde la API autenticada y verifica MIME, extensión, contenido, autorización, No contactar excluido de elegibles e incluido solo en gestión completa. Utiliza únicamente una base de datos y credenciales temporales. No modifica contactos reales.

## Comprobación manual en Microsoft Excel

1. Si Next estaba ejecutándose antes de instalar las dependencias, reiniciarlo con `npm.cmd run dev`.
2. Entrar al panel y abrir **Alojamientos**.
3. Para ver todos los registros, usar **gestión completa → Excel (.xlsx)**. La descarga de elegibles contiene solo los correos verificados que cumplen los estados permitidos; puede tener únicamente encabezados si no hay candidatos.
4. Abrir el archivo `.xlsx` directamente en Excel. No necesita elegir separador ni cambiar la configuración regional.
5. Confirmar columnas separadas, encabezados en español y caracteres especiales legibles. Seleccionar Teléfono/WhatsApp y comprobar en la barra de fórmulas que siguen los ceros y el `+`, sin apóstrofos añadidos ni notación científica.
6. Verificar notas en varias líneas y fechas ISO. Para notas muy largas, ampliar la fila o usar la barra de fórmulas para leer el texto completo.
7. Si se usa el CSV por compatibilidad, abrir desde **Datos → Desde texto/CSV**, elegir UTF-8/65001 y delimitador **coma**. En Transformar datos, quitar la detección automática de tipos y establecer teléfonos, WhatsApp y fechas como **Texto antes de cargar**. No abrirlo por doble clic si se necesita preservar ceros.

Microsoft Excel no está instalado en el entorno de ejecución: se validó la estructura y el contenido de los archivos, no su apertura en una instancia de Excel. No se realizaron commits ni cambios de precios, contactos o reglas comerciales.
