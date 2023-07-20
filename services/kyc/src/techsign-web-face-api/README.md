# Kurulum ve Çalıştırma

Projeyi çalıştırmak için apache kurulu dizine veya bir alt dizine Ör: face-detection altına yükleyerek, http://localhost/techsign-web-face-detection/index.html a erişmemiz yeterli olacaktır.

Tüm fonksiyonlar script.js dosyasından çağrılmaktadır.

Kalibrasyon ve yakalama için ayar değişkenleri;

##Belli başlı konfigürasyon değişikliğikleri için;

Daha önce edinilmiş transaction id  ve mimik bilgisi ile devam edebilmek için;

http://localhost/techsign-web-card-detection/?transactionId=XXXX-XXXXX&lg=tr&gestureType=MOUTH/EYE&token=XXX... olarak istek gönderiniz.

transactionId : Daha önce başlatılmış işleme ait transaction ID bilgisini içerir.

gestureType : Daha önce başlatılmış işleme ait kullanıcıdan beklenen mimik bilgisini taşır. EYE, MOUTH,HEAD-VERTICAL,HEAD-HORIZONTAL vb.

token : İlgili kullanıcının yetkilendirme sonrası sahip olduğu "token" bilgisidir.

lg : Tercih edilen dil, KAyıt başlıyor vb. metinlerin dilini temsil eder.

###CONFIG.domain

RKYC sunucu adresi barındırır. İsteklerin atılacağı domain bilgisini içerir.

###CONFIG.staticText

Dillere göre çıakcak mesajların metin bilgisini içerir.

###CONFIG.redirectToFaceUrl: '/techsign-web-card-detection'

Yüz yakalama sonrası kart yakalama ektanına dönüş dizin bilgisini içerir.

###Events
```javascript
  detectFaceNow.onRecordSuccess = function (videoBlob, base64Video) {
     $('.spinner').hide();
     console.log(videoBlob);
     console.log(base64Video);
   }


   detectFaceNow.waitingForCamera = function () {
     console.log("waiting for camera")
   }

   detectFaceNow.onFaceDetected = function () {
     console.log("face detected")
   }

   detectFaceNow.onReadyDetect = function () {
     console.log("ready to detect");
   };

   detectFaceNow.onFaceLostWhileRecording = function () {
     console.log("face lost on recording");
   };

   detectFaceNow.onFaceLost = function () {
     console.log("face lost");
   };

   detectFaceNow.onRecordStarted = function () {
     console.log("recording started");
   };
```
