<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="Icono de la app"></p>

<h1 align="center">Extractor de miniaturas y fotogramas de YouTube para la web</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <b>Español</b> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

Un componente web que recibe enlaces de YouTube y encuentra todas las imágenes que YouTube ofrece de cada vídeo —la
miniatura en todos sus tamaños, fotogramas con la relación de aspecto del propio vídeo y los fotogramas que YouTube
elige por sí solo— para descargarlas, copiarlas, convertirlas o guardarlas en un ZIP. Funciona por completo en el
navegador: sin servidor ni clave de API.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="ThumbSnap con un vídeo cargado: el campo del enlace, las opciones de formato y de nombre del archivo, y el título, el canal, las etiquetas, los colores y los botones de descarga del vídeo"></p>

| Imágenes | Archivos | Tamaño | En qué vídeos |
|---|---|---|---|
| Miniatura | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, más `hq720` cuando falta `maxresdefault` | de 1280×720 a 120×90 | todos los vídeos; los tamaños 4:3 llevan bandas negras y los vídeos subidos en baja resolución no tienen 1280×720 ni 640×480 |
| Fotogramas en proporción original | `oar1`–`oar3` y `frame0` (el primer fotograma) | 1080×1920 en los Shorts; en los demás, hasta 1920×1080 | Shorts y vídeos más antiguos; los vídeos normales recientes solo tienen `frame0` |
| Fotogramas automáticos | `1`–`3` en cinco tamaños; los más grandes son `maxres1`–`maxres3` | de 1280×720 a 120×90 | todos los vídeos excepto las emisiones en directo |
| Versiones WebP | los tamaños de la miniatura, en `vi_webp` | como la miniatura | solo se muestran y se abren — YouTube las envía sin CORS |

YouTube no indica cuáles de estos archivos existen, así que ThumbSnap pide cada uno y lee la respuesta: los que faltan
devuelven un 404 con una imagen gris de relleno de 120×90. Compara byte a byte la miniatura con los fotogramas
automáticos para distinguir una miniatura subida de una generada automáticamente, y obtiene del endpoint oEmbed de
YouTube el título, el canal y si el vídeo es vertical. Lo que se averiguó sondeando YouTube está documentado en
[docs/youtube-thumbnails.md](youtube-thumbnails.md).

La herramienta está disponible en 13 idiomas: inglés, coreano, japonés, chino (simplificado y tradicional), alemán,
español, francés, italiano, portugués, polaco, indonesio y vietnamita. Sigue el idioma de la página en la que está; en
cualquier otro idioma, aparece en inglés. También sigue el modo oscuro de la página.

El código fuente de este repositorio tiene licencia MIT. El nombre ThumbSnap y su icono no están incluidos en este
código. El icono de arriba se muestra solo como referencia: no está cubierto por la licencia MIT y lo que compiles
desde este repositorio no lo incluye. ThumbSnap no tiene relación con YouTube ni con Google, y las miniaturas
pertenecen a sus creadores.

## Pruébalo

