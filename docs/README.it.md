<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="Icona dell’app"></p>

<h1 align="center">Estrattore di miniature e fotogrammi di YouTube per il web</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <b>Italiano</b> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

Un componente web che riceve link di YouTube e trova, per ogni video, tutte le immagini che YouTube offre – la
miniatura in tutte le dimensioni, i fotogrammi nelle proporzioni originali del video e quelli che YouTube sceglie
da solo – da scaricare, copiare, convertire o salvare in uno ZIP. Funziona interamente nel browser: niente
server, niente chiave API.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="ThumbSnap con un video caricato: il campo del link, le opzioni di formato e nome file, e titolo, canale, badge, colori e pulsanti di download del video"></p>

| Immagini | File | Dimensioni | Quali video |
|---|---|---|---|
| Miniatura | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, più `hq720` quando manca `maxresdefault` | da 1280×720 a 120×90 | tutti i video; le dimensioni 4:3 hanno bande nere, e i video caricati in bassa risoluzione non hanno né 1280×720 né 640×480 |
| Fotogrammi in proporzioni originali | `oar1`–`oar3`, e `frame0` (il primo fotogramma) | 1080×1920 per gli Shorts, altrimenti fino a 1920×1080 | gli Shorts e i video meno recenti; i video normali recenti hanno solo `frame0` |
| Fotogrammi automatici | `1`–`3` in cinque dimensioni, i più grandi sono `maxres1`–`maxres3` | da 1280×720 a 120×90 | tutti i video tranne le dirette |
| Versioni WebP | le dimensioni della miniatura, in `vi_webp` | come la miniatura | solo visualizzazione e apertura – YouTube le invia senza CORS |

YouTube non dice quali di questi file esistano, quindi ThumbSnap richiede ogni file e legge la risposta: uno
mancante torna come 404 con un segnaposto grigio di 120×90. Per distinguere una miniatura caricata da una
generata automaticamente, confronta byte per byte la miniatura con i fotogrammi automatici; dall’endpoint oEmbed
di YouTube ricava il titolo, il canale e se il video è verticale. Quanto emerso interrogando YouTube è raccolto
in [docs/youtube-thumbnails.md](youtube-thumbnails.md).

Lo strumento è disponibile in 13 lingue – inglese, coreano, giapponese, cinese (semplificato e tradizionale),
tedesco, spagnolo, francese, italiano, portoghese, polacco, indonesiano e vietnamita – e segue la lingua della
pagina in cui si trova. Nelle altre lingue appare in inglese. Segue anche la modalità scura della pagina.

Il codice sorgente di questo repository è distribuito con licenza MIT. Il nome ThumbSnap e la sua icona non
fanno parte di questo codice. L’icona in alto è mostrata solo a titolo illustrativo: non è coperta dalla licenza
MIT e non è inclusa nelle build ottenute da questo repository. ThumbSnap non è affiliato a YouTube o Google, e
le miniature appartengono ai loro creatori.

## Provalo

