# Futbol Maçları Uygulaması

React Native Web ile geliştirilmiş futbol maçları takip uygulaması. Football-data.org API'sini kullanarak ligler, maçlar ve oyuncu bilgilerini gösterir.

## Özellikler

- 🏆 Popüler futbol liglerini görüntüleme
- 📅 Ligdeki tüm maçları listeleme
- ⚽ Maç detayları (skor, tarih, saat, durum)
- 👥 Takım oyuncularını görüntüleme
- 🔄 Pull-to-refresh özelliği
- 📱 Responsive tasarım

## Gereksinimler

- Node.js 18 veya üzeri
- Docker (opsiyonel)
- Football-data.org API key

## Kurulum

### 1. API Key Alma

1. [Football-data.org](https://www.football-data.org/) sitesine kaydolun
2. API key'inizi alın
3. `.env` dosyası oluşturun:

```bash
cp .env.example .env
```

4. `.env` dosyasına API key'inizi ekleyin:

```
REACT_APP_FOOTBALL_API_KEY=your_api_key_here
```

### 2. Bağımlılıkları Yükleme

```bash
npm install
```

### 3. Uygulamayı Çalıştırma

#### Geliştirme Modu (Docker olmadan)

```bash
npm run web
```

Uygulama `http://localhost:1024` adresinde çalışacaktır.

#### Docker ile Çalıştırma

```bash
# Docker image'ı oluştur
npm run docker:build

# Docker container'ı çalıştır
npm run docker:run
```

Veya docker-compose kullanarak:

```bash
docker-compose up --build
```

Uygulama `http://localhost:1024` adresinde çalışacaktır.

## Proje Yapısı

```
.
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Ana sayfa (ligler)
│   │   ├── MatchesScreen.js       # Maç listesi
│   │   └── MatchDetailScreen.js   # Maç detayları
│   ├── services/
│   │   └── footballApi.js         # API servisleri
│   └── App.js                      # Ana uygulama
├── public/
│   └── index.html                  # HTML template
├── Dockerfile                       # Docker yapılandırması
├── docker-compose.yml              # Docker Compose yapılandırması
├── webpack.config.js                # Webpack yapılandırması
└── package.json                     # Proje bağımlılıkları
```

## API Kullanımı

Uygulama Football-data.org API v4 kullanmaktadır. API key'inizi `.env` dosyasına eklemeyi unutmayın.

### Desteklenen Endpoint'ler

- `GET /competitions` - Tüm ligler
- `GET /competitions/{id}` - Lig detayları
- `GET /competitions/{id}/matches` - Lig maçları
- `GET /matches/{id}` - Maç detayları
- `GET /teams/{id}` - Takım bilgileri ve oyuncular

## Port Yapılandırması

Uygulama varsayılan olarak **1024** portunda çalışır. Portu değiştirmek için:

1. `webpack.config.js` dosyasındaki `devServer.port` değerini değiştirin
2. `Dockerfile` ve `docker-compose.yml` dosyalarındaki port eşlemelerini güncelleyin

## Sorun Giderme

### API Key Hatası

Eğer "Ligler yüklenirken bir hata oluştu" hatası alıyorsanız:
- `.env` dosyasının doğru oluşturulduğundan emin olun
- API key'inizin geçerli olduğunu kontrol edin
- API key'inizi environment variable olarak doğru şekilde yüklediğinizden emin olun

### Docker Sorunları

- Docker'ın çalıştığından emin olun
- Port 1024'ün başka bir uygulama tarafından kullanılmadığını kontrol edin
- `docker-compose down` komutu ile eski container'ları temizleyin

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

