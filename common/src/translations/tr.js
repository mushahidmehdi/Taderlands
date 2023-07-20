module.exports = {
	register: {
		subject: `Paratica || Doğrulama Kodu {{otpCode}}`,
		body: `Merhaba,<br>
        <br>
        Paratica kayıt işleminizi tamamlamadan önce email adresinizi doğrulamamız gerekiyor. Aşağıdaki 6 haneli doğrulama kodunu Paratica ekranına girerek doğrulama işlemini tamamlayabilirsiniz.
        <br>
        <br>
        Paratica’ya kayıt olmak için lütfen bu doğrulama kodunu girin:<br>
        <br>
        {{otpCode}}
        <br>
        <br>
        onay kodunuz 2 saat sonra zaman aşımına uğrayacaktır.
        <br>
        <br>
        Teşekkürler,<br>
        Paratica
        `,
		smsBody: `Merhaba,
        Paratica kayıt işleminizi tamamlamadan önce email adresinizi doğrulamamız gerekiyor. Aşağıdaki 6 haneli doğrulama kodunu Paratica ekranına girerek doğrulama işlemini tamamlayabilirsiniz.
        Paratica’ya kayıt olmak için lütfen bu doğrulama kodunu girin: {{otpCode}}
        Onay kodunuz 2 saat sonra zaman aşımına uğrayacaktır.
        Teşekkürler,
        Paratica
        `,
	},
	login: {
		subject: `Paratica || Giriş Doğrulama Kodu {{otpCode}}`,
		body: `Merhaba,
        <br>
        <br>
        Paratica’ya giriş yapmak için lütfen bu doğrulama kodunu girin:
        <br>
        {{otpCode}}
        <br>
        <br>
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        <br>
        <br>
        Teşekkürler,
        <br>
        Paratica
        `,
		smsBody: `Merhaba,
        Paratica’ya giriş yapmak için lütfen bu doğrulama kodunu girin: {{otpCode}}
        Onay kodunuz 120 dakika boyunca geçerli olacaktır.
        Teşekkürler,
        Paratica
        `,
	},
	operation: {
		subject: `Paratica || Giriş Doğrulama Kodu {{otpCode}}`,
		body: `Merhaba,
        <br>
        <br>
        Paratica’da işlem yapabilmek için lütfen bu doğrulama kodunu girin:
        <br>
        {{otpCode}}
        <br>
        <br>
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        <br>
        <br>
        Teşekkürler,
        <br>
        Paratica
        `,
		smsBody: `Merhaba,
        Paratica’da işlem yapabilmek için lütfen bu doğrulama kodunu girin: {{otpCode}}
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        Teşekkürler,
        Paratica
        `,
	},
	resetPassword: {
		subject: `Paratica || Şifrenizi Sıfırlayın {{otpCode}}`,
		body: `Merhaba,
        <br>
        <br>
        Paratica şifrenizi sıfırlayabilmek için bu doğrulama kodunu girin:
        <br>
        {{otpCode}}
        <br>
        <br>
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        <br>
        <br>
        Teşekkürler,
        <br>
        Paratica
        `,
		smsBody: `Merhaba,
        Paratica şifrenizi sıfırlayabilmek için bu doğrulama kodunu girin: {{otpCode}}
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        Teşekkürler,
        Paratica
        `,
	},
	contactInfoKey: {
		subject: `Paratica || Giriş Doğrulama Kodu {{otpCode}}`,
		body: `Merhaba,
        <br>
        <br>
        Paratica’da işlem yapabilmek için lütfen bu doğrulama kodunu girin:
        <br>
        {{otpCode}}
        <br>
        <br>
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        <br>
        <br>
        Teşekkürler,
        <br>
        Paratica
        `,
		smsBody: `Merhaba,
        Paratica’da işlem yapabilmek için lütfen bu doğrulama kodunu girin: {{otpCode}}
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        Teşekkürler,
        Paratica
        `,
	},

	otpDeposit: {
		subject: `Paratica || Giriş Doğrulama Kodu {{otpCode}}`,
		body: `Merhaba,
        <br>
        <br>
        Paratica’da işlem yapabilmek için lütfen bu doğrulama kodunu girin:
        <br>
        {{otpCode}}
        <br>
        <br>
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        <br>
        <br>
        Teşekkürler,
        <br>
        Paratica
        `,
		smsBody: `Merhaba,
        Paratica’da işlem yapabilmek için lütfen bu doğrulama kodunu girin: {{otpCode}}
        onay kodunuz 120 dakika boyunca geçerli olacaktır.
        Teşekkürler,
        Paratica
        `,
	},

	tradingServicesErrorLog: {
		reason: {
			"500": "Bilinmeyen Hata",
			"500x": "Bilinmeyen Hata",
			"5000": "API Hatalı",
			"5001": "Yetersiz Bakiye",
			"5002": "Yetersiz Pozisyon Bakiyesi",
			"5003": "Alt Limit Hatası",
			"5004": "Kullanıcı Hesabı Bulunamadı",
			"5005": "Borsada Emir Bulunmuyor",
			"5006": "Paritede Pozisyon Yok",
			"5007": "Halihazırda Borsada Açık Pozisyon Bulunuyor",
			"5008": "Emir Bilgisi Bulunmuyor",
			"5009": "Passphrase Hatalı",
			"5010": "Yetkisiz İşlem",
			"5011": "Hatalı Sembol",
			"5012": "Piyasa Tipi Hatalı",
			"5013": "Pozisyon Boyutu Hatalı",
			"5014": "",
			"5015": "Hatalı API İmzası",
			"5016": "Emir Durumu Hatası",
			"5017": "Hatalı Emir",
			"5018": "Yetersiz Kredi",
			"5019": "Halihazırda Emirler Bulunuyor",
			"5999": "Borsa Erişilemiyor",
			"6000": "Eş Zamanlı İşlem Limiti Dolu",
			"6001": "Parite Portfolyoda Bulunmuyor",
			"6002": "Robot Durumu İzlemede",
			"6003": "Robot Durdurulmuş",
			"6004": "Takip Ayarları Hatalı",
			"6005": "Hesap İşlem Limiti Dolu",
			"6006": "",
			"6007": "Paritede Açık Pozisyon Bulunuyor",
			"6008": "Paritede Açık Pozisyon Bulunmuyor",
			"6009": "API Bağlantısı Hatası",
			"6010": "Stratejiyi Kullanmayı Bıraktınız",
		},
		comment: {
			"500": "",
			"500x": "",
			"5000": "Edit API Restrictions",
			"5001": "Edit Exchange Balances",
			"5002": "Adjust Your Position Size",
			"5003": "Adjust Your Budget Settings",
			"5004": "Edit Your API Information",
			"5005": "",
			"5006": "",
			"5007": "Control Your Positions",
			"5008": "",
			"5009": "Edit Your API Information",
			"5010": "Edit API Restrictions",
			"5011": "",
			"5012": "",
			"5013": "",
			"5014": "",
			"5015": "",
			"5016": "",
			"5017": "",
			"5018": "Please Deposit Credits",
			"5019": "Please Control Your Open Orders",
			"5999": "",
			"6000": "Control Your Budget Settings",
			"6001": "Control Your Portfolio Settings",
			"6002": "",
			"6003": "",
			"6004": "Control Your Position Settings",
			"6005": "",
			"6006": "",
			"6007": "",
			"6008": "",
			"6009": "Control Your API Connection",
			"6010": "",
		},
	},
};
