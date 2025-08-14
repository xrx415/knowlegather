# Knowlegathor

Aplikacja do gromadzenia i organizowania wiedzy.

## Wymagania

- Node.js 18+
- npm 9+

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/xrx415/knowlegather.git
cd knowlegather
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skopiuj `.env.example` do `.env` i uzupełnij zmienne środowiskowe:
```bash
cp .env.example .env
```

4. Uruchom aplikację:
```bash
npm run dev
```

## Technologie

- React
- Vite
- Supabase
- TailwindCSS
- TypeScript

## Licencja

MIT

### Useful commands

#### Run Local Build Vite + Supabase
```bash
npx supabase start && docker-compose up
```

#### Full Restart Command
```bash
docker-compose down && npx supabase stop && npx supabase start && docker-compose up
```

### Usefull Links:
http://localhost:54327/dashboard - LOGFLARE jakiś fajny system do logów
