# Puja Map 2026 · v2 (dark mobile app, English + বাংলা, live Kolkata weather)

Static site + one optional serverless function. Deploy on **Vercel** (no build step).

## Files (must be at the ROOT of your GitHub repo)
```
index.html  admin.html  manifest.webmanifest  sw.js  vercel.json  package.json
assets/      (css, js, icons, data)
api/concierge.js            (optional AI route helper)
supabase-schema.sql  supabase-photos.sql
```

## 1. Supabase (skip if already done and working)
1. SQL Editor → run all of `supabase-schema.sql`, then `supabase-photos.sql`.
2. Authentication → Users → add your admin email + password.
3. Run once with your email:
   `insert into public.admins (email) values (lower('YOUR_ADMIN_EMAIL')) on conflict do nothing;`

## 2. GitHub
Upload the **contents** of this folder (not an extra outer folder) and commit.
The repo's front page must show `index.html`, `vercel.json`, `assets`, `api`.

## 3. Vercel
1. vercel.com → **Add New… → Project** → import the GitHub repo.
2. Framework Preset: **Other**. Build Command: *(empty)*. Output Directory: *(empty)*. Root Directory: `./`.
3. Click **Deploy**. Every later commit to GitHub redeploys automatically.
4. *(Optional AI helper)* Project → Settings → Environment Variables → add `ANTHROPIC_API_KEY`, then Redeploy.
   Without it, the app still works; the "Ask the Puja guide" box just says it is unavailable.

## 4. Things you set in `assets/config.js`
| Setting | What to do |
|---|---|
| `MAHALAYA_STREAM_URL` | Paste the **authorized** live stream URL (MP3/AAC/HLS) before 10 Oct 2026 |
| `UPI_ID` / `UPI_NAME` | Your UPI details for the Support QR |
| `WEATHER_LAT/LON` | Already Kolkata; no API key needed (Open-Meteo) |
| `AI_ENDPOINT` | Set to `""` to hide the AI box completely |

Only **public** values belong in `config.js`. Never put a secret or service-role key in any file in this repo.

## 5. Check it works
- Open the site: weather card shows temperature, rain advice and hourly strip.
- Tap **EN / বাং** to switch language (remembered on the device).
- Open a pandal → **I'm here** → count updates.
- `/admin` → sign in → visitors appear within ~30 seconds.

## Updating after deploy
`sw.js` caches the app for offline use. When you change files, bump `VERSION` in `sw.js` (e.g. `puja26-v2`)
and the `?v=` numbers in `index.html` so phones pick up the new version.

## Notes
- Dark mode only, by design.
- Bengali names were written by hand: please have a native reader skim them (`assets/i18n.js`, section `data`).
- Weather: Open-Meteo forecasts up to 16 days ahead, so Puja-day forecasts appear automatically as the dates come into range.
- The south / east / port / suburban maps are approximate sketches (as in the previous version).
