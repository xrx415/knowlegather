# Notatka - Naprawienie testów automatycznych

## Data: 2025-07-28

## Problemy zidentyfikowane:

1. **Błędna konfiguracja Jest:**
   - `moduleNameMapping` jest nieprawidłową właściwością
   - Powinna być `moduleNameMapper`

2. **Błąd TypeScript JSX:**
   - Brak flagi `--jsx` w konfiguracji TypeScript
   - Wszystkie komponenty React nie mogą być przetworzone

3. **Brakujące zmienne środowiskowe:**
   - `SUPABASE_ANON_KEY` nie jest ustawiony dla testów
   - Inne klucze Supabase mogą być niedostępne

4. **Błędy testów API:**
   - Testy wywołań API zwracają `undefined` response
   - Problemy z asynchronicznymi wywołaniami

5. **Ostrzeżenia deprecacji:**
   - Potrzeba ustawienia `esModuleInterop: true` w tsconfig.json
   - Stara konfiguracja ts-jest w `globals`

## Kroki naprawcze do wykonania:

### 1. Poprawienie jest.config.js
- [x] Zmiana `moduleNameMapping` na `moduleNameMapper`
- [x] Aktualizacja konfiguracji ts-jest

### 2. Aktualizacja tsconfig.json
- [x] Dodanie wsparcia JSX
- [x] Ustawienie `esModuleInterop: true`

### 3. Konfiguracja zmiennych środowiskowych
- [x] Utworzenie .env.test z kluczami testowymi
- [x] Skonfigurowanie Jest do ładowania zmiennych

### 4. Naprawienie testów API
- [x] Dodanie proper error handling
- [x] Mocki dla zewnętrznych wywołań

### 5. Weryfikacja
- [x] Uruchomienie testów ponownie
- [x] Sprawdzenie coverage

## Status: W TRAKCIE REALIZACJI
