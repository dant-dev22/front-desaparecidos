# Enjoy your world cup — Frontend

**Mobile-first** web app themed for the **FIFA World Cup** (2026 hosts: Mexico · USA · Canada). Users complete a safety check-in; the client talks to **`/locations` and `/risk` over HTTP**, shows risk stats, similar cases from the registry, and optional WhatsApp sharing by city.

The app:

- Greets users with **Enjoy your world cup** (*Want to know your chances of getting home safely?*).
- Auto-detects approximate area (Geolocation + Nominatim) and, when labels match the catalog from **`GET /locations`**, can pre-fill state/municipality; otherwise the user picks rows from the selectors.
- Sends **`GET /risk`** with `estado` / `municipio_id`, `edad`, `sexo`, optional `estatura`, etc.
- Shows a result card with score, level, and similar-case count, plus a modal with thumbnails/details when available.
- **WhatsApp share** includes the city name and a Google Maps city search link (no exact GPS coordinates in the text).

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** — World Cup palette (Mexico green, red, USA navy, trophy gold), Bebas Neue / Oswald + Inter
- **Geolocation** + **Nominatim** reverse geocoding (no API key)
- **`fetch`** only for HTTP

## Project layout

```
front-desaparecidos/
├── ecosystem.config.cjs     # PM2: vite preview (production preview server)
├── index.html               # SEO, OG/Twitter, JSON-LD
├── vite.config.ts           # Dev proxy /api → VITE_API_BASE_URL
├── tailwind.config.js       # Palette + animations
├── postcss.config.js
├── tsconfig*.json
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── brand.ts
│   ├── index.css
│   ├── types.ts
│   ├── api/
│   │   ├── locations.ts
│   │   ├── risk.ts
│   │   └── geocoding.ts
│   ├── hooks/
│   └── components/
└── README.md
```

## Local setup

Requires **Node.js 18+** and **npm**.

```bash
cd front-desaparecidos
cp .env.example .env       # Windows: copy .env.example .env
npm install
npm run dev
```

Dev server: `http://localhost:5173`. On your phone (same LAN): `http://<your-LAN-IP>:5173`.

### Production build (local smoke test)

```bash
npm run build
npm run preview        # serves dist/ — default preview port in this repo matches PM2 (4173)
```

## Configuration

Copy `.env.example` → `.env` (or `.env.production` for `npm run build`). Variables prefixed with **`VITE_`** are inlined at **build time** — rebuild after changing them.

| Variable | Description | Typical default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Origin of the HTTP API (`/locations`, `/risk`), no trailing slash | _(see `.env.example`)_ |
| `VITE_API_PREFIX` | Empty: browser calls `VITE_API_BASE_URL` directly. `/api`: in **`npm run dev` only**, requests go to same origin `/api/*` via Vite proxy to `VITE_API_BASE_URL`. | _(empty in production)_ |

## Actualizar el front en el VPS (PM2)

Asunciones: ya clonaste el repo en el servidor, tienes **Node.js 18+**, **PM2** instalado (`npm install -g pm2`) y usas **`ecosystem.config.cjs`** como en este proyecto (sirve el build estático con **`vite preview`** en **`127.0.0.1:4173`**, típicamente detrás de Nginx u otro reverse proxy SSL).

Variables de entorno: si usás `.env` o `.env.production`, ajustalas **antes** del build (`npm run build` embebe `VITE_*` en los assets).

Pasos rutinarios después de cambios en el código:

```bash
cd /ruta/al/front-desaparecidos          # tu ruta real en el VPS
git pull                                 # o el flujo que uses (deploy key, CI, etc.)
npm ci                                   # o npm install
npm run build
pm2 reload ecosystem.config.cjs --update-env
```

Equivalente si solo querés reiniciar la app por nombre:

```bash
pm2 reload front-desaparecidos --update-env
```

**Primera vez** en ese servidor:

```bash
cd /ruta/al/front-desaparecidos
npm ci && npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup                            # sigue las instrucciones para habilitar al boot
```

Comprobar proceso y logs:

```bash
pm2 status
pm2 logs front-desaparecidos
```

Reverse proxy: exponé públicamente HTTPS y reenviá el tráfico al puerto donde escucha **`vite preview`** (en este proyecto, **4173** en localhost). Mantener `listen 127.0.0.1` en PM2 reduce exposición innecesaria.

## Reverse geocoding (Nominatim)

Las peticiones salen desde el navegador a `https://nominatim.openstreetmap.org`. Respetá su política de uso (no hagas scraping agresivo; una petición por detección de ciudad es razonable).

## Geolocation and WhatsApp sharing

- **HTTPS:** sin HTTPS (o localhost), la geolocalización suele fallar en móviles — conviene TLS en producción.
- **Catálogo:** las etiquetas GPS deben corresponder entradas del JSON de **`/locations`**; si no encajan, el usuario elige estado y municipio a mano.
- **WhatsApp:** `wa.me` con texto + enlace Maps por nombre de ciudad.

## Accessibility & SEO

- Landmark semánticos, `dialog` accesible, `aria-live` donde aplica.
- Meta tags y JSON-LD en `index.html`.

## Troubleshooting

| Síntoma | Posible causa | Qué hacer |
| --- | --- | --- |
| `Failed to fetch` | API caída, URL mal en build, firewall | Verificar `VITE_API_BASE_URL`, que el servidor responda, y redes |
| Respuestas bloqueadas por navegador (CORS) | Origen del front ≠ origen configurado del API | Ajustar cabeceras CORS en **el servidor del API** para tu dominio |
| Ciudad siempre vacía | Permisos o sitio sin HTTPS | Permitir ubicación; servir con TLS |
| Geocoding falla | Límite o error de Nominatim | Reintentar con calma |
| Respuestas 4xx del API | Payload inválido o combo fuera de catálogo | Revisar selects y parámetros |
| Timeouts 5xx/504 | Instabilidad red o API | Reintentar; revisar salud del servicio remoto |

## License

MIT.
