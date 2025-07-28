# 🚀 Knowlegather - Wdrożenie Produkcyjne

## 📋 Przegląd

Ta dokumentacja opisuje jak wdrożyć aplikację Knowlegather w środowisku produkcyjnym używając Docker i Caddy jako serwera web.

## 🏗️ Architektura Produkcyjna

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Użytkownik    │───▶│   Caddy Server  │───▶│  React App      │
│                 │    │   (Port 80/443) │    │  (Static Files) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Supabase      │
                       │   (External)    │
                       └─────────────────┘
```

## 🛠️ Wymagania

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Bash** (dla skryptów)
- **Curl** (dla testów)
- **2GB RAM** minimum
- **10GB** wolnego miejsca na dysku

## ⚡ Szybki Start

### 1. Przygotowanie środowiska

```bash
# Sklonuj repozytorium
git clone <your-repo-url>
cd knowlegather

# Skopiuj i uzupełnij zmienne środowiskowe
cp .env.prod.example .env.prod
nano .env.prod  # Uzupełnij swoimi danymi
```

### 2. Budowanie i uruchamianie

```bash
# Zbuduj aplikację (automatycznie testuje)
chmod +x scripts/build-prod.sh
./scripts/build-prod.sh

# Uruchom w produkcji
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Weryfikacja

```bash
# Sprawdź status
docker-compose -f docker-compose.prod.yml ps

# Sprawdź logi
docker-compose -f docker-compose.prod.yml logs -f

# Test health check
curl http://localhost/health
```

## 🔧 Konfiguracja

### Zmienne środowiskowe (.env.prod)

```env
# =============================================================================
# ZMIENNE ŚRODOWISKOWE - PRODUKCJA
# =============================================================================

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenRouter API
VITE_OPENROUTER_API_KEY=your-openrouter-key

# Production Settings
NODE_ENV=production
```

### Konfiguracja domeny (Caddyfile.prod)

```caddyfile
# Zmień your-domain.com na swoją domenę
your-domain.com {
    root * /usr/share/caddy
    file_server
    try_files {path} /index.html
    
    # Automatyczne SSL od Let's Encrypt
    tls your-email@domain.com
}
```

## 🚀 Wdrożenie na serwerze

### 1. Przygotowanie serwera

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose git curl

# Uruchom Docker
sudo systemctl start docker
sudo systemctl enable docker

# Dodaj użytkownika do grupy docker
sudo usermod -aG docker $USER
# Wyloguj się i zaloguj ponownie
```

### 2. Wdrożenie aplikacji

```bash
# Na serwerze
git clone <your-repo-url>
cd knowlegather

# Konfiguracja
cp .env.prod.example .env.prod
nano .env.prod  # Uzupełnij danymi

# Dostosuj domenę w Caddyfile.prod
nano Caddyfile.prod

# Zbuduj i uruchom
./scripts/build-prod.sh
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Konfiguracja DNS

Ustaw rekordy DNS dla swojej domeny:

```
A     your-domain.com     -> IP-SERWERA
AAAA  your-domain.com     -> IPv6-SERWERA (opcjonalne)
```

## 📊 Monitoring i Logi

### Sprawdzanie statusu

```bash
# Status kontenerów
docker-compose -f docker-compose.prod.yml ps

# Użycie zasobów
docker stats knowlegather-app

# Logi aplikacji
docker-compose -f docker-compose.prod.yml logs -f app

# Logi Caddy
docker exec knowlegather-app cat /var/log/caddy/access.log
```

### Health Checks

```bash
# Podstawowy health check
curl http://your-domain.com/health

# Sprawdzenie SSL
curl -I https://your-domain.com

# Test pełnej aplikacji
curl -I http://your-domain.com
```

## 🔒 Bezpieczeństwo

### Implementowane zabezpieczenia

- ✅ **HTTPS automatyczne** (Let's Encrypt)
- ✅ **HSTS** (HTTP Strict Transport Security)
- ✅ **XSS Protection**
- ✅ **Content Security Policy**
- ✅ **Non-root container user**
- ✅ **Security headers**
- ✅ **Gzip/Brotli compression**

### Dodatkowe zabezpieczenia

```bash
# Firewall (ufw)
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# Fail2ban dla SSH
sudo apt install fail2ban
```

## 🔄 Aktualizacje

### Aktualizacja aplikacji

```bash
# Pobierz najnowszy kod
git pull origin main

# Zbuduj nową wersję
./scripts/build-prod.sh

# Restart z nowym obrazem
docker-compose -f docker-compose.prod.yml up -d
```

### Backup i przywracanie

```bash
# Backup wolumenów
docker run --rm -v knowlegathor_caddy_data:/data -v $(pwd):/backup ubuntu tar czf /backup/caddy-backup.tar.gz -C /data .

# Przywracanie
docker run --rm -v knowlegathor_caddy_data:/data -v $(pwd):/backup ubuntu tar xzf /backup/caddy-backup.tar.gz -C /data
```

## 🐛 Rozwiązywanie problemów

### Częste problemy

#### 1. Kontener nie startuje

```bash
# Sprawdź logi
docker-compose -f docker-compose.prod.yml logs app

# Sprawdź konfigurację
docker-compose -f docker-compose.prod.yml config
```

#### 2. SSL nie działa

```bash
# Sprawdź czy domena wskazuje na serwer
nslookup your-domain.com

# Sprawdź logi Caddy
docker exec knowlegather-app caddy logs
```

#### 3. Aplikacja nie ładuje się

```bash
# Sprawdź czy pliki są zbudowane
docker exec knowlegather-app ls -la /usr/share/caddy

# Test lokalny
curl -v http://localhost/
```

### Logi i debugging

```bash
# Wszystkie logi
docker-compose -f docker-compose.prod.yml logs -f

# Tylko błędy
docker-compose -f docker-compose.prod.yml logs -f | grep -i error

# Wejście do kontenera
docker exec -it knowlegather-app sh
```

## 📈 Optymalizacja wydajności

### Monitoring zasobów

```bash
# Użycie CPU i RAM
docker stats --no-stream

# Rozmiar obrazów
docker images

# Oczyszczanie nieużywanych obrazów
docker system prune -f
```

### Tunning

1. **Zwiększ limity pamięci** w `docker-compose.prod.yml`
2. **Włącz HTTP/3** w Caddyfile
3. **Dodaj CDN** przed Caddy
4. **Użyj SSD** dla lepszej wydajności I/O

## 🆘 Wsparcie

### Przydatne komendy

```bash
# Restart całego stacku
docker-compose -f docker-compose.prod.yml restart

# Rebuild bez cache
docker-compose -f docker-compose.prod.yml build --no-cache

# Czyszczenie systemu
docker system prune -a -f

# Export/Import obrazu
docker save knowlegather:latest | gzip > knowlegather-backup.tar.gz
gunzip -c knowlegather-backup.tar.gz | docker load
```

### Kontakt

- 📧 Email: admin@your-domain.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Docs: [Documentation](https://docs.your-domain.com)

---

*Ostatnia aktualizacja: 2024-12-19* 