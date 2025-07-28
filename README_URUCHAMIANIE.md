# Instrukcja Uruchamiania - Knowlegather

## Wymagania Wstępne
- Zainstalowany Docker i Docker Compose
- Zainstalowany Supabase CLI

## Konfiguracja Projektu

1. **Klucz API Supabase**
   
   Otwórz plik `.env` i upewnij się, że poniższe wartości są prawidłowe:

   ```env
   VITE_SUPABASE_URL=https://fyebojtynxasphohnrjh.supabase.co
   VITE_SUPABASE_ANON_KEY=[production_anon_key]
   VITE_SUPABASE_SERVICE_ROLE_KEY=[production_service_key]
   OPENROUTER_API_KEY=[api_key]
   ```

2. **Zainicjalizuj Supabase**

    - Zaloguj się do Supabase:  

    ```bash
    $env:SUPABASE_ACCESS_TOKEN="sbp_fe2fce0c50dd3fb4c64bc2e019779a567725c880"
    npx supabase link --project-ref fyebojtynxasphohnrjh
    ```


3. **Migracje i Funkcje**  

   Uruchom migracje bazy danych:

   ```bash
   npx supabase db push
   ```

   Wdróż Edge Functions:

   ```bash
   npx supabase functions deploy
   ```

## Uruchamianie Aplikacji

1. **Build Obrazu Dockera**

   ```bash
   docker build -f Dockerfile.prod \
     --build-arg VITE_SUPABASE_URL=https://fyebojtynxasphohnrjh.supabase.co \
     --build-arg VITE_SUPABASE_ANON_KEY="[anon_key]" \
     --build-arg VITE_OPENROUTER_API_KEY="[openrouter_key]" \
     -t knowlegather:with-env .
   ```

2. **Uruchomienie Kontenera**

   ```bash
   docker run -d -p 8080:80 --name knowlegather-final-test knowlegather:with-env
   ```

3. **Dostęp**

   Aplikacja powinna być dostępna pod adresem:
   
   - `http://localhost:8080` dla lokalnego środowiska

## Troubleshooting

- **Check Logs:**

  ```bash
  docker logs knowlegather-final-test
  ```

- **Stop Container:**

  ```bash
  docker stop knowlegather-final-test
  docker rm knowlegather-final-test
  ```

## Monitoring i Dalsze Korki
- **Przygotowanie CI/CD z GitHub Actions
- **Deploy na Google Cloud Run"
