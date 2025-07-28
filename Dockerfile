# Używamy Node.js dla środowiska deweloperskiego
FROM node:20-slim

# Ustawiamy folder roboczy w kontenerze
WORKDIR /app

# Kopiujemy pliki z listą zależności i instalujemy je
COPY package*.json ./
RUN npm ci

# Kopiujemy cały kod źródłowy aplikacji
COPY . .

# Eksponujemy port 5173 (domyślny port Vite)
EXPOSE 5173

# Uruchamiamy serwer deweloperski Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]