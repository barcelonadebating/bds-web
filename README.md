# Barcelona Debating Society — pàgina web

Pàgina web estàtica (HTML + CSS + JS, sense dependències), **trilingüe (CA / ES / EN)**.
Llesta per pujar a qualsevol hosting gratuït.

```
bds-web/
├── index.html        ← tota la pàgina (text marcat amb data-i18n)
├── css/styles.css    ← estils i paleta de marca (vermell del logo)
├── js/
│   ├── i18n.js       ← traduccions CA/ES/EN + dades (rols BP, mocions)
│   └── main.js       ← idiomes, esquema BP, carrusel, collage
└── assets/
    ├── logo.svg      ← logo vectorial (escala sense pixelar)
    └── gallery/      ← AQUÍ van les teves fotos del collage (1.jpg … 5.jpg)
```

## 1) Afegir les fotos (collage estil scrapbook de "La vida BDS")
No es poden baixar les fotos automàticament. Desa-les tu:

1. Desa fins a 8 fotos a `assets/gallery/` amb els noms **1.jpg … 8.jpg**.
2. Recarrega. Apareixen inclinades i superposades (com fotos enganxades). Mentre no hi
   siguin, es mostra un marcador vermell ("Foto 1", "Foto 2"…), no es trenca res.
   Pots afegir-ne o treure'n editant la secció `#vida` de `index.html`.

## Logo
Es fa servir el teu fitxer oficial `assets/logo-full.svg` tal qual (nav, hero, peu).
Sobre fons clars s'aplica `mix-blend-mode: multiply` perquè el fons blanc del fitxer
desaparegui i només es vegi el logo. El fitxer `assets/logo.svg` (icona) només s'usa per
a decoracions de fons molt subtils.

## 2) El formulari d'inscripció
Ja està **connectat** al vostre Google Form (incrustat a la secció "Curs introductori"),
de manera que les respostes cauen soles al full de càlcul de Drive vinculat al formulari.
Per canviar-lo, edita la URL de l'`<iframe>` a `index.html` (secció `#curs`).

## 3) Idiomes
El selector **CA · ES · EN** és a la barra de navegació. L'idioma es recorda al navegador.
Per editar els textos, tot és a `js/i18n.js` (un bloc per idioma). Els rols del debat BP
i les mocions també hi són (`I18N_BP` i `I18N_MOC`).

## 4) Tipografia
Capçaleres en **PT Serif** i text en **Open Sans** (Google Fonts).
> Nota: vau demanar *Open Sans Soft*, que no està disponible gratuïtament a Google Fonts.
> S'ha fet servir **Open Sans** (pràcticament idèntica). Si teniu el fitxer de la
> llicència d'Open Sans Soft, es pot afegir amb `@font-face` i canviar la variable `--sans`.

## 5) Provar-ho en local
```bash
npx serve bds-web
# o
python -m http.server -d bds-web 4321
```

## 6) Publicar-ho gratis
Arrossega la carpeta `bds-web` a **GitHub Pages**, **Netlify** o **Vercel**.

## Personalització ràpida
- **Colors**: a dalt de `css/styles.css` (`--red`, `--red-dark`, …).
- **Textos / dates / idiomes**: `js/i18n.js`.
- **Logo**: `assets/logo.svg`.
