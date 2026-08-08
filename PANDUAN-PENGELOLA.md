# Panduan Pengelolaan Perkakas PDF

Dokumen ini untuk pengelola situs, bukan untuk pengguna. Panduan pemakaian sehari-hari sudah tersedia di dalam situs pada halaman **Panduan**, jadi tidak perlu diulang di sini.

---

## 1. Isi situs

Sebelas berkas, semuanya harus duduk sejajar pada lapisan paling atas *repository*. Tidak boleh ada yang masuk ke dalam folder, sebab seluruh tautan antarhalaman ditulis secara relatif.

| Berkas | Peran |
|---|---|
| `index.html` | Beranda, memuat petak menuju tiap perkakas |
| `penanda.html` | Pembubuh penanda tanda tangan elektronik |
| `gabung.html` | Penggabung beberapa PDF |
| `pecah.html` | Pemecah PDF |
| `susun.html` | Penyusun halaman, hapus, putar, urutkan |
| `nomor.html` | Pembubuh nomor halaman |
| `tanda-air.html` | Pembubuh tanda air |
| `gambar.html` | Pengubah PDF ke gambar dan sebaliknya |
| `panduan.html` | Panduan pemakaian untuk pengguna |
| `gaya.css` | Warna, huruf, dan tata letak seluruh halaman |
| `bersama.js` | Menu atas dan alat bantu yang dipakai semua halaman |

Dua berkas terakhir adalah tulang punggungnya. Kalau salah satu tidak ikut terunggah, seluruh situs tetap terbuka tetapi tanpa warna atau tanpa menu.

---

## 2. Menerbitkan pertama kali

1. Kumpulkan kesebelas berkas dalam satu folder di komputer, lalu hitung ulang jumlahnya.
2. Buka `github.com`, buat akun bila belum punya, lalu klik tanda tambah di pojok kanan atas dan pilih **New repository**.
3. Isi *Repository name* dengan `perkakas-pdf`, pilih **Public**, lalu klik **Create repository**. GitHub Pages gratis hanya berjalan pada *repository* publik.
4. Klik **Add file** lalu **Upload files**. Buka folder tadi, tekan Ctrl+A untuk memilih seluruh berkasnya, lalu seret ke kotak unggahan. **Yang diseret harus berkasnya, bukan foldernya**, sebab GitHub akan ikut membuatkan folder itu di dalam *repository* dan seluruh tautan jadi salah alamat.
5. Gulir ke bawah lalu klik **Commit changes**.
6. Masuk ke tab **Settings**, pilih menu **Pages** di kolom kiri, ubah *Branch* dari `None` menjadi `main`, biarkan folder pada pilihan `/ (root)`, lalu klik **Save**.
7. Tunggu satu sampai dua menit, muat ulang halaman *Pages* tadi, dan alamat situsnya akan muncul dengan bentuk `https://namapenggunamu.github.io/perkakas-pdf/`.

---

## 3. Pemeriksaan wajib sebelum disebarkan

Jangan menyebarkan alamatnya sebelum kelima hal berikut lolos, dan lakukan pengujian di **komputer kantor pada jaringan kantor**, bukan di komputer pribadi.

1. **Seluruh menu terbuka.** Klik satu per satu kesembilan tautan pada menu atas, pastikan tidak ada yang menampilkan halaman 404. Kalau ada, berarti berkasnya belum terunggah atau namanya tertulis berbeda, sebab GitHub membedakan huruf besar dan kecil.
2. **Warna dan menu muncul.** Kalau halaman tampil polos tanpa warna, `gaya.css` belum terunggah. Kalau menu atas tidak ada, `bersama.js` yang belum.
3. **Pembacaan PDF berjalan.** Buka `penanda.html`, pilih satu Nota Dinas polos, dan pastikan pratinjaunya tergambar. Kalau berkas terpilih tetapi tidak terjadi apa pun, jaringan kantor menyaring `cdnjs.cloudflare.com` atau `unpkg.com`, dan situsnya tidak akan bisa dipakai sampai hal itu diatasi.
4. **Unduhan beruntun.** Buka `pecah.html`, pilih cara memecah tiap halaman, lalu pastikan berkasnya benar-benar tersimpan semua dan bukan hanya yang pertama. Ini bagian yang paling sering bermasalah sebab perilaku tiap peramban berbeda.
5. **Hasilnya benar.** Buka berkas keluaran dengan Adobe Reader, bukan hanya dengan pratinjau peramban, dan periksa letak penandanya pada halaman yang benar.

---

## 4. Memperbarui

Cukup unggah berkas yang berubah saja, tidak perlu semuanya. Berkas dengan nama sama akan tertimpa setelah **Commit changes**.

Yang perlu diingat, peramban menyimpan salinan berkas lama. Jadi sesudah memperbarui, tampilan pengguna biasanya masih versi lama sampai halamannya dimuat ulang secara paksa dengan **Ctrl + Shift + R**. Sampaikan hal ini setiap kali kamu mengumumkan perbaikan, sebab kalau tidak, akan ada laporan bahwa perbaikanmu tidak muncul padahal sudah terpasang.

