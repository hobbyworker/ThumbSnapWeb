<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="App-Symbol"></p>

<h1 align="center">Extraktor für YouTube-Thumbnails und -Frames im Web</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <b>Deutsch</b> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

Eine Webkomponente, die YouTube-Links entgegennimmt und zu jedem Video alle Bilder findet, die YouTube
bereitstellt – das Thumbnail in allen Größen, Frames im eigenen Seitenverhältnis des Videos und die Frames, die
YouTube selbst auswählt –, zum Herunterladen, Kopieren, Umwandeln oder Speichern als ZIP. Sie läuft vollständig
im Browser: kein Server, kein API-Schlüssel.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="ThumbSnap mit einem geladenen Video: das Linkfeld, die Optionen für Format und Dateiname sowie Titel, Kanal, Badges, Farben und Download-Schaltflächen des Videos"></p>

| Bilder | Dateien | Größe | Welche Videos |
|---|---|---|---|
| Thumbnail | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, dazu `hq720`, wenn `maxresdefault` fehlt | von 1280×720 bis 120×90 | jedes Video; die 4:3-Größen haben Letterbox-Balken, und bei Uploads in niedriger Auflösung fehlen 1280×720 und 640×480 |
| Frames im Originalformat | `oar1`–`oar3` und `frame0` (der erste Frame) | 1080×1920 bei Shorts, sonst bis zu 1920×1080 | Shorts und ältere Videos; neuere normale Videos haben nur `frame0` |
| Automatisch erzeugte Frames | `1`–`3` in fünf Größen, am größten `maxres1`–`maxres3` | von 1280×720 bis 120×90 | jedes Video außer Livestreams |
| WebP-Versionen | die Thumbnail-Größen, unter `vi_webp` | wie beim Thumbnail | nur zum Anzeigen und Öffnen – YouTube sendet sie ohne CORS |

YouTube verrät nicht, welche dieser Dateien existieren, also fragt ThumbSnap jede einzelne an und wertet die
Antwort aus: Eine fehlende kommt als 404 mit einem grauen Platzhalterbild in 120×90 zurück. Um ein hochgeladenes
Thumbnail von einem automatisch erzeugten zu unterscheiden, vergleicht ThumbSnap das Thumbnail Byte für Byte mit
den automatisch erzeugten Frames; Titel, Kanal und ob das Video hochkant ist, erfährt es vom oEmbed-Endpunkt von
YouTube. Was sich beim Abfragen von YouTube gezeigt hat, ist in [docs/youtube-thumbnails.md](youtube-thumbnails.md)
festgehalten.

Das Tool gibt es in 13 Sprachen – Englisch, Koreanisch, Japanisch, Chinesisch (vereinfacht und traditionell),
Deutsch, Spanisch, Französisch, Italienisch, Portugiesisch, Polnisch, Indonesisch und Vietnamesisch. Es folgt der
Sprache der Seite, in die es eingebunden ist; in allen anderen Sprachen erscheint es auf Englisch. Auch den
Dunkelmodus der Seite übernimmt es.

Der Quellcode in diesem Repository steht unter der MIT-Lizenz. Der Name ThumbSnap und sein Symbol sind nicht in
diesem Quellcode enthalten. Das Symbol ganz oben dient nur der Anschauung: Es fällt nicht unter die MIT-Lizenz und
ist in Builds aus diesem Repository nicht enthalten. ThumbSnap ist nicht mit YouTube oder Google verbunden, und
Thumbnails gehören ihren Urhebern.

## Ausprobieren

