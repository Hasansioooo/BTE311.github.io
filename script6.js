// Sayfa yüklendiğinde çalışacak ana işlev
document.addEventListener('DOMContentLoaded', () => {
    // 1. body arka planını yenile
    updateBodyBackground();
    
    // 2. 10 farklı resimden rastgele birini seç
    displayRandomImage();
});

// 1. Arka Plan Yenileme İşlevi (Rastgele Renk)
function updateBodyBackground() {
    // Kullanılabilecek rastgele renklerin listesi
    const colors = [
        '#FF5733', // Turuncu-Kırmızı
        '#33FF57', // Açık Yeşil
        '#3357FF', // Mavi
        '#FF33A1', // Pembe
        '#33FFF0', // Turkuaz
        '#FFC300', // Altın Sarısı
        '#C70039', // Bordo
        '#900C3F', // Koyu Mor
        '#581845', // Koyu Patlıcan
        '#FF5733'  // Tekrar eden bir renk
    ];

    // Rastgele bir renk seç
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    
    // Body arka plan rengini güncelle
    document.body.style.backgroundColor = randomColor;
}

// 2. 10 Farklı Resimden Rastgele Birini Seçme İşlevi
function displayRandomImage() {
    // NOT: Bu resim yollarının gerçekte var olması gerekir.
    // Lütfen projenizde 'resimler' adında bir klasör oluşturun
    // ve içine img01.jpg'den img10.jpg'ye kadar 10 farklı resim koyun.
    const imageFiles = [
        'resimler/img01.jpg',
        'resimler/img02.jpg',
        'resimler/img03.jpg',
        'resimler/img04.jpg',
        'resimler/img05.jpg',
        'resimler/img06.jpg',
        'resimler/img07.jpg',
        'resimler/img08.jpg',
        'resimler/img09.jpg',
        'resimler/img10.jpg'
    ];

    // Rastgele bir resim yolu seç
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    const randomImageUrl = imageFiles[randomIndex];
    
    // Resmi HTML'deki alana yerleştir
    const randomImageElement = document.getElementById('random-bg-image');
    randomImageElement.src = randomImageUrl;
}

// 3. Resim Gösterme İşlevi
function showImage(imageId) {
    const imageElement = document.getElementById(imageId);
    if (imageElement) {
        imageElement.classList.remove('hidden');
    }
}

// 3. Resim Gizleme İşlevi
function hideImage(imageId) {
    const imageElement = document.getElementById(imageId);
    if (imageElement) {
        imageElement.classList.add('hidden');
    }
}