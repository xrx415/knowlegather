# Podsumowanie i Instrukcje - Knowlegather

## Wprowadzenie

Knowlegather to aplikacja do gromadzenia i organizowania wiedzy. Posiada frontend zbudowany w React/Vite oraz backend oparty na Supabase do zarządzania danymi i funkcjami. Poniżej znajdziesz instrukcje jak skonfigurować i uruchomić aplikację.

## Struktura projektu

- **Frontend:** React + Vite
- **Backend:** Supabase (PostgreSQL, Authentication, Edge Functions)
- **Deployment:** Docker + Caddy, Google Cloud Run
- **CI/CD:** GitHub Actions

## Konfiguracja Środowiska

### Wymagania Wstępne
- Node.js 20+
- Docker
- Google Cloud SDK
- Supabase CLI

### Klucze i Sekrety

1. **Klucze Supabase**
   - `VITE_SUPABASE_URL`: Link do projektu Supabase
   - `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_SERVICE_ROLE_KEY`: Klucze dostępu

2. **OpenRouter Klucze API**
   - `OPENROUTER_API_KEY`: Twój klucz API

## Konfiguracja CI/CD z GitHub Actions
### Secrets w GitHub Repository

**Krok po kroku:**

1. **Idź do swojego repo na GitHub:**
   - Otwórz https://github.com/xrx415/knowlegather

2. **Kliknij Settings (zakładka na górze)**

3. **W lewym menu kliknij "Secrets and variables"**

4. **Kliknij "Actions"**

5. **Kliknij "New repository secret"** i dodaj każdy z poniższych:

#### Secrets do dodania:

**`GCP_PROJECT_ID`**
- **Name:** `GCP_PROJECT_ID`
- **Value:** `knowlegather`

**`GCP_SA_KEY`**
- **Name:** `GCP_SA_KEY`  
- **Value:** Cały JSON z service account (skopiuj z `GITHUB_SECRETS_SETUP.md`)

**`VITE_SUPABASE_URL`**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://fyebojtynxasphohnrjh.supabase.co`

**`VITE_SUPABASE_ANON_KEY`**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Twój anon key z Supabase Dashboard

**`VITE_OPENROUTER_API_KEY`**
- **Name:** `VITE_OPENROUTER_API_KEY`
- **Value:** Twój klucz z OpenRouter

6. **Kliknij "Add secret"** dla każdego z nich

### Workflows
Twoje repozytorium posiada dwa główne workflow:

1. **Test Build (develop branch):**
   - Testuje build i odpowiadanie kontenera dla gałęzi develop

2. **Deploy to Cloud Run (main branch):**
   - Automatyczny deploy na Google Cloud Run z gałęzi main

## Uruchamianie Lokalnie

1. **Build Obrazu Dockera**
   ```bash
   docker build -f Dockerfile.prod \
     --build-arg VITE_SUPABASE_URL=https://fyebojtynxasphohnrjh.supabase.co \
     --build-arg VITE_SUPABASE_ANON_KEY="[anon_key]" \
     --build-arg VITE_OPENROUTER_API_KEY="[openrouter_key]" \
     -t knowlegather:local .
   ```

2. **Uruchamianie Kontenera**
   ```bash
   docker run -d -p 8080:80 --name knowlegather-local knowlegather:local
   ```

## Deployment Produkcyjny

1. **Merge do main**
2. **Automatyczne uruchomienie workflow:** Deploy to Google Cloud Run

## Troubleshooting

- **Problemy z kluczami i uprawnieniami:**
  Sprawdź konfigurację kluczy i uprawnień w Google Cloud Console

- **Błędy Deploymentu:**
  Sprawdź Cloud Run logs i GitHub Actions logs

## Monitorowanie i Logi

- **Google Cloud Console:** Dostęp do logów i statystyk Cloud Run
- **Supabase Dashboard:** Logi i statystyki Supabase

## Dalsze Kroki
- Skalowanie i optymalizacja produkcyjna
- Ulepszenie bezpieczeństwa
- Integracja z dodatkowymi API

