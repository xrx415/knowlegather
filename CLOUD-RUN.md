# 🚀 Knowlegather - Google Cloud Run Deploy

## 🎯 Szybki Deploy - Bez Jebania!

### 1. Przygotowanie (raz na zawsze)

```bash
# Zainstaluj Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Zaloguj się
gcloud auth login

# Utwórz projekt (lub użyj istniejącego)
gcloud projects create your-project-id
gcloud config set project your-project-id

# Włącz billing (wymagane dla Cloud Run)
# https://console.cloud.google.com/billing
```

### 2. Deploy (jeden kurwa przycisk!)

```bash
# Nadaj uprawnienia
chmod +x deploy-cloud-run.sh

# DEPLOY!
./deploy-cloud-run.sh YOUR_PROJECT_ID
```

**TO WSZYSTKO!** 🎉

### 3. Co się dzieje automatycznie?

✅ Buduje obraz Docker  
✅ Wysyła do Google Container Registry  
✅ Deployuje na Cloud Run  
✅ Konfiguruje SSL (HTTPS)  
✅ Daje ci URL aplikacji  
✅ Testuje czy działa  

### 4. Koszty

- **Darmowe** do 2 milionów requestów/miesiąc
- **$0.40** za milion requestów powyżej
- **$0.24** za GB-godzinę RAM
- **Automatyczne skalowanie** 0-10 instancji

### 5. Przydatne komendy

```bash
# Sprawdź status
gcloud run services list

# Zobacz logi
gcloud logs tail "resource.type=cloud_run_revision" --follow

# Usuń serwis
gcloud run services delete knowlegather --region=europe-west1

# Aktualizacja (po zmianach w kodzie)
./deploy-cloud-run.sh YOUR_PROJECT_ID
```

### 6. Troubleshooting

**Problem:** "Permission denied"  
**Rozwiązanie:** `chmod +x deploy-cloud-run.sh`

**Problem:** "Project not found"  
**Rozwiązanie:** Sprawdź czy projekt istnieje: `gcloud projects list`

**Problem:** "Billing not enabled"  
**Rozwiązanie:** Włącz billing w konsoli Google Cloud

**Problem:** "Docker not found"  
**Rozwiązanie:** Zainstaluj Docker Desktop

---

## 🔥 Dlaczego Cloud Run?

- ✅ **Zero konfiguracji serwera**
- ✅ **Automatyczne HTTPS**
- ✅ **Skalowanie 0-∞**
- ✅ **Płacisz tylko za użycie**
- ✅ **Global CDN**
- ✅ **Monitoring wbudowany**

**Fuck servers, embrace serverless!** 🚀 