# Mapa de imagenes

QA de assets para **Yanina Cardozo | Ceramica creativa**.

## Imagenes encontradas

### `public/images/products`

WEBP reales:

- `barro-1.webp`
- `barro-2.webp`
- `horno-1.webp`
- `horno-2.webp`
- `obra-1.webp`
- `obra-11.webp`
- `obra-2.webp`
- `obra-3.webp`
- `obra-4.webp`
- `obra-5.webp`
- `obra-6webp.webp`
- `obra-7.webp`
- `paisaje-1.webp`
- `paisaje-2.webp`
- `paisaje-3.webp`
- `paisaje-4.webp`
- `paisaje-5.webp`
- `paisaje-6.webp`
- `paisaje-7.webp`
- `tambor-1.webp`
- `tambor-2.webp`
- `tambor-3.webp`
- `taza-biblioteca-1.webp`
- `vasija-puntas-1.webp`
- `vasija-puntas-2.webp`
- `vasija-puntas-3.webp`
- `vasija-silvadora-1.webp`
- `vasija-silvadora-2.webp`
- `vasija-silvadora-3.webp`
- `venas-1.webp`
- `venas-2.webp`
- `venas-3.webp`

SVG heredados o placeholders:

- `cuenco-rio-lento.svg`
- `pieza-unica-luna.svg`
- `placeholder-ceramica.svg`
- `plato-arena.svg`
- `taza-arcilla-clara.svg`
- `taza-niebla.svg`
- `vasija-calma.svg`

### `public/images/workshops`

- `esmaltes.svg`
- `iniciacion.svg`
- `utilitarias.svg`

Son placeholders SVG. No se usan actualmente como imagen principal.

### `public/images/brand`

- `taller-placeholder.svg`

Placeholder SVG. No se usa actualmente.

## Imagenes usadas en productos

- Taza Biblioteca: `taza-biblioteca-1.webp`
- Luminaria Corteza: `obra-2.webp`
- Luminaria Geometria: `obra-3.webp`
- Vasija Puntas: `vasija-puntas-1.webp`, `vasija-puntas-2.webp`, `vasija-puntas-3.webp`
- Vasija Silvadora: `vasija-silvadora-1.webp`, `vasija-silvadora-2.webp`, `vasija-silvadora-3.webp`
- Fuente Venas: `venas-1.webp`, `venas-2.webp`, `venas-3.webp`
- Tambor Ceremonial: `obra-1.webp`, `obra-11.webp`, `tambor-1.webp`, `tambor-2.webp`, `tambor-3.webp`
- Figura Flautista: `obra-4.webp`
- Vasija Organica: `obra-5.webp`
- Vasija Espinas: `obra-6webp.webp`

## Imagenes usadas en Home

- Hero principal: `paisaje-2.webp`
- Proceso en movimiento: `barro-2.webp`
- Productos destacados: salen desde `src/data/products.ts`
- Talleres destacados: salen desde `src/data/workshops.ts`

## Imagenes usadas en talleres

- Ceramica en casa desde cero: `barro-1.webp`
- Paleta natural de esmaltes: `barro-2.webp`
- Coleccion utilitaria con identidad: `paisaje-3.webp`

No hay fotos reales especificas de clases, alumnos, mesa de trabajo o pantalla de curso. Por eso se usaron imagenes de proceso/inspiracion.

## Imagenes usadas en Sobre Yanina

- Imagen principal: `barro-1.webp`

Se eligio una imagen de proceso/material para evitar placeholders visibles.

## Imagenes sin usar

WEBP reales sin uso directo:

- `horno-1.webp`
- `horno-2.webp`
- `obra-7.webp`
- `paisaje-1.webp`
- `paisaje-4.webp`
- `paisaje-5.webp`
- `paisaje-6.webp`
- `paisaje-7.webp`

SVG placeholders sin uso:

- `public/images/products/cuenco-rio-lento.svg`
- `public/images/products/pieza-unica-luna.svg`
- `public/images/products/placeholder-ceramica.svg`
- `public/images/products/plato-arena.svg`
- `public/images/products/taza-arcilla-clara.svg`
- `public/images/products/taza-niebla.svg`
- `public/images/products/vasija-calma.svg`
- `public/images/workshops/esmaltes.svg`
- `public/images/workshops/iniciacion.svg`
- `public/images/workshops/utilitarias.svg`
- `public/images/brand/taller-placeholder.svg`

## Imagenes que parecen repetidas o de la misma serie

- `obra-1.webp`, `obra-11.webp`, `tambor-1.webp`, `tambor-2.webp`, `tambor-3.webp`: parecen pertenecer a la serie del tambor ceremonial.
- `vasija-puntas-1.webp`, `vasija-puntas-2.webp`, `vasija-puntas-3.webp`: misma pieza o serie.
- `vasija-silvadora-1.webp`, `vasija-silvadora-2.webp`, `vasija-silvadora-3.webp`: misma pieza o serie.
- `venas-1.webp`, `venas-2.webp`, `venas-3.webp`: misma fuente/plato o serie.
- `paisaje-1.webp` a `paisaje-7.webp`: paisajes/inspiracion visual, no productos.
- `barro-1.webp`, `barro-2.webp`: proceso/material, no productos terminados.

## Imagenes que conviene renombrar

- `obra-1.webp` -> `tambor-ceremonial-1.webp`
- `obra-11.webp` -> `tambor-ceremonial-2.webp`
- `obra-2.webp` -> `luminaria-corteza-1.webp`
- `obra-3.webp` -> `luminaria-geometria-1.webp`
- `obra-4.webp` -> `figura-flautista-1.webp`
- `obra-5.webp` -> `vasija-organica-1.webp`
- `obra-6webp.webp` -> `vasija-espinas-1.webp`
- `obra-7.webp` -> pendiente de identificar antes de renombrar
- `barro-1.webp`, `barro-2.webp` -> mover conceptualmente a `brand` o futura carpeta `process`
- `paisaje-*` -> mover conceptualmente a `brand`, `inspiracion` o futura carpeta `process`

No se renombraron archivos en esta etapa para no romper rutas ni historial.

## Imagenes que faltan

- Foto real clara de cuencos.
- Foto real clara de platos utilitarios si se quieren vender platos separados de `Fuente Venas`.
- Mas fotos de `Taza Biblioteca` para galeria.
- Foto de Yanina o del taller para pagina Sobre Yanina.
- Fotos reales de talleres/cursos online: mesa de trabajo, manos trabajando, materiales, pantalla o setup de clase.
- Posters especificos para futuros videos.
- Imagenes finales por cada producto con fondo/encuadre consistente.

## Dudas o asignaciones inseguras

- `obra-7.webp`: se uso antes como apoyo de taza, pero no se pudo confirmar una relacion clara con producto. Quedo sin usar.
- `obra-5.webp`: asignada a `Vasija Organica` por contenido visual, pero conviene confirmar nombre real de la pieza.
- `obra-6webp.webp`: asignada a `Vasija Espinas`; el nombre de archivo original es confuso y conviene renombrar.
- `barro-*`: funcionan mejor como proceso/material que como producto.
- `paisaje-*`: funcionan como inspiracion visual y hero, no como producto.
- No hay imagen real de `Cuencos`, aunque la categoria existe en filtros.
