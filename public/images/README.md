# Imagenes del proyecto

## Originales

Coloca las imagenes fuente en:

```text
public/images/originales/
```

Esa carpeta esta ignorada por Git para evitar subir fotos pesadas o material sin optimizar.

Formatos aceptados por el script:

- `.jpg`
- `.jpeg`
- `.png`

## Conversion a WEBP

Ejecuta:

```bash
npm run images:convert
```

En PowerShell, si `npm.ps1` esta bloqueado:

```bash
npm.cmd run images:convert
```

El script genera imagenes WEBP optimizadas en:

```text
public/images/products/
```

## Nombres recomendados

Usa nombres cortos, descriptivos y en minusculas:

```text
taza-biblioteca-1.jpg
vasija-puntas-2.png
cuenco-arena-1.jpeg
```

El script normaliza espacios, acentos y caracteres especiales para generar rutas web limpias.

## Uso en datos mock

Referencia las imagenes convertidas desde los archivos de datos con rutas como:

```ts
"/images/products/taza-biblioteca-1.webp"
```

No subas originales pesadas al repositorio. Sube solamente las imagenes WEBP finales que use la web.
