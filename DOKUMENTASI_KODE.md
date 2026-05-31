# Dokumentasi Kode Portfolio Rahmat Hidayat

Dokumen ini dibuat agar struktur project lebih mudah dibaca ketika ingin melakukan perubahan di kemudian hari.

## Struktur File Utama

```text
index.html
certificates.html
assets/
  css/
    style.css
    swiper-bundle.min.css
  js/
    main.js
    swiper-bundle.min.js
  img/
  sertifikat/
  cv/
```

## 1. `index.html`

File utama website portfolio. Bagian pentingnya:

- `#home` untuk tampilan awal nama, typed text, tombol contact, dan foto.
- `#about` untuk ringkasan profil dan tombol download CV.
- `#skills` untuk Soft Skills dan Technical Skills.
- `#certificate` untuk 4 sertifikat unggulan.
- `#background` untuk Education dan Organization.
- `#portfolio` untuk project carousel.
- `#contact` untuk informasi kontak dan form kirim pesan.

Catatan perubahan terbaru:

- Struktur hero tidak perlu diubah. Posisi tengahnya diatur dari CSS bagian `FINAL HERO POLISH`.
- Form contact memakai `id="contact-form"`, `id="contact-name"`, `id="contact-email"`, dan `id="user-message"`. Jangan mengganti id ini tanpa mengubah JavaScript.

## 2. `certificates.html`

Halaman internal untuk menampilkan semua sertifikat. Tombol `View All Certificates` di halaman utama mengarah ke halaman ini, sehingga pengunjung tidak perlu pindah ke Google Drive.

## 3. `assets/css/style.css`

File styling utama. Bagian paling bawah berisi block update final:

```css
FINAL HERO POLISH, Contact, and Code Readability Fix
```

Block tersebut mengatur:

- posisi hero agar nama dan foto seimbang di tengah,
- tampilan status contact form,
- responsive hero untuk mobile, tablet, dan desktop.

Jika ingin mengubah ukuran foto hero, cari selector:

```css
.home__blob
```

Jika ingin mengubah layout hero, cari selector:

```css
.home__content
```

Jika ingin mengubah warna status contact, cari selector:

```css
.contact__message.color-green
.contact__message.color-red
.contact__message.color-blue
```

## 4. `assets/js/main.js`

File interaksi utama website. Sudah diberi komentar per bagian:

1. Mobile navigation
2. Skills show more / show less
3. Background tabs
4. Services modal
5. Project carousel
6. Hero typed text
7. Contact form EmailJS
8. Active navigation on scroll
9. Header shadow on scroll
10. Scroll up button
11. Dark mode

## 5. Konfigurasi Contact Form EmailJS

Konfigurasi ada di `assets/js/main.js`:

```js
const EMAILJS_CONFIG = {
  serviceId: 'service_39oxs8i',
  templateId: 'template_lykg67g',
  publicKey: 'QvQIyg2CW3CKLIkS9',
  ownerEmail: 'amathmrs02@gmail.com',
};
```

Sistem pengiriman pesan memakai `emailjs.sendForm()` seperti kode portfolio lama yang sudah berhasil terkirim di website deploy. Method ini sengaja dipertahankan agar tetap cocok dengan template EmailJS lama yang membaca field form HTML.

Field form yang dikirim:

- `user_name`
- `user_email`
- `user_message`

Jika pesan masih gagal setelah deploy, cek hal berikut:

- Service ID masih aktif.
- Template ID masih aktif.
- Public Key benar.
- Gmail/service di EmailJS masih tersambung.
- Domain website sudah diizinkan jika security restriction aktif.

Catatan: pesan error di halaman website tidak menampilkan detail teknis agar pengunjung tidak melihat informasi internal. Detail error hanya dicetak di browser console untuk kebutuhan debugging developer.

## 6. Cara Deploy Ulang

1. Extract ZIP final.
2. Upload semua isi folder ke repository GitHub Pages.
3. Pastikan file `index.html` berada di root repository.
4. Commit dan push.
5. Tunggu GitHub Pages melakukan update.
6. Hard refresh browser dengan `Ctrl + F5` agar cache CSS/JS lama tidak terbaca.

## 7. Checklist Setelah Deploy

- Hero: nama dan foto sudah sejajar dan tidak ada kolom kosong.
- Skills: Soft Skills dan Technical Skills langsung terlihat.
- Certificate: grid 4 kolom di desktop.
- Project: slider tidak meloncat ke project pertama.
- Contact: validasi kosong, email salah, loading, sukses, dan gagal tampil jelas.
- Footer: tinggi footer tetap minimalis.

## Catatan Revisi Hero Terakhir

Bagian paling bawah `assets/css/style.css` memiliki blok `FINAL HERO POSITION PATCH`. Blok ini menjadi override terakhir untuk mengatur posisi hero utama:

- `max-width` pada `.home__content` diperkecil agar nama dan foto tidak terlalu berjauhan.
- `column-gap` dibuat lebih rapat supaya komposisi lebih nyaman dilihat di desktop.
- `.home__img` diberi `transform: translateY(...)` agar blob/foto turun sedikit dan sisi atasnya tidak tampak terpotong.
- Pada mobile, layout tetap satu kolom dengan foto dan teks berada di tengah.


## Update Contact Form V6

Bagian EmailJS pada `assets/js/main.js` dikembalikan mengikuti kode lama yang sudah terbukti berhasil pada website deploy. Jalur utama tetap memakai `emailjs.sendForm('service_39oxs8i', 'template_lykg67g', '#contact-form', 'QvQIyg2CW3CKLIkS9')`. Perubahan hanya berupa status tambahan untuk kondisi gagal kirim, sehingga pengunjung mendapat informasi jelas tanpa menampilkan detail teknis internal.


## Contact Form Final Stabil

Bagian EmailJS pada `assets/js/main.js` dipertahankan memakai kode lama yang sudah terbukti berhasil. Tidak ada handler gagal/catch tambahan pada proses pengiriman. Perubahan hanya dilakukan di dalam callback sukses `.then()`, yaitu menampilkan pop-up `Pesan berhasil dikirim` dan mengosongkan field Name, E-Mail, serta Message setelah pesan berhasil dikirim.
