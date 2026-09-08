# Base44 Dev Environment

## What this app is
A Vite + React frontend ("Circles of Giving" / VolunteerHub) that connects to a **hosted Base44 backend**. There is no backend in this repo — all data, auth, and functions are served by the Base44 platform at `VITE_BASE44_APP_BASE_URL`.

## Running it
```
docker compose -f docker-compose.base44.yml up -d
```
- Node 22 base image, source bind-mounted, `npm install` + `npx vite --host 0.0.0.0 --port 5173` on startup.
- Host port 3000 → container 5173.
- Vite live-reload is active; edits appear without rebuilds.

## Required environment variables
| Var | Purpose |
|-----|---------|
| `VITE_BASE44_APP_ID` | Identifies the app to the Base44 backend |
| `VITE_BASE44_APP_BASE_URL` | Base44 backend URL (the `@base44/vite-plugin` proxies `/api` here) |
| `VITE_BASE44_FUNCTIONS_VERSION` | Optional; defaults to `v1` |

Placeholders live in `.env.base44-defaults` (first `env_file` entry). Real values are delivered via `/run/base44/app.env` (last `env_file` entry, always wins).

## Verifying
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → 200
- With placeholder credentials the page loads but API calls to the Base44 backend will fail; replace with real values for full functionality.
