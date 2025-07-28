# GitHub Secrets Setup - Knowlegather

## Wymagane Secrets w GitHub Repository

Idź do **Settings → Secrets and variables → Actions** w swoim repo GitHub i dodaj następujące secrets:

### 1. Google Cloud Platform Secrets

#### `GCP_PROJECT_ID`
Twój Google Cloud Project ID (np. `knowlegather-prod-123`)

#### `GCP_SA_KEY`
Klucz Service Account w formacie JSON. Jak go wygenerować:

1. Idź do [Google Cloud Console](https://console.cloud.google.com/)
2. **IAM & Admin → Service Accounts**
3. **Create Service Account** o nazwie `github-actions`
4. Nadaj uprawnienia:
   - `Cloud Run Admin`
   - `Storage Admin` 
   - `Container Registry Service Agent`
5. **Create Key** → JSON → Download
6. Skopiuj całą zawartość JSON do `GCP_SA_KEY`

### 2. Supabase Secrets

#### `VITE_SUPABASE_URL`
```
https://fyebojtynxasphohnrjh.supabase.co
```

#### `VITE_SUPABASE_ANON_KEY`
Anon public key z Supabase Dashboard → Settings → API

### 3. OpenRouter API Secret

#### `VITE_OPENROUTER_API_KEY`
Twój klucz API z [OpenRouter](https://openrouter.ai/)

## Workflow Strategy

### Branch `develop`
- **Trigger:** Push lub PR na `develop`
- **Akcje:** 
  - npm install & build test
  - Docker build test
  - Container smoke test
- **Cel:** Weryfikacja że kod się kompiluje i działa

### Branch `main`
- **Trigger:** Push lub PR na `main` 
- **Akcje:**
  - Docker build z production args
  - Push do Google Container Registry
  - Deploy na Google Cloud Run
  - Test deployment
- **Cel:** Automatyczny deploy na produkcję

## Testowanie CI/CD

1. **Dodaj secrets** w GitHub repo settings
2. **Push na develop** - powinien uruchomić test workflow
3. **Sprawdź Actions tab** czy build przechodzi
4. **Merge do main** - automatyczny deploy na Cloud Run!

## Przydatne Komendy

```bash
# Sprawdź status workflow lokalnie
gh workflow list

# Uruchom workflow ręcznie
gh workflow run "Deploy to Google Cloud Run"

# Zobacz logi z ostatniego uruchomienia
gh run list --limit 1
gh run view [RUN_ID]
```

## Troubleshooting

### Błąd "Invalid service account key"
- Sprawdź czy `GCP_SA_KEY` zawiera prawidłowy JSON
- Upewnij się że service account ma wymagane uprawnienia

### Błąd "Permission denied"
- Włącz Container Registry API w Google Cloud Console
- Sprawdź czy service account ma uprawnienia `Storage Admin`

### Błąd "Cloud Run service not found"  
- Upewnij się że `GCP_PROJECT_ID` jest prawidłowe
- Sprawdź czy region `europe-west1` jest dostępny

### Build nie uruchamia się
- Sprawdź czy wszystkie required secrets są ustawione
- Sprawdź składnię YAML w workflow files
