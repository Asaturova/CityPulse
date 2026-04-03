## CityPulse (MVP)

Smart City Dashboard MVP for Almaty, Kazakhstan.

### Stack
- Next.js (App Router), TypeScript
- Tailwind CSS
- shadcn/ui primitives
- Mapbox (`react-map-gl`)
- Open-Meteo APIs (weather + air quality)

### Setup

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
npm install
npm run dev
```

Open `http://localhost:3000`.

### Architecture

- `components/` UI and map components
- `hooks/` dashboard state composition
- `services/` API + mocks + analytics
- `types/` domain models
- `utils/` i18n and helpers

UI does not call external APIs directly; data is fetched and normalized in `services/`.

### Data sources
- Real: Open-Meteo weather, Open-Meteo air-quality
- Mocked: traffic, cameras, seismic, AI insights/recommendations

### Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```
