# Kurulum ve Çalıştırma

Projeyi çalıştırmak için apache kurulu dizine veya bir alt dizine Ör: card-detection altına yükleyerek, http://localhost/techsign-web-card-detection/index.html a erişmemiz yeterli olacaktır.

Tüm fonksiyonlar detect.js dosyasından çağrılmaktadır.

Kalibrasyon ve yakalama için ayar değişkenleri config.js üzerinden erişilebilirdir.

Daha önce edinilmiş transaction id verisi ile devam edebilmek için;

http://localhost/techsign-web-card-detection/?transactionId=XXX-XXXX&token=XXXXX... olarak istek gönderiniz.

transactionId : Daha önce başlatılmış işleme ait transaction ID bilgisini içerir.

token : İlgili kullanıcının yetkilendirme sonrası sahip olduğu "token" bilgisidir.

cardType : IDCARD,OLDIDCARD,DRIVERCARD,PASSPORT,FOREIGNID olmak üzere kart tipi bilgisi içerir. Kart seçim ekranının gelmemesi için bir kart tipi belirtilmek zorundadır.

##Belli başlı konfigürasyon değişikliğikleri için;

###CONFIG.domain

RKYC sunucu adresi barındırır. İsteklerin atılacağı domain bilgisini içerir.

###CONFIG.staticText

Dillere göre çıakcak mesajların metin bilgisini içerir.

###CONFIG.detectedColor: 'rgba(64, 168, 24, 0.88)'

Kart yakalama anında çıkan çizgilerin renk bilgisidir.

###CONFIG.detectionLineWidth: 5

Kart yakalama için çıkan çizgilerin kalınlığını barındırır.

###CONFIG.redirectToFaceUrl: '/techsign-web-face-api'

Kart yakalama sonrası yüz tanıma dizin bilgisini içerir.

###CONFIG.validationMode : 'cloud'

cloud ve standalone olmak üzere iki temel üzerine kuruludur. Cloud seçili ise Proveid alt yapısı ile tüm süreçler baştan uca tamamlanabilir. Standalone yapı ise geliştirici tarafında eventleri yakalayarak ilerlenir.

###Events
```javascript
detectCardNow.onCapturedSuccess = function (image, blobImage, imgObject) {
$('.spinner').hide();
console.log(image);
console.log(blobImage);
console.log(imgObject);
};

detectCardNow.onReadyCapture = function () {
console.log("ready to capture");
};

detectCardNow.waitingForCamera = function () {
console.log("waiting for camera");
};

```


