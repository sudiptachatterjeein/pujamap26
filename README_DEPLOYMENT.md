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
| Setting | What it does |
|---|---|
| `SUPPORT_URL` | Where the Support button sends people (currently Buy Me a Chai) |
| `SUPPORT_QR` | The QR image shown in the Support sheet (`assets/support-qr.png`) |
| `MAHALAYA_PAGE_URL` | Page opened by the **Listen** buttons (currently your audio.com link) |
| `MAHALAYA_STREAM_URL` | **Optional.** A direct audio file or stream you have the right to play (mp3/aac/m3u8). When set, the app plays it in-app and can auto-start it at 4:00 AM for people who tapped "Alert me" |
| `WEATHER_LAT/LON` | Already Kolkata. No API key needed (Open-Meteo) |
| `AI_ENDPOINT` | Set to `""` to hide the AI box |

Do not paste an audio.com direct "mp3?X-Amz-Signature=..." address into `MAHALAYA_STREAM_URL`: those links expire after about 6 days.
Only public values belong in `config.js`. Never put a secret or service-role key in any file in this repo.

### How the Mahalaya 4:00 AM alert behaves
- A web page cannot wake a phone by itself. It works while the app is open on the phone (or as a notification if allowed).
- "Alert me at 4 AM" turns it on. At 4:00 AM IST on 10 Oct the app shows a banner and a notification; with `MAHALAYA_STREAM_URL` set it also starts the audio.
- Some phones block automatic sound. In that case the banner shows "Tap to start".
- "Remind me" downloads a calendar event with an alarm, which works even when the app is closed.

## 5. Check it works
- Open the site: weather card shows temperature, rain advice and hourly strip.
- Tap **EN / বাং** to switch language (remembered on the device).
- Open a pandal → **I'm here** → count updates.
- `/admin` → sign in → visitors appear within ~30 seconds.

## Updating after deploy
The app loads fresh files whenever the phone is online and uses its saved copy only when offline.
If you want to force-refresh old offline copies, bump `VERSION` in `sw.js` (e.g. `puja26-v3`).

## Notes
- Dark mode only, by design. English is the default; users can switch to বাংলা (remembered on the device).
- Bengali names were written by hand: please have a native reader skim them (`assets/i18n.js`, section `data`).
- Weather: Open-Meteo forecasts up to 16 days ahead, so Puja-day forecasts appear automatically as the dates come into range.
- The south / east / port / suburban maps are approximate sketches (as in the previous version).
