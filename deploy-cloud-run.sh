#!/bin/bash

# =============================================================================
# KURWA DEPLOY NA GOOGLE CLOUD RUN - BEZ JEBANIA
# =============================================================================

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# KONFIGURACJA
# =============================================================================
PROJECT_ID=${1:-"your-project-id"}
SERVICE_NAME="knowlegather"
REGION="europe-west1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"

if [ "$PROJECT_ID" = "your-project-id" ]; then
    log_error "Podaj PROJECT_ID jako pierwszy argument!"
    echo "Użycie: $0 YOUR_PROJECT_ID"
    exit 1
fi

log_info "🚀 Deploying $SERVICE_NAME to Google Cloud Run"
log_info "📦 Project: $PROJECT_ID"
log_info "🌍 Region: $REGION"

# =============================================================================
# SPRAWDZANIE WYMAGAŃ
# =============================================================================
log_info "🔍 Sprawdzam wymagania..."

if ! command -v gcloud &> /dev/null; then
    log_error "gcloud CLI nie jest zainstalowane!"
    log_info "Zainstaluj: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    log_error "Docker nie jest zainstalowany!"
    exit 1
fi

# Sprawdź czy zalogowany do gcloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    log_error "Nie jesteś zalogowany do gcloud!"
    log_info "Zaloguj się: gcloud auth login"
    exit 1
fi

# Ustaw projekt
gcloud config set project $PROJECT_ID

log_success "Wymagania spełnione ✅"

# =============================================================================
# BUDOWANIE I PUSH OBRAZU
# =============================================================================
log_info "🔨 Budowanie obrazu Docker..."

# Włącz Container Registry API
gcloud services enable containerregistry.googleapis.com --quiet

# Konfiguruj Docker dla GCR
gcloud auth configure-docker --quiet

# Buduj obraz
docker build -f Dockerfile.prod -t $IMAGE_NAME .

log_success "Obraz zbudowany: $IMAGE_NAME"

# Push do GCR
log_info "📤 Pushing do Google Container Registry..."
docker push $IMAGE_NAME

log_success "Obraz wysłany do GCR ✅"

# =============================================================================
# DEPLOY DO CLOUD RUN
# =============================================================================
log_info "🚀 Deploying do Cloud Run..."

# Włącz Cloud Run API
gcloud services enable run.googleapis.com --quiet

# Deploy
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 80 \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production \
    --quiet

# Pobierz URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

log_success "🎉 DEPLOY ZAKOŃCZONY SUKCESEM!"
echo ""
log_info "🌐 URL aplikacji: $SERVICE_URL"
log_info "🔍 Test aplikacji:"
echo -e "   ${BLUE}curl $SERVICE_URL${NC}"
echo ""
log_info "📊 Monitoring:"
echo -e "   ${BLUE}gcloud run services describe $SERVICE_NAME --region=$REGION${NC}"
echo ""
log_info "📝 Logi:"
echo -e "   ${BLUE}gcloud logs tail \"resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME\" --follow${NC}"

# Test czy działa
log_info "🧪 Testowanie aplikacji..."
if curl -f -s $SERVICE_URL > /dev/null; then
    log_success "Aplikacja odpowiada poprawnie! 🎉"
else
    log_error "Aplikacja nie odpowiada! Sprawdź logi."
fi 