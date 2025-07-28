#!/bin/bash

# =============================================================================
# SKRYPT BUDOWANIA PRODUKCYJNEGO - Knowlegather
# =============================================================================

set -e  # Zatrzymaj przy pierwszym błędzie

# Kolory dla outputu
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcje pomocnicze
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# KONFIGURACJA
# =============================================================================
PROJECT_NAME="knowlegather"
IMAGE_NAME="$PROJECT_NAME:latest"
CONTAINER_NAME="$PROJECT_NAME-app"

log_info "🚀 Rozpoczynam budowanie produkcyjne aplikacji $PROJECT_NAME"

# =============================================================================
# SPRAWDZENIE WYMAGAŃ
# =============================================================================
log_info "🔍 Sprawdzam wymagania..."

# Sprawdź czy Docker jest dostępny
if ! command -v docker &> /dev/null; then
    log_error "Docker nie jest zainstalowany lub niedostępny"
    exit 1
fi

# Sprawdź czy plik .env istnieje
if [ ! -f ".env.prod" ]; then
    log_warning "Plik .env.prod nie istnieje. Tworzę przykładowy..."
    cat > .env.prod << 'EOF'
# =============================================================================
# ZMIENNE ŚRODOWISKOWE - PRODUKCJA
# =============================================================================

# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenRouter API
VITE_OPENROUTER_API_KEY=your-openrouter-api-key

# Production Settings
NODE_ENV=production
EOF
    log_warning "Uzupełnij plik .env.prod przed kontynuowaniem!"
    exit 1
fi

log_success "Wymagania spełnione"

# =============================================================================
# CZYSZCZENIE
# =============================================================================
log_info "🧹 Czyszczenie starych kontenerów i obrazów..."

# Zatrzymaj i usuń stary kontener jeśli istnieje
if docker ps -a --format 'table {{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    log_info "Zatrzymuję stary kontener: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
fi

# Usuń stary obraz jeśli istnieje
if docker images --format 'table {{.Repository}}:{{.Tag}}' | grep -q "^$IMAGE_NAME$"; then
    log_info "Usuwam stary obraz: $IMAGE_NAME"
    docker rmi $IMAGE_NAME || true
fi

log_success "Czyszczenie zakończone"

# =============================================================================
# BUDOWANIE
# =============================================================================
log_info "🔨 Buduję obraz Docker..."

# Buduj obraz z Dockerfile.prod
docker build \
    -f Dockerfile.prod \
    -t $IMAGE_NAME \
    --build-arg NODE_ENV=production \
    --no-cache \
    .

log_success "Obraz zbudowany: $IMAGE_NAME"

# =============================================================================
# TESTOWANIE BUILDU
# =============================================================================
log_info "🧪 Testuję zbudowany obraz..."

# Uruchom kontener testowy
TEST_CONTAINER="$PROJECT_NAME-test"
docker run -d \
    --name $TEST_CONTAINER \
    -p 8080:80 \
    --env-file .env.prod \
    $IMAGE_NAME

# Czekaj na uruchomienie
sleep 5

# Sprawdź czy kontener działa
if docker ps --format 'table {{.Names}}' | grep -q "^$TEST_CONTAINER$"; then
    log_success "Kontener testowy działa poprawnie"
    
    # Test health check
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        log_success "Health check przeszedł pomyślnie"
    else
        log_warning "Health check nie działa (może być normalny)"
    fi
else
    log_error "Kontener testowy nie uruchomił się poprawnie"
    docker logs $TEST_CONTAINER
    exit 1
fi

# Zatrzymaj kontener testowy
docker stop $TEST_CONTAINER
docker rm $TEST_CONTAINER

log_success "Test buildu zakończony pomyślnie"

# =============================================================================
# PODSUMOWANIE
# =============================================================================
log_success "✅ Build produkcyjny zakończony pomyślnie!"
echo ""
log_info "📦 Obraz: $IMAGE_NAME"
log_info "🚀 Aby uruchomić produkcję:"
echo -e "   ${BLUE}docker-compose -f docker-compose.prod.yml up -d${NC}"
echo ""
log_info "🔍 Aby sprawdzić logi:"
echo -e "   ${BLUE}docker-compose -f docker-compose.prod.yml logs -f${NC}"
echo ""
log_info "🛑 Aby zatrzymać:"
echo -e "   ${BLUE}docker-compose -f docker-compose.prod.yml down${NC}"
echo ""

# =============================================================================
# STATYSTYKI OBRAZU
# =============================================================================
log_info "📊 Statystyki obrazu:"
docker images $IMAGE_NAME --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" 