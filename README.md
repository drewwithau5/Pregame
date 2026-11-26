# Pregame 🍻

Mobile-first PWA for finding a bar by specific drink, pet, activity, TV and seating preferences.
Uses fictional Raleigh-area sample data. No backend yet.

## Run locally
```
npm install
npm run dev
```

## Deploy
1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo. It auto-detects Vite (build `npm run build`, output `dist`). Deploy.

## Install on your phone
- **iPhone (Safari):** open the Vercel URL → Share → **Add to Home Screen**.
- **Android (Chrome):** open the URL → menu → **Install app**.

## Where things live
- `src/main.js`: data layer (`RAW_BARS`, `BarService`), filter schema (`CATS`), matching engine, UI.
- For real data, replace the body of `BarService.getBars()` with an API call returning the same bar shape.
- `public/`: manifest, service worker, icons. Bump `V` in `public/sw.js` to force cached assets to refresh.