### Menambah perkakas baru

Menu atas ditulis sekali saja di dalam `bersama.js`, pada senarai `HALAMAN` di bagian paling atas berkas. Tambahkan satu baris di sana, lalu menunya ikut berubah di seluruh halaman.

```javascript
{ berkas: "namabaru.html", nama: "Nama di Menu" }
```

Halaman baru cukup memuat `gaya.css` pada bagian kepala dan `bersama.js` pada bagian bawah, lalu seluruh warna dan menunya mengikuti sendiri.

---

## 5. Ketergantungan yang perlu diwaspadai

Situs ini memanggil tiga alamat luar pada saat dijalankan.

| Alamat | Kegunaan | Akibat kalau tersaring |
|---|---|---|
| `cdnjs.cloudflare.com` | Pustaka pdf.js, membaca dan menggambar PDF | Pratinjau dan deteksi nama mati total |
| `unpkg.com` | Pustaka pdf-lib, menulis PDF | Penyimpanan hasil gagal |
| `fonts.googleapis.com` | Huruf Newsreader dan Public Sans | Hanya hurufnya berubah, fungsinya tetap jalan |

Dua yang pertama bersifat menentukan. Kalau jaringan kantormu menyaringnya, jalan keluarnya adalah membuat versi mandiri, yaitu kedua pustaka itu ikut diunggah ke *repository* sehingga tidak ada panggilan keluar sama sekali. Ukurannya bertambah sekitar satu setengah megabita, tetapi tahan terhadap penyaringan dan tetap jalan meski internet mati.

---

## 6. Batas kemampuan yang sengaja tidak disediakan

Tiga hal berikut sengaja tidak dibuat, dan alasannya perlu kamu pegang supaya bisa menjawab kalau ada yang meminta.

**Pemampatan ukuran berkas.** Pemampatan yang sungguhan menuntut penyandian ulang gambar dan pemangkasan huruf tertanam, dan hal itu tidak bisa dikerjakan dengan baik di dalam peramban. Cara pintasnya adalah menggambar ulang tiap halaman menjadi gambar, tetapi itu membunuh teksnya sehingga dokumen tidak bisa lagi dicari, disalin, maupun dibaca oleh pembaca layar.

**Pengubahan PDF menjadi Word.** Hasilnya selalu berantakan pada dokumen bertabel dan berkop, bahkan pada layanan besar yang mengerjakannya di server. Menyediakan fitur yang hasilnya harus dirapikan ulang setengah jam hanya memindahkan pekerjaan, bukan meringankannya.

**Pembuatan QR *Code* verifikasi.** QR pada naskah dinas bertanda tangan elektronik bukan hiasan, melainkan penaut ke data verifikasi di sisi Kemenkeu dan Komdigi. QR yang dibuat sendiri atau disalin dari dokumen lain akan membuat naskah tampak sah padahal tidak, dan itu bukan sekadar keliru secara teknis melainkan berbahaya.

---

## 7. Tanggung jawab

Sejak alamat situs ini disebarkan, orang akan memakainya untuk naskah dinas yang sesungguhnya, dan statusnya bukan lagi percobaan pribadi. Tiga hal berikut sebaiknya kamu kerjakan.

1. **Beri tahu pengelola teknologi informasi di kantormu.** Bukan meminta izin formal, melainkan supaya ada yang tahu ketika nanti muncul pertanyaan tentang keamanan atau ketika kamu berpindah tugas.
2. **Tawarkan agar berkasnya dititipkan di laman internal kantor.** Alamat berakhiran `github.io` terbaca sebagai milik pribadi, dan untuk perkakas yang menyentuh naskah dinas hal itu akan terus menimbulkan pertanyaan tentang siapa yang bertanggung jawab bila ada dokumen yang rusak. Caranya sama saja, sebab yang dibutuhkan hanya sebelas berkas statis.
3. **Cek dulu apakah aplikasi TTE kantormu sudah membubuhkan penandanya sendiri.** Sebagian aplikasi berbasis sertifikat BSrE membubuhkan penanda visual berikut QR secara otomatis pada saat penandatanganan. Kalau begitu keadaannya, perkakas penanda ini justru menghasilkan tulisan ganda, dan pengguna perlu diberi tahu kapan perkakas itu tidak boleh dipakai.

---

## 8. Saran urutan pengembangan

Jangan menambah fitur sebelum yang sekarang teruji dipakai orang sungguhan. Serahkan dulu ke satu atau dua rekan selama dua pekan, sebab kesalahan yang muncul dari pemakaian nyata akan mengubah rancanganmu jauh lebih banyak daripada penambahan fitur. Perkakas yang mengerjakan sedikit hal dengan benar jauh lebih berguna daripada sepuluh fitur yang setengah jadi.

Kalau nanti berkembang, pertahankan aturan satu perkakas satu berkas. Aturan itulah yang membuat kesalahan pada satu fitur tidak menjatuhkan yang lain.
