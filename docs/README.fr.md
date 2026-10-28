<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="Icône de l’app"></p>

<h1 align="center">Extracteur de miniatures et d’images YouTube pour le Web</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <b>Français</b> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

Un composant web qui reçoit des liens YouTube et trouve, pour chaque vidéo, toutes les images que YouTube
fournit – la miniature dans toutes ses tailles, des images au format d’origine de la vidéo et celles que YouTube
choisit lui-même – pour les télécharger, les copier, les convertir ou les enregistrer dans un ZIP. Il fonctionne
entièrement dans le navigateur : pas de serveur, pas de clé d’API.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="ThumbSnap avec une vidéo chargée : le champ du lien, les options de format et de nom de fichier, ainsi que le titre, la chaîne, les badges, les couleurs et les boutons de téléchargement de la vidéo"></p>

| Images | Fichiers | Taille | Vidéos concernées |
|---|---|---|---|
| Miniature | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, et `hq720` quand `maxresdefault` manque | de 1280×720 à 120×90 | toutes les vidéos ; les tailles 4:3 ont des bandes noires, et les vidéos mises en ligne en basse résolution n’ont ni 1280×720 ni 640×480 |
| Images au format d'origine | `oar1`–`oar3`, et `frame0` (la première image) | 1080×1920 pour les Shorts, sinon jusqu’à 1920×1080 | les Shorts et les vidéos plus anciennes ; les vidéos classiques récentes n’ont que `frame0` |
| Images générées automatiquement | `1`–`3` en cinq tailles, les plus grandes étant `maxres1`–`maxres3` | de 1280×720 à 120×90 | toutes les vidéos sauf les diffusions en direct |
| Versions WebP | les tailles de la miniature, sous `vi_webp` | comme la miniature | affichage et ouverture seulement – YouTube les envoie sans CORS |

YouTube n’indique pas lesquels de ces fichiers existent, alors ThumbSnap demande chaque fichier et lit la
réponse : un fichier absent revient en 404, avec une image de substitution grise en 120×90. Pour distinguer une
miniature mise en ligne d’une miniature générée automatiquement, il compare octet par octet la miniature aux
images générées automatiquement, et il obtient le titre, la chaîne et l’orientation de la vidéo auprès du point
de terminaison oEmbed de YouTube. Les observations faites en interrogeant YouTube sont consignées dans
[docs/youtube-thumbnails.md](youtube-thumbnails.md).

L’outil est disponible en 13 langues – anglais, coréen, japonais, chinois (simplifié et traditionnel), allemand,
espagnol, français, italien, portugais, polonais, indonésien et vietnamien – et suit la langue de la page qui
l’accueille. Dans les autres langues, il s’affiche en anglais. Il suit aussi le mode sombre de la page.

Le code source de ce dépôt est sous licence MIT. Le nom ThumbSnap et son icône ne font pas partie de ce code
source. L’icône en haut de la page n’est présentée qu’à titre d’illustration : elle n’est pas couverte par la
licence MIT et n’est pas incluse dans les compilations issues de ce dépôt. ThumbSnap n’est affilié ni à YouTube
ni à Google, et les miniatures appartiennent à leurs créateurs.

## Essayer