ThumbSnap funciona en [hobbyworker.me](https://hobbyworker.me/es/services/thumbsnap/), en los 13 idiomas.

## Requisitos

- Un navegador actual: Chrome o Edge 111 o posterior, Safari 16.4 o posterior, Firefox 113 o posterior.
- Acceso a `i.ytimg.com` (imágenes) y `www.youtube.com` (oEmbed). No se conecta a ningún otro sitio.
- Para copiar imágenes y compartir hace falta una página segura: HTTPS o `localhost`.

## Compilación

```sh
npm install
npm run dev     # la página de demostración, con selectores de idioma y tema
npm test        # pruebas unitarias (Vitest)
npm run build   # dist/thumbsnap.js, su source map y THIRD_PARTY_LICENSES.txt
```

La compilación y las pruebas se han comprobado con Node.js 24.

`dist/thumbsnap.js` es un único módulo ES que incluye Lit y registra `<thumb-snap>` al cargarse. Distribúyelo junto
con `THIRD_PARTY_LICENSES.txt`.

## Uso

1. Pega uno o varios enlaces de YouTube o ID de vídeo. Sirven los enlaces watch, `youtu.be`, Shorts, live, embed y
   `music.youtube.com`, y de una lista de reproducción se toma su vídeo de portada. Un enlace pegado se carga al
   momento; si son varios, pon uno por línea. También puedes soltar un enlace sobre la herramienta.
2. La miniatura aparece en todos los tamaños que tiene YouTube, cada uno con sus dimensiones reales y su tamaño de
   archivo, y el más grande se marca como **Mejor**.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="La sección Miniaturas: cinco tamaños de 1280×720 a 120×90, el más grande marcado como Mejor, cada uno con botones para descargar, copiar, copiar la URL, compartir y abrir"></p>
3. En **Fotogramas en proporción original** está lo que YouTube capturó con la forma del propio vídeo: en un Short,
   tres fotogramas verticales de 1080×1920 y su primer fotograma.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Fotogramas en proporción original de un Short: tres fotogramas de 1080×1920 y un primer fotograma de 268×480"></p>
4. En **Fotogramas automáticos** están los tres fotogramas que YouTube elige por sí solo; los números de debajo de
   cada uno permiten cambiar entre sus cinco tamaños.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="Fotogramas automáticos 1 a 3 en 1280×720, con los botones de tamaño 1280, 640, 480, 320 y 120"></p>
5. Cada imagen se puede descargar, copiar como imagen, copiar su dirección, compartir (si el dispositivo puede
   compartir archivos) o abrir. **Descargar la mejor** y **Descargar todo (ZIP)** se aplican al vídeo entero; con
   varios vídeos, **Descargar todos los vídeos (ZIP)** pone cada uno en su propia carpeta.
6. **Formato** convierte a PNG o WebP (solo se ofrece lo que el navegador puede codificar), **Quitar bandas negras**
   las recorta de las imágenes 4:3 y **Nombre del archivo** usa el ID del vídeo, o el título y el ID.
7. **Código para insertar** da el Markdown y el HTML de una miniatura con enlace. La barra de direcciones conserva
   `?v=`, así que un resultado se puede compartir, y los vídeos recientes se quedan guardados en el navegador.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="Código para insertar: Markdown, HTML y la URL de la imagen, cada uno con un botón Copiar"></p>

## Uso en una página web

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Atributo | Predeterminado | |
|---|---|---|
| `locale` | el atributo `lang` más cercano | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`; las etiquetas como `zh-TW` o `pt-BR` se asignan al idioma correspondiente |
| `theme` | `auto` | `auto` sigue `data-theme`, `data-color-scheme` o `data-bs-theme` en `<html>`, su clase `dark` o `light`, o su `color-scheme`, y después el sistema; `light` y `dark` fijan el tema |
| `value` | | enlaces o ID que se cargan al inicio |
| `no-url-sync` | desactivado | no toca `?v=` ni `?list=` en la barra de direcciones |
| `no-history` | desactivado | no guarda vídeos recientes en `localStorage` |
| `max-videos` | `20` | el máximo de vídeos que se cargan de una vez |

- Propiedades personalizadas de CSS: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`,
  `--thumbsnap-font`.
- Cada acción dispara un evento `thumbsnap` con `bubbles` y `composed` activados. Su `detail` es
  `{ action, videoId?, variant?, format?, count? }`, y `action` es `resolve`, `download`, `download-zip`,
  `copy-image`, `copy-text`, `share` o `error`.
- `load(text)` carga enlaces como si se hubieran escrito; `clear()` vacía la herramienta.
- El contenido con `slot="footer"` aparece debajo de la herramienta. Como alternativa, una subclase puede sobrescribir
  `renderFooter()`: para ello, importa `src/index.ts` (que no registra nada) y registra tú mismo el elemento con
  `defineThumbSnap()`.

Las piezas básicas —`parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`, `transformImage`,
`findContentRect`, `extractPalette`, `createZip` y más— también se exportan, para usarlas sin la interfaz.

## Estructura

```
src/
├── core/       enlaces, los archivos de la CDN, carga y sondeo, oEmbed, recorte, conversión y colores, ZIP, nombres de archivo (sin interfaz)
├── i18n/       en (original), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         el elemento <thumb-snap> (Lit) — el idioma y el tema de la página, el estado de un vídeo, plantillas, estilos
├── index.ts    la API pública; no registra nada
└── auto.ts     el punto de entrada del bundle; registra <thumb-snap>
tests/          Vitest — enlaces, archivos, ZIP, recorte, oEmbed, los catálogos, la elección del mejor tamaño
docs/           lo que ofrece YouTube y estos README
index.html      la página de demostración
```

Todos los catálogos tienen las mismas claves y marcadores de posición que `en.ts`; el verificador de tipos y las
pruebas se encargan de comprobarlo.

## Limitaciones

- YouTube no documenta ninguno de estos archivos. Lo que existe, y dónde, puede cambiar.
- Una miniatura subida se distingue de una automática comparando sus bytes con `hq1`–`hq3`. Si el creador eligió
  otra de las sugerencias de Studio, también parecerá una miniatura subida.
- Los archivos WebP de YouTube solo se pueden abrir: sin CORS, la página no puede guardarlos ni convertirlos.
  Convertir un JPEG a WebP da el mismo resultado.
- Los archivos que necesitan firmas de YouTube —la portada vertical de un Short, las vistas previas animadas, los
  storyboards— y las listas de reproducción o canales completos quedan fuera de alcance sin un servidor.
- Comprobar archivos que no existen deja errores 404 en la consola del navegador.
