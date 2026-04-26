# Dossier608 — aankondigingssite

Statische teaser-website. Aankondiging van publicatie op **6 juni 2026 om 06:06 (Europe/Amsterdam)**.

Doelgroep: pers, toezichthouders, juridische sector.

## Bestanden

- `index.html` — landingspagina (hero + cryptografische verankering + tijdlijn + stats + contact)
- `style.css` — sober donker thema, geen frameworks
- `countdown.js` — pure JavaScript countdown
- `.nojekyll` — schakelt Jekyll op GitHub Pages uit
- `_headers` — security headers (CSP, X-Frame-Options, Permissions-Policy)

## Publicatie via GitHub Pages

1. Maak een nieuwe repo `Dossier608` aan op github.com/WimLee115
2. Push de inhoud van deze map naar `main`
3. In repo-instellingen: Pages → Source = main branch / root
4. Site komt beschikbaar op `https://wimlee115.github.io/Dossier608/`
5. Optioneel: custom domein koppelen (bv. `dossier608.nl`)

## Verificatie

Het bewijs waarvan deze site refereert is cryptografisch verankerd in de Bitcoin-blockchain via OpenTimestamps. De SHA256-hash op de homepage verwijst naar het zittingsdossier d.d. 26 april 2026.

## Stijl-uitgangspunten

- **Sober** — geen sensatiezucht, geen Matrix-rain, geen overdreven taal
- **Cryptografisch onderbouwd** — hash + OpenTimestamps centraal
- **Feitelijk** — alleen verifieerbare data en cijfers
- **Toegankelijk** — semantic HTML, prefers-reduced-motion, mobile-responsive

— PrivacyVerzetNL & WimLee115