ThumbSnap fonctionne sur [hobbyworker.me](https://hobbyworker.me/fr/services/thumbsnap/), dans les 13 langues.

## Configuration requise

- Un navigateur récent : Chrome ou Edge à partir de la version 111, Safari à partir de la 16.4, Firefox à partir
  de la 113.
- L’accès à `i.ytimg.com` (images) et à `www.youtube.com` (oEmbed). Aucun autre serveur n’est contacté.
- La copie d’images et le partage nécessitent une page sécurisée – HTTPS ou `localhost`.

## Compilation

```sh
npm install
npm run dev     # la page de démo, avec choix de la langue et du thème
npm test        # tests unitaires (Vitest)
npm run build   # dist/thumbsnap.js, sa source map et THIRD_PARTY_LICENSES.txt
```

La compilation et les tests ont été vérifiés avec Node.js 24.

`dist/thumbsnap.js` est un module ES unique qui inclut Lit et enregistre `<thumb-snap>` à son chargement.
Distribuez-le avec `THIRD_PARTY_LICENSES.txt`.

## Utilisation

1. Collez un ou plusieurs liens YouTube ou ID de vidéo. Les liens watch, `youtu.be`, Shorts, live, embed et
   `music.youtube.com` fonctionnent tous, et pour une playlist, c’est sa vidéo de couverture qui est chargée. Un
   lien collé se charge aussitôt ; pour plusieurs liens, mettez-en un par ligne, ou déposez un lien sur l’outil.
2. La miniature apparaît dans toutes les tailles dont dispose YouTube, chacune avec ses dimensions réelles et la
   taille de son fichier, et la plus grande est marquée **Meilleure**.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="La section « Miniatures » : cinq tailles de 1280×720 à 120×90, la plus grande marquée « Meilleure », chacune avec des boutons pour télécharger, copier, copier le lien, partager et ouvrir"></p>
3. La section **Images au format d'origine** contient ce que YouTube a capturé dans les proportions de la vidéo
   elle-même – pour un Short, trois images verticales en 1080×1920 et sa première image.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Images au format d'origine pour un Short : trois images en 1080×1920 et une première image en 268×480"></p>
4. La section **Images générées automatiquement** contient les trois images que YouTube choisit lui-même ; les
   nombres sous chacune permettent de passer d’une de ses cinq tailles à l’autre.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="Images générées automatiquement 1 à 3 en 1280×720, avec les boutons de taille 1280, 640, 480, 320 et 120"></p>
5. Vous pouvez télécharger chaque image, la copier en tant qu’image, copier son adresse, la partager si
   l’appareil sait partager des fichiers, ou l’ouvrir. **Télécharger la meilleure** et **Tout télécharger (ZIP)**
   portent sur toute la vidéo ; avec plusieurs vidéos, **Télécharger toutes les vidéos (ZIP)** place chacune dans
   son propre dossier.
6. **Format** convertit en PNG ou en WebP (seuls les formats que le navigateur sait encoder sont proposés),
   **Supprimer les bandes noires** recadre les images 4:3 pour en retirer les bandes, et **Nom du fichier**
   utilise l’ID de la vidéo, ou le titre et l’ID.
7. **Code d'intégration** fournit le Markdown et le HTML d’une miniature cliquable. La barre d’adresse conserve
   `?v=`, ce qui permet de partager un résultat, et les vidéos récentes restent dans le navigateur.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="Code d'intégration : Markdown, HTML et l’URL de l’image, chacun avec un bouton « Copier »"></p>

## Intégration dans une page

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Attribut | Par défaut | |
|---|---|---|
| `locale` | l’attribut `lang` le plus proche | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl` ; les étiquettes comme `zh-TW` ou `pt-BR` sont ramenées à la langue correspondante |
| `theme` | `auto` | `auto` suit `data-theme`, `data-color-scheme` ou `data-bs-theme` sur `<html>`, sa classe `dark` ou `light`, ou son `color-scheme`, puis le système ; `light` et `dark` imposent le thème |
| `value` | | liens ou ID à charger au démarrage |
| `no-url-sync` | désactivé | laisse `?v=` et `?list=` tels quels dans la barre d’adresse |
| `no-history` | désactivé | ne conserve aucune vidéo récente dans `localStorage` |
| `max-videos` | `20` | le nombre maximal de vidéos chargées en une fois |

- Propriétés personnalisées CSS : `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`,
  `--thumbsnap-font`.
- Chaque action déclenche un événement `thumbsnap` avec `bubbles` et `composed`. Son `detail` est
  `{ action, videoId?, variant?, format?, count? }`, et `action` vaut `resolve`, `download`, `download-zip`,
  `copy-image`, `copy-text`, `share` ou `error`.
- `load(text)` charge des liens comme s’ils avaient été saisis ; `clear()` vide l’outil.

Une sous-classe peut agencer l’outil elle-même. `render()` se compose de deux parties — `renderTop()` (le
champ du lien et ses options) et `renderBottom()` (les vidéos récentes, les résultats, la notification et la
visionneuse d’images) — et chaque partie apporte son propre espacement, si bien qu’on peut les réassembler
avec ce qu’on veut avant, entre ou après elles :

```js
import { ThumbSnapElement, defineThumbSnap, html } from './src/index.ts';

class MyThumbSnap extends ThumbSnapElement {
  render() {
    return html`${this.renderTop()}<slot name="between"></slot>${this.renderBottom()}`;
  }
}
defineThumbSnap('thumb-snap', MyThumbSnap);
```

`src/index.ts` n’enregistre rien, la sous-classe peut donc prendre le nom `thumb-snap`. Un slot vide ne prend
aucune place, et ce qu’on y met est espacé comme le reste de l’outil.

Les briques de base – `parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`, `transformImage`,
`findContentRect`, `extractPalette`, `createZip` et d’autres – sont aussi exportées, pour un usage sans
l’interface.

## Structure

```
src/
├── core/       liens, fichiers du CDN, chargement et vérification, oEmbed, recadrage, conversion et couleurs, ZIP, noms de fichiers (sans interface)
├── i18n/       en (source), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         l’élément <thumb-snap> (Lit) – la langue et le thème de la page, l’état d’une vidéo, les modèles, les styles
├── index.ts    l’API publique ; n’enregistre rien
└── auto.ts     le point d’entrée du bundle ; enregistre <thumb-snap>
tests/          Vitest – liens, fichiers, ZIP, recadrage, oEmbed, les catalogues, le choix de la meilleure taille
docs/           ce que fournit YouTube, et ces README
index.html      la page de démo
```

Chaque catalogue a les mêmes clés et les mêmes espaces réservés que `en.ts` ; le vérificateur de types et les
tests y veillent.

## Limites

- YouTube ne documente aucun de ces fichiers. Ce qui existe, et où, peut changer.
- Une miniature mise en ligne se distingue d’une miniature générée automatiquement par comparaison des octets avec
  `hq1`–`hq3`. Si le créateur a choisi une autre suggestion de Studio, la miniature passe elle aussi pour une
  miniature mise en ligne.
- Les fichiers WebP de YouTube peuvent seulement être ouverts : sans CORS, la page ne peut ni les enregistrer ni
  les convertir. Convertir un JPEG en WebP donne le même résultat.
- Les fichiers qui nécessitent les signatures de YouTube – la couverture verticale d’un Short, les aperçus
  animés, les storyboards – ainsi que les playlists ou chaînes entières sont hors de portée sans serveur.
- La vérification de fichiers inexistants laisse des erreurs 404 dans la console du navigateur.
