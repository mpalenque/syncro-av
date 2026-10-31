# Synchrony — página de la charla

Sitio estático (HTML + CSS + JS, sin build). Videos en loop, sin sonido, cortados de tu portfolio.

```
syncro-av/
├── index.html      ← textos + ID de Google Analytics (línea 22)
├── styles.css
├── main.js         ← carga perezosa de videos + eventos de Analytics
└── assets/
    ├── video/      hero.mp4, particles.mp4, perfo.mp4
    └── img/        posters, retrato, fotos del collage, og.jpg (preview al compartir el link)
```

Total ≈ 6 MB. Los videos de secciones solo se descargan cuando el visitante se acerca a ellos.

## 1. Publicar en GitHub Pages

Opción A — dentro de tu repo actual (la más simple):

1. Abrí `github.com/mpalenque/mpalenque.github.io`.
2. **Add file → Upload files** y arrastrá la carpeta `syncro-av` entera.
3. Commit. En 1–2 minutos queda en **https://mpalenque.github.io/syncro-av/**

Opción B — repo nuevo llamado `syncro-av`:

1. Creá el repo público `syncro-av` y subí el *contenido* de la carpeta (index.html en la raíz).
2. **Settings → Pages → Branch: main / root → Save**.
3. Queda en la misma URL: **https://mpalenque.github.io/syncro-av/**

Si la publicás en otra URL, actualizá `og:url` y `og:image` en `index.html` (líneas 14–15).

## 2. Google Analytics 4

1. Entrá a **analytics.google.com → Admin → Create → Property**. Nombre: *Synchrony*, zona horaria Buenos Aires.
2. Elegí **Web**, URL `mpalenque.github.io`, nombre del stream *Synchrony*. Dejá activado *Enhanced measurement*.
3. Copiá el **Measurement ID** (`G-XXXXXXXXXX`).
4. En `index.html`, línea 22, reemplazá el placeholder:
   ```js
   window.GA_MEASUREMENT_ID = 'G-TU_ID_ACA';
   ```
   Commit. Mientras quede el placeholder, no se carga ni se envía nada.
5. Verificá: abrí la página y mirá **Reports → Realtime**. Tenés que aparecer vos.

Qué vas a ver:

| Dato | Dónde |
|---|---|
| Visitas, países, ciudades | Reports → Realtime / Demographics |
| Scroll hasta el final, links externos | Automático (Enhanced measurement) |
| `view_contact_section` | El visitante llegó a la sección de contacto |
| `contact_email_click` | Clic en tu email |

Marcá `contact_email_click` como **key event** (Admin → Events, aparece después del primer clic) para verlo como conversión.

Los reportes estándar tardan 24–48 h en llenarse; Realtime es inmediato.

## 3. Saber qué lugar entró

Mandale a cada lugar un link con su nombre:

```
https://mpalenque.github.io/syncro-av/?utm_source=pioneer-works&utm_medium=email&utm_campaign=nyc
https://mpalenque.github.io/syncro-av/?utm_source=harvestworks&utm_medium=email&utm_campaign=nyc
```

En **Reports → Acquisition → Traffic acquisition**, cambiá la dimensión a *Session source* y vas a ver cada lugar por separado. Usá siempre minúsculas y guiones.

## 4. Cambios rápidos

- **Textos**: todo está en `index.html`.
- **Cambiar un video**: reemplazá el `.mp4` en `assets/video/` con el mismo nombre. Conviene que sea H.264, sin audio, 5–15 s. Ejemplo con ffmpeg:
  ```
  ffmpeg -ss 10 -t 8 -i original.mov -an -vf scale=1280:-2 -c:v libx264 -crf 28 -pix_fmt yuv420p -movflags +faststart hero.mp4
  ```
- **Probar local**: abrí `index.html` en el navegador (los videos funcionan sin servidor).
