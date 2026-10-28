<p align="center"><img src="../.github/icon.png" width="128" height="128" alt="Ícone do app"></p>

<h1 align="center">Extrator de miniaturas e quadros do YouTube para a web</h1>

<p align="center">
  <img alt="Web Component" src="https://img.shields.io/badge/Web%20Component-custom%20element-29ABE2?logo=webcomponentsdotorg&logoColor=white">
  <img alt="Runs in the browser: no server, no API key" src="https://img.shields.io/badge/runs%20in%20the%20browser-no%20server%20·%20no%20API%20key-2EA44F">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white">
  <img alt="Lit 3" src="https://img.shields.io/badge/Lit-3-324FFF?logo=lit&logoColor=white">
  <a href="../LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.de.md">Deutsch</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.id.md">Bahasa Indonesia</a> · <a href="README.it.md">Italiano</a> · <a href="README.ja.md">日本語</a> · <a href="README.pl.md">Polski</a> · <b>Português (Brasil)</b> · <a href="README.vi.md">Tiếng Việt</a> · <a href="README.zh-Hans.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a></p>

Um componente web que recebe links do YouTube e encontra todas as imagens que o YouTube oferece para cada vídeo — a
miniatura em todos os tamanhos, quadros na proporção do próprio vídeo e os quadros que o YouTube escolhe sozinho —
para baixar, copiar, converter ou salvar em um ZIP. Funciona inteiramente no navegador: sem servidor e sem chave de
API.

<p align="center"><img src="../.github/screenshot.jpg" width="720" alt="ThumbSnap com um vídeo carregado: o campo do link, as opções de formato e de nome do arquivo, e o título, o canal, os selos, as cores e os botões de download do vídeo"></p>

| Imagens | Arquivos | Tamanho | Em quais vídeos |
|---|---|---|---|
| Miniatura | `maxresdefault` · `sddefault` · `hqdefault` · `mqdefault` · `default`, mais `hq720` quando falta o `maxresdefault` | de 1280×720 a 120×90 | todos os vídeos; os tamanhos 4:3 têm faixas pretas, e vídeos enviados em baixa resolução não têm 1280×720 nem 640×480 |
| Quadros na proporção original | `oar1`–`oar3` e `frame0` (o primeiro quadro) | 1080×1920 nos Shorts; nos demais, até 1920×1080 | Shorts e vídeos mais antigos; vídeos comuns recentes só têm `frame0` |
| Quadros automáticos | `1`–`3` em cinco tamanhos; os maiores são `maxres1`–`maxres3` | de 1280×720 a 120×90 | todos os vídeos, exceto transmissões ao vivo |
| Versões WebP | os tamanhos da miniatura, em `vi_webp` | os mesmos da miniatura | só são exibidas e abertas — o YouTube as envia sem CORS |

O YouTube não informa quais desses arquivos existem, então o ThumbSnap pede cada um e lê a resposta: um arquivo que
não existe volta como um 404 com uma imagem cinza de 120×90 no lugar. Ele compara byte a byte a miniatura com os
quadros automáticos para distinguir uma miniatura enviada de uma gerada automaticamente, e obtém do endpoint oEmbed
do YouTube o título, o canal e se o vídeo é vertical. O que se descobriu sondando o YouTube está registrado em
[docs/youtube-thumbnails.md](youtube-thumbnails.md).

A ferramenta está disponível em 13 idiomas — inglês, coreano, japonês, chinês (simplificado e tradicional), alemão,
espanhol, francês, italiano, português, polonês, indonésio e vietnamita — e segue o idioma da página em que está. Em
qualquer outro idioma, ela aparece em inglês. Também segue o modo escuro da página.

O código-fonte deste repositório está sob a licença MIT. O nome ThumbSnap e o seu ícone não fazem parte deste código.
O ícone no topo é mostrado apenas como referência: ele não está coberto pela licença MIT, e o que for compilado a
partir deste repositório não o inclui. O ThumbSnap não tem afiliação com o YouTube nem com o Google, e as miniaturas
pertencem aos seus criadores.