ThumbSnap è disponibile su [hobbyworker.me](https://hobbyworker.me/it/tools/thumbsnap/), in tutte le 13 lingue.

## Requisiti

- Un browser recente: Chrome o Edge dalla versione 111, Safari dalla 16.4, Firefox dalla 113.
- Accesso a `i.ytimg.com` (immagini) e `www.youtube.com` (oEmbed). Nessun altro server viene contattato.
- Per copiare le immagini e per condividere serve una pagina sicura – HTTPS o `localhost`.

## Compilazione

```sh
npm install
npm run dev     # la pagina demo, con i selettori di lingua e tema
npm test        # test unitari (Vitest)
npm run build   # dist/thumbsnap.js, la sua source map e THIRD_PARTY_LICENSES.txt
```

Compilazione e test sono stati verificati con Node.js 24.

`dist/thumbsnap.js` è un unico modulo ES che include Lit e registra `<thumb-snap>` al caricamento.
Distribuiscilo insieme a `THIRD_PARTY_LICENSES.txt`.

## Utilizzo

1. Incolla uno o più link di YouTube o ID video. Funzionano i link watch, `youtu.be`, Shorts, live, embed e
   `music.youtube.com`, e per una playlist viene caricato il suo video di copertina. Un link incollato si carica
   subito; per più link mettine uno per riga, oppure trascina un link sullo strumento.
2. La miniatura compare in tutte le dimensioni disponibili su YouTube, ognuna con la sua risoluzione effettiva e
   il peso del file, e la più grande è contrassegnata come **Migliore**.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="La sezione “Miniature”: cinque dimensioni da 1280×720 a 120×90, la più grande contrassegnata come “Migliore”, ognuna con i pulsanti per scaricare, copiare, copiare il link, condividere e aprire"></p>
3. La sezione **Fotogrammi in proporzioni originali** mostra ciò che YouTube ha acquisito nella forma propria del
   video – per uno Short, tre fotogrammi verticali da 1080×1920 e il suo primo fotogramma.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Fotogrammi in proporzioni originali di uno Short: tre fotogrammi da 1080×1920 e un primo fotogramma da 268×480"></p>
4. La sezione **Fotogrammi automatici** mostra i tre fotogrammi che YouTube sceglie da solo; con i numeri sotto
   ciascuno si passa da una delle sue cinque dimensioni all’altra.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="Fotogrammi automatici 1, 2 e 3 a 1280×720, con i pulsanti delle dimensioni 1280, 640, 480, 320 e 120"></p>
5. Puoi scaricare ogni immagine, copiarla come immagine, copiarne l’indirizzo, condividerla se il dispositivo può
   condividere file, oppure aprirla. **Scarica la migliore** e **Scarica tutto (ZIP)** riguardano l’intero video;
   con più video, **Scarica tutti i video (ZIP)** mette ciascuno nella propria cartella.
6. **Formato** converte in PNG o WebP (vengono offerti solo i formati che il browser sa codificare),
   **Rimuovi bande nere** ritaglia le bande del letterbox dalle immagini 4:3, e **Nome file** usa l’ID del video,
   oppure il titolo e l’ID.
7. **Codice di incorporamento** fornisce Markdown e HTML per una miniatura cliccabile. La barra degli indirizzi
   mantiene `?v=`, così un risultato si può condividere, e i video recenti restano salvati nel browser.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="Codice di incorporamento: Markdown, HTML e l’URL dell’immagine, ognuno con un pulsante “Copia”"></p>

## Utilizzo in una pagina

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Attributo | Predefinito | |
|---|---|---|
| `locale` | l’attributo `lang` più vicino | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`; i tag come `zh-TW` o `pt-BR` vengono ricondotti alla lingua corrispondente |
| `theme` | `auto` | `auto` segue `data-theme`, `data-color-scheme` o `data-bs-theme` su `<html>`, la sua classe `dark` o `light` o il suo `color-scheme`, poi il sistema; `light` e `dark` fissano il tema |
| `value` | | link o ID da caricare all’avvio |
| `no-url-sync` | disattivato | lascia invariati `?v=` e `?list=` nella barra degli indirizzi |
| `no-history` | disattivato | non conserva i video recenti in `localStorage` |
| `max-videos` | `20` | il numero massimo di video caricati in una volta |

- Proprietà personalizzate CSS: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`,
  `--thumbsnap-font`.
- Ogni azione genera un evento `thumbsnap` con `bubbles` e `composed`. Il suo `detail` è
  `{ action, videoId?, variant?, format?, count? }`, e `action` vale `resolve`, `download`, `download-zip`,
  `copy-image`, `copy-text`, `share` o `error`.
- `load(text)` carica i link come se fossero stati digitati; `clear()` svuota lo strumento.
- Il contenuto con `slot="footer"` appare sotto lo strumento. In alternativa, una sottoclasse può sovrascrivere
  `renderFooter()`: importa `src/index.ts`, che non registra nulla, e registra l’elemento con
  `defineThumbSnap()`.

Sono esportati anche i blocchi di base – `parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`,
`transformImage`, `findContentRect`, `extractPalette`, `createZip` e altri – da usare senza l’interfaccia.

## Struttura

```
src/
├── core/       link, file della CDN, caricamento e verifica, oEmbed, ritaglio, conversione e colori, ZIP, nomi dei file (senza interfaccia)
├── i18n/       en (testo originale), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         l’elemento <thumb-snap> (Lit) – lingua e tema della pagina, stato di un video, template, stili
├── index.ts    l’API pubblica; non registra nulla
└── auto.ts     il punto d’ingresso del bundle; registra <thumb-snap>
tests/          Vitest – link, file, ZIP, ritaglio, oEmbed, i cataloghi, la scelta della dimensione migliore
docs/           cosa offre YouTube, e questi README
index.html      la pagina demo
```

Ogni catalogo ha le stesse chiavi e gli stessi segnaposto di `en.ts`; il controllo dei tipi e i test lo
garantiscono.

## Limiti

- YouTube non documenta nessuno di questi file. Cosa esiste, e dove, può cambiare.
- Una miniatura caricata si distingue da una generata automaticamente confrontandone i byte con `hq1`–`hq3`. Se
  il creatore ha scelto un altro dei fotogrammi suggeriti da Studio, anche la sua miniatura sembra caricata.
- I file WebP di YouTube si possono solo aprire: senza CORS la pagina non può salvarli né convertirli.
  Convertire un JPEG in WebP dà lo stesso risultato.
- I video normali recenti non hanno fotogrammi in proporzioni originali, quindi quelle tre schede indicano
  “Non disponibile”.
- I file che richiedono le firme di YouTube – la copertina verticale di uno Short, le anteprime animate, gli
  storyboard – e le playlist o i canali interi sono fuori portata senza un server.
- La verifica di file inesistenti lascia errori 404 nella console del browser.
