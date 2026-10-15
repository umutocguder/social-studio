<!-- Created by 11Hopem -->
# Social Studio — Proje Mimarisi, Standartları ve Kuralları

Bu doküman **Social Studio** (Çoklu Marka Sosyal Medya Yönetim, İçerik Üretim, 9-Grid Izgara Önizleme ve Müşteri Onay Platformu) projesine ait teknik mimariyi, geliştirme standartlarını ve bağlayıcı kuralları belirler.

---

## 1. Proje Özeti ve Vizyonu
- **Proje Adı:** Social Studio (Sosyal Medya Yönetim & İçerik Stüdyosu)
- **Faaliyet Alanı:** Sosyal medya yöneticileri, ajanslar ve kişisel markalar için çoklu müşteri/marka yönetimi, viral kanca (hook) ve senaryo üretimi, carousel/reels içerik planlayıcı, 9'lu Instagram ızgara görsel simülatörü, müşteri onay akışı ve tek tıkla WhatsApp paylaşım motoru.
- **Konum:** `/Users/umut/mycodespaces/social-studio`
- **Uzak Depo:** `https://github.com/umutocguder/social-studio` (Private)
- **Canlı Dağıtım:** `https://social-studio-app.vercel.app` (Vercel CI/CD)
- **Antigravity Proje ID:** `3ae81ec5-d4f8-476b-a004-2d73fc8bd307`

---

## 2. Temel Teknolojik Yığın
- **İskelet & Mantık:** Vanilla Modern JavaScript (ES Modules, zero-dependency), HTML5, CSS3 Custom Properties.
- **Test Çatısı:** Node.js Native Test Runner (`node --test 'tests/**/*.test.js'`). Sıfır harici bağımlılık prensibi.
- **Yerel Veri Saklama:** Local Data Custody (%100 yerel depolama, JSON export & import).
- **Hosting & CI/CD:** Vercel Static Hosting (`vercel.json`), GitHub Otomatik Webhook Tetikleme.
- **İletişim & Onay Motoru:** WhatsApp Deep Link API & Onay Kartı Üreticisi (`src/approvalEngine.js`).

---

## 3. Kodlama ve Kalite Standartları
1. **Kaynak Kod Dili (%100 İngilizce):** Değişkenler, fonksiyonlar, sınıflar, modüller, testler ve commit mesajları istisnasız İngilizce yazılır. Kullanıcı arayüzü yüksek standartta Türkçe'dir.
2. **11hopem İmzası:** Bütün kaynak kod ve stil dosyalarının en başında `Created by 11Hopem` telif bloğu yer alır.
3. **Zorunlu Otomatik Test:** Yazılan tüm iş mantığı modülleri (`src/`) için `tests/` altında kapsamlı birim testleri yer alır. Testler geçmeden hiçbir kod pushlanamaz.
4. **Güvenlik ve Hukuki Uyum:** XSS sanitizasyonu, veri doğrulama, KVKK Aydınlatma Metni, Gizlilik Politikası ve Kullanım Koşulları eksiksiz sunulur.
5. **Kesin Şirket İzolasyonu:** Şirket projelerine (`/Users/umut/intetra/`) kesinlikle dokunulmaz.

---

## Git Branch Model — `master` = production, `dev` = UAT  (MANDATORY)

Set by Umut on 2026-10-15. **This overrides any earlier branch or tagging
instruction in this file**, including "auto-bump and tag on every push".

| Branch | Meaning | Rule |
|---|---|---|
| `master` | **Production** — what is live / shipped right now | Never commit directly. Only released code is merged in. |
| `dev` | **UAT** — where development happens; always ahead of or equal to `master` | All work lands here. |

The branch name `main` is not used.

**The agent manages branch switching, commits, merges and tags itself — it does
not ask Umut which branch to work on.**

1. A code change is requested → if on `master`, **switch to `dev` immediately**.
   The change and the commit go to `dev`.
2. Builds and packages are produced from `dev`.
3. The moment it goes live — App Store approval, Vercel production, delivery to
   the client — merge `dev` into `master`.
4. Tag on `master`: `v<version>` (e.g. `v1.0`, `v1.1`). **A tag is only ever
   created for a version that actually shipped.** Never tag on every push.
5. Development continues on `dev`. After the merge, `dev` and `master` are equal.

If a merge conflict appears, stop and tell Umut — do not resolve it alone.

Full rule: `/Users/umut/ai-context/kurallar/git-dal-modeli-master-dev.md`
