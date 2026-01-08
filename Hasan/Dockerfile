FROM node:18-alpine

WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --legacy-peer-deps

# Uygulama dosyalarını kopyala
COPY . .

# Portu expose et
EXPOSE 1024

# Uygulamayı başlat
CMD ["npm", "run", "web"]

