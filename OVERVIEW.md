# Przegląd Projektu

## Struktura Projektu

### 📁 Główne Katalogi

- `src/` - Główny katalog z kodem źródłowym
  - `components/` - Komponenty React
    - `ai/` - Komponenty związane z AI
      - `AiChat.tsx` - Komponent czatu z asystentem AI
    - `resources/` - Komponenty do zarządzania zasobami
      - `ResourceItem.tsx` - Komponent wyświetlający pojedynczy zasób
    - `collections/` - Komponenty do zarządzania kolekcjami
      - `CollectionCard.tsx` - Komponent wyświetlający kartę kolekcji
    - `ui/` - Podstawowe komponenty UI
  - `pages/` - Strony aplikacji
    - `collections/` - Strony związane z kolekcjami
      - `CollectionsPage.tsx` - Strona główna kolekcji
      - `CollectionDetailPage.tsx` - Strona szczegółów kolekcji
    - `resources/` - Strony związane z zasobami
      - `ResourceViewer.tsx` - Komponent do przeglądania zasobów
  - `stores/` - Store'y zarządzające stanem aplikacji
  - `layouts/` - Układy stron
  - `lib/` - Biblioteki i narzędzia pomocnicze

### 🛠️ Konfiguracja Projektu

- `package.json` - Zależności i skrypty npm
- `vite.config.ts` - Konfiguracja Vite
- `tsconfig.json` - Konfiguracja TypeScript
- `tailwind.config.js` - Konfiguracja Tailwind CSS
- `docker-compose.yml` - Konfiguracja Docker
- `Dockerfile` - Instrukcje budowania obrazu Docker

## Technologie

- React + TypeScript
- Vite jako bundler
- Tailwind CSS do stylowania
- Docker do konteneryzacji
- Supabase jako backend

## Główne Funkcjonalności

### 🤖 Asystent AI

#### Czat z AI (`src/components/ai/AiChat.tsx`)
- Interaktywny czat z asystentem AI
- Możliwość przeciągania okna czatu
- Kontekstowa pomoc dla kolekcji i zasobów
- Zapamiętywanie pozycji okna
- Obsługa błędów i stanu ładowania

#### Podsumowania AI (`src/pages/resources/ResourceViewer.tsx`)
- Generowanie podsumowań treści zasobów
- Przycisk "Podsumuj z AI" w interfejsie zasobu
- Wyświetlanie podsumowania w specjalnym bloku
- Obsługa błędów podczas generowania podsumowania

### 📚 Zarządzanie Kolekcjami

#### Lista Kolekcji (`src/pages/collections/CollectionsPage.tsx`)
- Wyświetlanie wszystkich kolekcji
- Filtrowanie i wyszukiwanie
- Tworzenie nowych kolekcji
- Integracja z asystentem AI

#### Szczegóły Kolekcji (`src/pages/collections/CollectionDetailPage.tsx`)
- Zarządzanie zasobami w kolekcji
- Dodawanie nowych zasobów
- Edycja i usuwanie kolekcji
- Kontekstowa pomoc AI dla kolekcji

### 📝 Zarządzanie Zasobami

#### Przeglądarka Zasobów (`src/pages/resources/ResourceViewer.tsx`)
- Wyświetlanie treści zasobów
- Edycja zasobów
- Generowanie podsumowań AI
- Kopiowanie i pobieranie treści
- Obsługa różnych typów zasobów (URL, pliki, notatki)

## Jak Znaleźć Konkretne Funkcjonalności

### 🔍 Komponenty UI
Wszystkie komponenty interfejsu użytkownika znajdują się w katalogu `src/components/`. Każdy komponent jest w osobnym pliku i zawiera własne style oraz logikę.

### 📱 Strony
Strony aplikacji znajdują się w katalogu `src/pages/`. Każda strona jest osobnym komponentem React.

### 🔄 Zarządzanie Stanem
Store'y zarządzające stanem aplikacji znajdują się w katalogu `src/stores/`. Używają one prawdopodobnie biblioteki do zarządzania stanem (np. Zustand, Redux).

### 🎨 Style i Układ
- Style globalne: `src/index.css`
- Konfiguracja Tailwind: `tailwind.config.js`
- Układy stron: `src/layouts/`

## Jak Uruchomić Projekt

1. Zainstaluj zależności:
```bash
npm install
```

2. Uruchom w trybie deweloperskim:
```bash
npm run dev
```

3. Zbuduj wersję produkcyjną:
```bash
npm run build
```

## Docker

Projekt jest skonteneryzowany. Aby uruchomić go w Dockerze:

```bash
docker-compose up
```

## Supabase

Projekt używa Supabase jako backendu. Konfiguracja Supabase znajduje się w katalogu `supabase/`.

## Najważniejsze Pliki

- `src/App.tsx` - Główny komponent aplikacji
- `src/main.tsx` - Punkt wejścia aplikacji
- `src/stores/` - Store'y zarządzające stanem
- `src/components/` - Komponenty UI
- `src/pages/` - Strony aplikacji

## Porady dla Nowych Deweloperów

1. Najpierw zapoznaj się z `package.json`, aby zrozumieć zależności i skrypty
2. Przejrzyj `src/App.tsx`, aby zrozumieć główną strukturę aplikacji
3. Sprawdź komponenty w `src/components/` aby zobaczyć jak zbudowany jest interfejs
4. Przejrzyj store'y w `src/stores/` aby zrozumieć zarządzanie stanem 