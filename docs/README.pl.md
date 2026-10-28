<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="Ikona aplikacji"></p>

<h1 align="center">Ekstraktor miniatur i klatek z YouTube w przeglądarce</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <b>Polski</b> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

Komponent webowy, który przyjmuje linki do YouTube i znajduje wszystkie obrazy udostępniane przez YouTube dla
każdego filmu — miniaturę we wszystkich rozmiarach, klatki w proporcjach samego filmu i klatki, które YouTube
wybiera sam — do pobrania, skopiowania, przekonwertowania lub zapisania jako ZIP. Działa w całości
w przeglądarce: bez serwera, bez klucza API.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="ThumbSnap z wczytanym filmem: pole linku, opcje formatu i nazwy pliku oraz tytuł, kanał, plakietki, kolory i przyciski pobierania filmu"></p>

| Obrazy | Pliki | Rozmiar | Które filmy |
|---|---|---|---|
| Miniatura | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default` oraz `hq720`, gdy brakuje `maxresdefault` | od 1280×720 do 120×90 | każdy film; rozmiary 4:3 mają czarne pasy, a filmy przesłane w niskiej rozdzielczości nie mają 1280×720 ani 640×480 |
| Klatki w oryginalnych proporcjach | `oar1`–`oar3` oraz `frame0` (pierwsza klatka) | 1080×1920 w Shorts, w pozostałych filmach do 1920×1080 | Shorts i starsze filmy; nowsze zwykłe filmy mają tylko `frame0` |
| Klatki automatyczne | `1`–`3` w pięciu rozmiarach, największe to `maxres1`–`maxres3` | od 1280×720 do 120×90 | każdy film oprócz transmisji na żywo |
| Wersje WebP | rozmiary miniatury, w `vi_webp` | jak miniatura | tylko wyświetlanie i otwieranie — YouTube wysyła je bez CORS |

YouTube nie informuje, które z tych plików istnieją, więc ThumbSnap pyta o każdy plik i odczytuje odpowiedź:
brakujący wraca jako 404 z szarym obrazem zastępczym 120×90. Aby odróżnić przesłaną miniaturę od wygenerowanej
automatycznie, porównuje miniaturę z klatkami automatycznymi bajt po bajcie, a tytuł, kanał i to, czy film jest
pionowy, pobiera z endpointu oEmbed YouTube. To, co udało się ustalić, odpytując YouTube, opisano
w [docs/youtube-thumbnails.md](youtube-thumbnails.md).

Narzędzie jest dostępne w 13 językach — angielskim, koreańskim, japońskim, chińskim (uproszczonym
i tradycyjnym), niemieckim, hiszpańskim, francuskim, włoskim, portugalskim, polskim, indonezyjskim
i wietnamskim — i używa języka strony, na której się znajduje. W pozostałych językach wyświetla się po
angielsku. Dostosowuje się też do trybu ciemnego strony.

Kod źródłowy w tym repozytorium jest objęty licencją MIT. Nazwa ThumbSnap i jego ikona nie wchodzą w skład tego
kodu. Ikona na górze jest pokazana wyłącznie poglądowo: nie obejmuje jej licencja MIT i nie ma jej w komponencie
zbudowanym z tego repozytorium. ThumbSnap nie jest powiązany z YouTube ani Google, a miniatury należą do ich
twórców.

## Wypróbuj

ThumbSnap działa na [hobbyworker.me](https://hobbyworker.me/pl/tools/thumbsnap/) we wszystkich 13 językach.

## Wymagania

- Aktualna przeglądarka: Chrome lub Edge od wersji 111, Safari od wersji 16.4, Firefox od wersji 113.
- Dostęp do `i.ytimg.com` (obrazy) i `www.youtube.com` (oEmbed). Narzędzie nie łączy się z niczym innym.
- Kopiowanie obrazów i udostępnianie wymagają bezpiecznej strony — HTTPS lub `localhost`.

## Budowanie

```sh
npm install
npm run dev     # strona demonstracyjna z przełącznikami języka i motywu
npm test        # testy jednostkowe (Vitest)
npm run build   # dist/thumbsnap.js, jego mapa źródeł i THIRD_PARTY_LICENSES.txt
```

Budowanie i testy sprawdzono w Node.js 24.

`dist/thumbsnap.js` to pojedynczy moduł ES, który zawiera Lit i po załadowaniu rejestruje `<thumb-snap>`.
Rozpowszechniaj go razem z `THIRD_PARTY_LICENSES.txt`.

## Korzystanie

1. Wklej jeden lub kilka linków do YouTube albo identyfikatorów filmów. Działają linki watch, `youtu.be`,
   Shorts, live, embed i `music.youtube.com`, a w przypadku playlisty wczytywany jest jej film okładkowy.
   Wklejony link wczytuje się od razu; kilka linków wpisz po jednym w wierszu albo upuść link na narzędzie.
2. Miniatura jest dostępna we wszystkich rozmiarach, jakie ma YouTube — każdy z rzeczywistymi wymiarami
   i rozmiarem pliku — a największy jest oznaczony jako **Najlepsza**.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="Sekcja „Miniatury”: pięć rozmiarów od 1280×720 do 120×90, największy oznaczony jako „Najlepsza”, każdy z przyciskami pobierania, kopiowania, linku, udostępniania i otwierania"></p>
3. **Klatki w oryginalnych proporcjach** to klatki zapisane przez YouTube w proporcjach samego filmu —
   w przypadku filmu Shorts są to trzy pionowe klatki 1080×1920 i jego pierwsza klatka.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Klatki w oryginalnych proporcjach filmu Shorts: trzy klatki 1080×1920 i pierwsza klatka 268×480"></p>
4. **Klatki automatyczne** to trzy klatki, które YouTube wybiera sam; liczby pod każdą z nich przełączają ją
   między pięcioma rozmiarami.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="Klatki automatyczne od 1 do 3 w rozmiarze 1280×720, z przyciskami rozmiarów 1280, 640, 480, 320 i 120"></p>
5. Każdy obraz można pobrać, skopiować jako obraz, skopiować jego adres, udostępnić (jeśli urządzenie potrafi
   udostępniać pliki) albo otworzyć. **Pobierz najlepszą** i **Pobierz wszystko (ZIP)** obejmują cały film; przy
   kilku filmach **Pobierz wszystkie filmy (ZIP)** umieszcza każdy w osobnym folderze.
6. **Format** konwertuje do PNG lub WebP (dostępne są tylko formaty, które przeglądarka potrafi zakodować),
   **Usuń czarne pasy** wycina czarne pasy z obrazów 4:3, a **Nazwa pliku** używa identyfikatora filmu albo
   tytułu i identyfikatora.
7. **Kod do osadzenia** zawiera Markdown i HTML klikalnej miniatury. Pasek adresu zachowuje `?v=`, więc wynik
   można udostępnić, a ostatnie filmy są zapamiętywane w przeglądarce.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="Kod do osadzenia: Markdown, HTML i URL obrazu, każdy z przyciskiem „Kopiuj”"></p>

## Osadzanie na stronie

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Atrybut | Domyślnie | |
|---|---|---|
| `locale` | najbliższy atrybut `lang` | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`; tagi takie jak `zh-TW` czy `pt-BR` są przypisywane do odpowiedniego języka |
| `theme` | `auto` | `auto` kieruje się atrybutem `data-theme`, `data-color-scheme` lub `data-bs-theme` elementu `<html>`, jego klasą `dark` lub `light` albo jego `color-scheme`, a potem ustawieniem systemu; `light` i `dark` ustawiają motyw na stałe |
| `value` | | linki lub identyfikatory do wczytania na starcie |
| `no-url-sync` | wyłączony | nie zmienia `?v=` ani `?list=` w pasku adresu |
| `no-history` | wyłączony | nie zapisuje ostatnich filmów w `localStorage` |
| `max-videos` | `20` | maksymalna liczba filmów wczytywanych naraz |

