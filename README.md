# Home Run 2026 — Frontend

A **mobile-first web app** themed for the **FIFA World Cup 2026** (Mexico · USA · Canada). Fans fill a blunt check-in; the frontend calls the **risk API** (FastAPI backend) that scrapes whichever **public disappearance registry** feeds it server-side — no sanitized branding in the UI, just “we’re tossing your profile against the missing-person roster.”

The app:

- Greets the user with a World Cup pop-up — *"Welcome to the World Cup! Want to know your chances of getting home?"*.
- Auto-detects the device location (Geolocation API + Nominatim) and tries to match **state/municipality** entries from `GET /locations` when GPS labels align; otherwise the user picks catalogue rows manually — the UI never free-text guesses IDs.
- Submits `GET /risk` with **`estado` + `municipio_id`** (from `GET /locations`), plus `edad`, `sexo`, optional `estatura`, `colonia`, and optional `municipio_nombre` for readable labels.
- Shows a result card with score, risk level, and similar-case count.
- Opens a modal with **up to 3 similar rows** surfaced from that registry snapshot (photo, name-ish label, disappearance age, opaque file ids).
- Offers a one-tap **WhatsApp live-location share** that lets the user pick a chat and send a Google Maps link to a fresh GPS fix.

> Public disappearance-registry payloads only · Crude-awareness copy in the bundle · FIFA does not sponsor this carnival.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** with a custom World Cup 2026 palette (Mexico green, red, USA navy, trophy gold) and stadium-style typography (Bebas Neue / Oswald + Inter)
- **Browser Geolocation API** + Nominatim reverse geocoding (no API key needed)
- **Native fetch**, no extra HTTP libraries
- Mobile-first responsive layout, AA-style focus rings, animated spinner with all four WC colors, semantic landmarks, SEO meta tags + JSON-LD

## Project layout

```
front-desaparecidos/
├── index.html               # SEO meta tags, OG/Twitter cards, JSON-LD
├── vite.config.ts           # Dev proxy /api → backend (avoids CORS)
├── tailwind.config.js       # World Cup palette + animations
├── postcss.config.js
├── tsconfig*.json
├── public/
│   └── favicon.svg          # Soccer-ball + WC palette
├── src/
│   ├── main.tsx
│   ├── App.tsx              # View state machine (welcome/form/loading/result)
│   ├── index.css            # Tailwind layers + reusable component classes
│   ├── types.ts
│   ├── api/
│   │   ├── risk.ts          # GET /risk client
│   │   └── geocoding.ts     # Nominatim reverse geocode → host city
│   ├── hooks/
│   │   └── useGeolocation.ts
│   └── components/
│       ├── WelcomeModal.tsx
│       ├── RiskForm.tsx
│       ├── ResultCard.tsx
│       ├── SimilarCasesModal.tsx
│       ├── ShareLocationButton.tsx
│       └── Spinner.tsx
└── README.md
```

## Local setup

Requires **Node.js 18+** and **npm**.

```bash
cd front-desaparecidos
cp .env.example .env       # On Windows: copy .env.example .env
npm install
npm run dev
```

The dev server starts on `http://localhost:5173`. Open it on your phone (same Wi-Fi) using `http://<your-LAN-IP>:5173` for the real mobile experience.

### Backend API

By default `.env` points to the public FastAPI host **[estoyasalvo.com](https://estoyasalvo.com)** (`/locations`, `/risk`). You can confirm the catalog at [https://estoyasalvo.com/locations](https://estoyasalvo.com/locations).

To use the repo backend locally instead (`../app-desaparecidos/backend`), set `VITE_API_BASE_URL=http://127.0.0.1:8000` and optionally `VITE_API_PREFIX=/api`:

```bash
cd app-desaparecidos/backend
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS / Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Production build

```bash
npm run build
npm run preview        # serves dist/ on http://localhost:4173
```

## Configuration

`.env` (copied from `.env.example`):

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Absolute URL of the FastAPI backend | `https://estoyasalvo.com` |
| `VITE_API_PREFIX` | Prefix for API calls. Empty `""` hits `VITE_API_BASE_URL` directly (used for public backend + production builds). `/api` routes through the Vite dev proxy to that same base URL. | _(empty)_ |

## CORS notes

The public API at **estoyasalvo.com** allows browser calls from another origin (`allow_origins=["*"]`). The default frontend setup calls `https://estoyasalvo.com/locations` and `…/risk` directly (even on `npm run dev`), so normal CORS preflights apply and succeed.

Optional for **development only:**

1. **Vite proxy** — Set `VITE_API_PREFIX=/api`. `vite.config.ts` proxies `/api/*` → `VITE_API_BASE_URL`. The browser only talks to `http://localhost:5173`; no browser→API CORS. The proxy target defaults to **estoyasalvo.com** if `VITE_API_BASE_URL` is unset.

The FastAPI app uses CORS middleware like:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)
```

For a tighter posture, replace `["*"]` with your deployed frontend origin (e.g. `["https://homerun2026.example"]`). Because we don't send credentials, `allow_credentials=False` is fine.

The reverse-geocoding call goes to `https://nominatim.openstreetmap.org`, which sets permissive CORS by default — no extra config needed. Be courteous and don't hammer it; one request per check is plenty.

## Geolocation and WhatsApp sharing

- **Permissions:** Browsers only expose `navigator.geolocation` on **secure origins** (HTTPS or `localhost`). When deploying, serve the frontend over HTTPS or location detection silently fails on iOS Safari.
- **Reverse geocoding** returns whatever city Nominatim resolves for the user's coordinates. **Heads-up:** `estado` / municipio labels must normalize into the **`/locations` catalog** baked into the backend; if GPS guesses miss, pick combos manually — the machinery only queries where it has CVE-style coverage.
- **WhatsApp share** uses `https://wa.me/?text=...` with a fresh `getCurrentPosition` call so the link contains an up-to-the-second Google Maps fix. On mobile this opens the WhatsApp app and shows the chat picker; on desktop it opens WhatsApp Web. The Web platform doesn't expose WhatsApp's *Live Location* feature directly — the closest equivalent is sharing a Maps URL, which we do.

## Accessibility & SEO

- Semantic landmarks (`main`, `header`, `footer`, `article`, `dialog`).
- `aria-modal`, `aria-labelledby`, `role="progressbar"`, `aria-live="polite"` for the spinner.
- Focus-visible rings tuned for the WC palette.
- SEO meta tags in `index.html`: `<title>`, `description`, canonical link, Open Graph, Twitter card, `theme-color`, and a `WebApplication` JSON-LD block.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Failed to fetch` in dev | Backend not running | Start `uvicorn app.main:app --reload` |
| CORS error in prod | Backend allow-list missing your origin | Add the frontend origin to `allow_origins` in `backend/app/main.py` |
| Location stuck on "Pinging GPS…" | Permission denied or non-HTTPS host | Allow location, or serve over HTTPS |
| Reverse geocoding silently fails | Nominatim rate-limited the IP | Wait a minute, or self-host Nominatim |
| Validation `422`/bad query | Combo outside `/locations`, bad filters | Choose state+municipality from selects; tighten optional fields |
| `504` timeouts while pulling registry blobs | Backend waiting on upstream disappearance API | Tune whatever HTTP timeout env the backend exposes for that scrape |

## License

MIT.