ThumbSnap läuft auf [hobbyworker.me](https://hobbyworker.me/de/tools/thumbsnap/), in allen 13 Sprachen.

## Voraussetzungen

- Ein aktueller Browser: Chrome oder Edge ab Version 111, Safari ab 16.4, Firefox ab 113.
- Zugriff auf `i.ytimg.com` (Bilder) und `www.youtube.com` (oEmbed). Andere Server werden nicht kontaktiert.
- Zum Kopieren von Bildern und zum Teilen muss die Seite sicher sein – HTTPS oder `localhost`.

## Build

```sh
npm install
npm run dev     # die Demoseite, mit Umschaltern für Sprache und Theme
npm test        # Unit-Tests (Vitest)
npm run build   # dist/thumbsnap.js, die zugehörige Source-Map und THIRD_PARTY_LICENSES.txt
```

Build und Tests wurden mit Node.js 24 geprüft.

`dist/thumbsnap.js` ist ein einzelnes ES-Modul, das Lit enthält und beim Laden `<thumb-snap>` registriert.
Liefere `THIRD_PARTY_LICENSES.txt` mit.

## Verwendung

1. Füge einen oder mehrere YouTube-Links oder Video-IDs ein. Watch-, `youtu.be`-, Shorts-, Live- und
   Embed-Links funktionieren ebenso wie Links von `music.youtube.com`, und eine Playlist liefert ihr Titelvideo.
   Ein eingefügter Link wird sofort geladen; mehrere kommen je in eine eigene Zeile – oder ziehe einen Link auf
   das Tool.
2. Das Thumbnail erscheint in jeder Größe, die YouTube hat, jeweils mit tatsächlichen Abmessungen und
   Dateigröße; die größte ist mit **Beste** markiert.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="Der Bereich „Thumbnails“: fünf Größen von 1280×720 bis 120×90, die größte mit „Beste“ markiert, jede mit Schaltflächen für Herunterladen, Kopieren, Link, Teilen und Öffnen"></p>
3. **Frames im Originalformat** sind das, was YouTube im eigenen Format des Videos aufgenommen hat – bei einem
   Short drei hochkante Frames in 1080×1920 und sein erster Frame.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Frames im Originalformat eines Shorts: drei Frames in 1080×1920 und ein erster Frame in 268×480"></p>
4. **Automatisch erzeugte Frames** sind die drei Frames, die YouTube selbst auswählt; mit den Zahlen darunter
   wechselst du zwischen den fünf Größen des jeweiligen Frames.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="Automatisch erzeugte Frames 1 bis 3 in 1280×720, mit den Größenschaltflächen 1280, 640, 480, 320 und 120"></p>
5. Jedes Bild kannst du herunterladen, als Bild kopieren, seine Adresse kopieren, teilen (wo das Gerät Dateien
   teilen kann) oder öffnen. **Beste Qualität laden** und **Alle herunterladen (ZIP)** gelten für das ganze
   Video; bei mehreren Videos legt **Alle Videos herunterladen (ZIP)** jedes in einen eigenen Ordner.
6. **Format** wandelt in PNG oder WebP um (angeboten wird nur, was der Browser kodieren kann),
   **Schwarze Balken entfernen** schneidet die Letterbox-Balken aus 4:3-Bildern, und **Dateiname** verwendet die
   Video-ID oder den Titel und die ID.
7. **Einbettungscode** liefert Markdown und HTML für ein anklickbares Thumbnail. Die Adressleiste behält `?v=`
   bei, sodass sich ein Ergebnis teilen lässt, und die zuletzt geladenen Videos bleiben im Browser gespeichert.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="Einbettungscode: Markdown, HTML und die Bild-URL, jeweils mit der Schaltfläche „Kopieren“"></p>

## Einbinden in eine Seite

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Attribut | Standard | |
|---|---|---|
| `locale` | das nächstgelegene `lang`-Attribut | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`; Tags wie `zh-TW` oder `pt-BR` werden passend zugeordnet |
| `theme` | `auto` | `auto` folgt `data-theme`, `data-color-scheme` oder `data-bs-theme` an `<html>`, dessen Klasse `dark` oder `light` oder dessen `color-scheme`, danach dem System; `light` und `dark` legen das Theme fest |
| `value` | | Links oder IDs, die beim Start geladen werden |
| `no-url-sync` | aus | lässt `?v=` und `?list=` in der Adressleiste unangetastet |
| `no-history` | aus | speichert keine zuletzt geladenen Videos in `localStorage` |
| `max-videos` | `20` | die Höchstzahl der auf einmal geladenen Videos |

- CSS-Custom-Properties: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`,
  `--thumbsnap-font`.
- Jede Aktion löst ein `thumbsnap`-Event mit `bubbles` und `composed` aus. Sein `detail` ist
  `{ action, videoId?, variant?, format?, count? }`, und `action` ist `resolve`, `download`,
  `download-zip`, `copy-image`, `copy-text`, `share` oder `error`.
- `load(text)` lädt Links, als wären sie eingetippt worden; `clear()` leert das Tool.
- Inhalt mit `slot="footer"` erscheint unter dem Tool. Alternativ kann eine Unterklasse `renderFooter()`
  überschreiben: Importiere dazu `src/index.ts`, das nichts registriert, und registriere das Element mit
  `defineThumbSnap()`.

Auch die Bausteine – `parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`, `transformImage`,
`findContentRect`, `extractPalette`, `createZip` und weitere – werden exportiert und lassen sich ohne die
Oberfläche nutzen.

## Aufbau

```
src/
├── core/       Links, die Dateien des CDN, Laden und Prüfen, oEmbed, Zuschneiden, Umwandeln und Farben, ZIP, Dateinamen (ohne Oberfläche)
├── i18n/       en (Ausgangstext), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         das Element <thumb-snap> (Lit) – Sprache und Theme der Seite, der Zustand eines Videos, Templates, Styles
├── index.ts    die öffentliche API; registriert nichts
└── auto.ts     der Einstiegspunkt des Bundles; registriert <thumb-snap>
tests/          Vitest – Links, Dateien, ZIP, Zuschneiden, oEmbed, die Kataloge, die Wahl der besten Größe
docs/           was YouTube ausliefert, und diese READMEs
index.html      die Demoseite
```

Jeder Katalog hat dieselben Schlüssel und Platzhalter wie `en.ts`; dafür sorgen die Typprüfung und die Tests.

## Einschränkungen

- YouTube dokumentiert keine dieser Dateien. Was es gibt und wo, kann sich ändern.
- Ein hochgeladenes Thumbnail wird von einem automatisch erzeugten per Byte-Vergleich mit `hq1`–`hq3`
  unterschieden. Hat ein Creator in Studio einen der anderen Vorschläge gewählt, sieht das ebenfalls wie ein
  Upload aus.
- WebP-Dateien von YouTube lassen sich nur öffnen: Ohne CORS kann die Seite sie weder speichern noch umwandeln.
  Wer ein JPEG in WebP umwandelt, erhält dasselbe Ergebnis.
- Neuere normale Videos haben keine Frames im Originalformat, daher zeigen diese drei Karten „Nicht verfügbar“.
- Dateien, die Signaturen von YouTube brauchen – das hochkante Cover eines Shorts, animierte Vorschauen,
  Storyboards –, sowie ganze Playlists oder Kanäle sind ohne Server nicht erreichbar.
- Die Prüfung auf nicht vorhandene Dateien hinterlässt 404-Fehler in der Browserkonsole.