- Właściwości niestandardowe CSS: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`,
  `--thumbsnap-font`.
- Każda akcja wywołuje zdarzenie `thumbsnap` z włączonymi `bubbles` i `composed`. Jego `detail` to
  `{ action, videoId?, variant?, format?, count? }`, a `action` to `resolve`, `download`, `download-zip`,
  `copy-image`, `copy-text`, `share` lub `error`.
- `load(text)` wczytuje linki tak, jakby zostały wpisane; `clear()` czyści narzędzie.
- Zawartość z atrybutem `slot="footer"` wyświetla się pod narzędziem. Zamiast tego podklasa może nadpisać
  `renderFooter()`: zaimportuj `src/index.ts`, który niczego nie rejestruje, i zarejestruj element za pomocą
  `defineThumbSnap()`.

Eksportowane są też elementy składowe — `parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`,
`transformImage`, `findContentRect`, `extractPalette`, `createZip` i inne — do użycia bez interfejsu.

## Struktura

```
src/
├── core/       linki, pliki z CDN, wczytywanie i sprawdzanie, oEmbed, przycinanie, konwersja i kolory, ZIP, nazwy plików (bez interfejsu)
├── i18n/       en (źródło), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         element <thumb-snap> (Lit) — język i motyw strony, stan jednego filmu, szablony, style
├── index.ts    publiczne API; niczego nie rejestruje
└── auto.ts     punkt wejścia bundla; rejestruje <thumb-snap>
tests/          Vitest — linki, pliki, ZIP, przycinanie, oEmbed, katalogi, wybór najlepszego rozmiaru
docs/           co udostępnia YouTube, oraz te pliki README
index.html      strona demonstracyjna
```

Każdy katalog ma te same klucze i symbole zastępcze co `en.ts`; pilnują tego kontrola typów i testy.

## Ograniczenia

- YouTube nie dokumentuje żadnego z tych plików. To, co istnieje i gdzie, może się zmienić.
- Przesłaną miniaturę odróżnia się od wygenerowanej automatycznie, porównując bajty z `hq1`–`hq3`. Jeśli
  twórca wybrał w Studio inną z proponowanych klatek, to również wygląda jak przesłana miniatura.
- Pliki WebP z YouTube można tylko otworzyć: bez CORS strona nie może ich zapisać ani przekonwertować.
  Konwersja JPEG do WebP daje ten sam wynik.
- Nowsze zwykłe filmy nie mają klatek w oryginalnych proporcjach, więc te trzy karty pokazują „Niedostępne”.
- Pliki wymagające podpisów YouTube — pionowa okładka filmu Shorts, animowane podglądy, storyboardy — oraz całe
  playlisty czy kanały są bez serwera poza zasięgiem.
- Sprawdzanie nieistniejących plików zostawia błędy 404 w konsoli przeglądarki.