## Experimente

O ThumbSnap roda em [hobbyworker.me](https://hobbyworker.me/pt/tools/thumbsnap/), em todos os 13 idiomas.

## Requisitos

- Um navegador atual: Chrome ou Edge 111 ou posterior, Safari 16.4 ou posterior, Firefox 113 ou posterior.
- Acesso a `i.ytimg.com` (imagens) e `www.youtube.com` (oEmbed). Nenhum outro endereço é acessado.
- Para copiar imagens e compartilhar, é preciso uma página segura — HTTPS ou `localhost`.

## Compilação

```sh
npm install
npm run dev     # a página de demonstração, com seletores de idioma e tema
npm test        # testes unitários (Vitest)
npm run build   # dist/thumbsnap.js, o source map dele e THIRD_PARTY_LICENSES.txt
```

A compilação e os testes foram verificados no Node.js 24.

`dist/thumbsnap.js` é um único módulo ES que inclui o Lit e registra `<thumb-snap>` ao ser carregado. Distribua o
`THIRD_PARTY_LICENSES.txt` junto com ele.

## Como usar

1. Cole um ou mais links do YouTube ou IDs de vídeo. Funcionam links watch, `youtu.be`, Shorts, live, embed e
   `music.youtube.com`, e uma playlist traz o vídeo de capa dela. Um link colado carrega na hora; para vários, coloque
   um por linha, ou arraste e solte um link na ferramenta.
2. A miniatura aparece em todos os tamanhos que o YouTube tem, cada um com as dimensões reais e o tamanho do arquivo,
   e o maior é marcado como **Melhor**.
   <p align="center"><img src="../.github/thumbnails.jpg" width="720" alt="A seção Miniaturas: cinco tamanhos de 1280×720 a 120×90, o maior marcado como Melhor, cada um com botões para baixar, copiar, copiar a URL, compartilhar e abrir"></p>
3. Em **Quadros na proporção original** fica o que o YouTube capturou no formato do próprio vídeo — no caso de um
   Short, três quadros verticais de 1080×1920 e o primeiro quadro dele.
   <p align="center"><img src="../.github/shorts.jpg" width="720" alt="Quadros na proporção original de um Short: três quadros de 1080×1920 e um primeiro quadro de 268×480"></p>
4. Em **Quadros automáticos** ficam os três quadros que o YouTube escolhe sozinho; os números abaixo de cada um
   permitem alternar entre os cinco tamanhos dele.
   <p align="center"><img src="../.github/frames.jpg" width="720" alt="Quadros automáticos 1 a 3 em 1280×720, com os botões de tamanho 1280, 640, 480, 320 e 120"></p>
5. Cada imagem pode ser baixada, copiada como imagem, ter o endereço copiado, ser compartilhada (quando o dispositivo
   permite compartilhar arquivos) ou ser aberta. **Baixar a melhor** e **Baixar tudo (ZIP)** valem para o vídeo
   inteiro; com vários vídeos, **Baixar todos os vídeos (ZIP)** coloca cada um em uma pasta própria.
6. **Formato** converte para PNG ou WebP (só aparece o que o navegador consegue codificar), **Remover faixas pretas**
   corta essas faixas das imagens 4:3, e **Nome do arquivo** usa o ID do vídeo, ou o título e o ID.
7. **Código de incorporação** gera Markdown e HTML para uma miniatura clicável. A barra de endereço mantém `?v=`,
   então um resultado pode ser compartilhado, e os vídeos recentes ficam guardados no navegador.
   <p align="center"><img src="../.github/embed.jpg" width="720" alt="Código de incorporação: Markdown, HTML e a URL da imagem, cada um com um botão Copiar"></p>

## Como usar em uma página web

```html
<script type="module" src="thumbsnap.js"></script>
<thumb-snap></thumb-snap>
```

| Atributo | Padrão | |
|---|---|---|
| `locale` | o atributo `lang` mais próximo | `en` `ko` `ja` `zh-hans` `zh-hant` `id` `es` `fr` `pt` `vi` `de` `it` `pl`; tags como `zh-TW` ou `pt-BR` são convertidas para o idioma correspondente |
| `theme` | `auto` | `auto` segue `data-theme`, `data-color-scheme` ou `data-bs-theme` no `<html>`, a classe `dark` ou `light` dele, ou o `color-scheme` dele, e depois o sistema; `light` e `dark` fixam o tema |
| `value` | | links ou IDs para carregar no início |
| `no-url-sync` | desativado | não mexe em `?v=` e `?list=` na barra de endereço |
| `no-history` | desativado | não guarda vídeos recentes no `localStorage` |
| `max-videos` | `20` | o máximo de vídeos carregados de uma vez |

- Propriedades personalizadas de CSS: `--thumbsnap-accent`, `--thumbsnap-accent-hover`, `--thumbsnap-radius`,
  `--thumbsnap-font`.
- Cada ação dispara um evento `thumbsnap` com `bubbles` e `composed` ativados. O `detail` dele é
  `{ action, videoId?, variant?, format?, count? }`, e `action` é `resolve`, `download`, `download-zip`, `copy-image`,
  `copy-text`, `share` ou `error`.
- `load(text)` carrega links como se tivessem sido digitados; `clear()` limpa a ferramenta.
- O conteúdo com `slot="footer"` aparece abaixo da ferramenta. Como alternativa, uma subclasse pode sobrescrever
  `renderFooter()`: importe `src/index.ts`, que não registra nada, e registre o elemento com `defineThumbSnap()`.

Os blocos de construção — `parseTarget`, `extractTargets`, `imageUrl`, `loadImage`, `fetchOEmbed`, `transformImage`,
`findContentRect`, `extractPalette`, `createZip` e outros — também são exportados, para uso sem a interface.

## Estrutura

```
src/
├── core/       links, os arquivos da CDN, carregamento e sondagem, oEmbed, recorte, conversão e cores, ZIP, nomes de arquivo (sem interface)
├── i18n/       en (original), ko, ja, zh-hans, zh-hant, id, es, fr, pt, vi, de, it, pl
├── ui/         o elemento <thumb-snap> (Lit) — o idioma e o tema da página, o estado de um vídeo, templates, estilos
├── index.ts    a API pública; não registra nada
└── auto.ts     o ponto de entrada do bundle; registra <thumb-snap>
tests/          Vitest — links, arquivos, ZIP, recorte, oEmbed, os catálogos, a escolha do melhor tamanho
docs/           o que o YouTube oferece, e estes READMEs
index.html      a página de demonstração
```

Todos os catálogos têm as mesmas chaves e os mesmos placeholders que `en.ts`; o verificador de tipos e os testes
garantem isso.

## Limitações

- O YouTube não documenta nenhum desses arquivos. O que existe, e onde, pode mudar.
- Para distinguir uma miniatura enviada de uma automática, os bytes são comparados com `hq1`–`hq3`. Se o criador
  escolheu outra das sugestões do Studio, a miniatura também parece ter sido enviada.
- Os arquivos WebP do YouTube só podem ser abertos: sem CORS, a página não consegue salvá-los nem convertê-los.
  Converter um JPEG para WebP dá o mesmo resultado.
- Vídeos comuns recentes não têm quadros na proporção original, então esses três cartões mostram Indisponível.
- Arquivos que precisam das assinaturas do YouTube — a capa vertical de um Short, prévias animadas, storyboards — e
  playlists ou canais inteiros ficam fora de alcance sem um servidor.
- Verificar arquivos que não existem deixa erros 404 no console do navegador.
