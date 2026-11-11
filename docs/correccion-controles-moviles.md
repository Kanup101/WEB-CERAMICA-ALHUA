# Menú y carrito móviles: diagnóstico y corrección

## Causa comprobada

Ambos controles tenían `use client`, estado React y `onClick` correctos. En el acceso de desarrollo por `http://192.168.100.7:3000`, Next 16.4.6 rechazaba el origen de la conexión `/_next/hmr`. El log `.next/dev/logs/next-development.log` registraba:

```text
Blocked cross-origin request to Next.js dev resource /_next/hmr from "192.168.100.7".
```

Se reprodujo en Chrome con emulación móvil y eventos táctiles reales: los botones eran alcanzables mediante `elementFromPoint`, pero no tenían manejadores React hidratados; tocar menú y carrito no los abría. La conexión WebSocket de desarrollo fallaba repetidamente. El HTML estático y las imágenes sí cargaban, lo que explicaba que la página pareciera normal.

## Corrección mínima

`next.config.ts` agrega **`allowedDevOrigins: ["192.168.100.7"]`**, según la guía instalada de Next en `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/allowedDevOrigins.md`.

Solo se permite el hostname/IP de la prueba local, sin puerto, protocolo ni comodines amplios. La opción corresponde al servidor de desarrollo; no agrega CORS global ni cambia las rutas de producción. Si cambia la IP de la computadora, actualizar esta entrada y reiniciar Next.

No se modificaron Navbar, CartDrawer, eventos táctiles de la aplicación, CSS, contexto del carrito ni traducciones. La clave `alhua-cart`, los productos guardados, los precios y el stock conservan su funcionamiento. No se instalaron dependencias.

## Pruebas

`scripts/test-mobile-touch.mjs` usa Chrome DevTools Protocol y `Input.dispatchTouchEvent` con coordenadas reales. Comprueba que ningún elemento bloquee el punto del toque. No usa `element.click()` ni eventos DOM sintéticos para abrir controles o navegar. El selector nativo se abre por toque y se opera con entrada de teclado nativa.

- Seis idiomas: es, en, de, fr, ko y zh-CN.
- Cuatro anchos: 360, 375, 390 y 430 px, con 900 px de altura.
- Por combinación: abrir/cerrar/reabrir menú; navegar a tienda y verificar cierre; abrir/cerrar/reabrir carrito; ir a checkout; cambiar idioma; volver a operar ambos controles; comprobar que `alhua-cart` conserva exactamente su contenido.
- 24 escenarios táctiles sobre la IP LAN y seis escenarios de escritorio a 1440 px con eventos reales de ratón.
- Control de errores de JavaScript, recursos HTTP y WebSocket.

El diagnóstico previo (`--probe`) mostró menú y carrito cerrados después de los toques y fallos de WebSocket. Con la corrección, ambos abrieron y no se registraron errores. Las pruebas se ejecutan en un perfil de Chrome temporal aislado: solo se agrega una pieza al carrito de prueba y no se borran carritos personales.

Resultados: lint y build correctos; el prebuild también verificó las traducciones y los catálogos. La comprobación táctil automatizada usa Chrome, no un dispositivo físico ni Safari de iOS.

Para repetir la automatización, iniciar Chrome aislado con `--headless=new --remote-debugging-port=9225 --user-data-dir=<directorio-temporal-nuevo>` y una pestaña `about:blank`. No usar un perfil personal. Con el servidor de desarrollo iniciado:

```powershell
$env:TEST_BASE_URL = 'http://192.168.100.7:3000'
node scripts/test-mobile-touch.mjs
npm.cmd run lint
npm.cmd run build
```

`CHROME_DEBUG_URL` permite configurar otro endpoint de depuración. La prueba requiere un perfil sin carrito previo para proteger datos que no pertenezcan al test.

## Comprobar desde un celular real

1. Reiniciar el servidor de desarrollo con `npm.cmd run dev` si ya estaba ejecutándose con la configuración anterior.
2. Conectar computadora y celular a la misma red. Abrir en el celular **`http://192.168.100.7:3000`** usando la IP que muestra Next al iniciar, no `localhost`.
3. Recargar la pestaña para que cargue el runtime actualizado. No borrar localStorage ni los datos del sitio: el carrito debe conservarse.
4. Tocar el menú: abrirlo, cerrarlo con el mismo botón, volver a abrirlo y seleccionar Tienda. Verificar navegación y cierre.
5. Tocar el carrito, comprobar las piezas guardadas, cerrarlo con la X, volver a abrirlo y continuar a checkout si hay productos.
6. Cambiar sucesivamente a los seis idiomas desde el menú y repetir ambos controles. El contenido, los enlaces y el carrito deben seguir en el idioma elegido.

Si el router asigna otra IP a la computadora, reemplazar `192.168.100.7` en `allowedDevOrigins`, reiniciar y usar la nueva URL. Las instrucciones no requieren limpiar ni modificar `alhua-cart`.
