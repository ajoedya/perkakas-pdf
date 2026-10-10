/* ============================================================
   Tema Perkakas PDF
   Berkas kecil ini dimuat di <head> setiap halaman, SEBELUM gaya.css, supaya
   tema yang dipilih pengguna sudah terpasang saat halaman pertama kali
   digambar (tidak berkedip dari tema bawaan).

   Warna dan gambar tiap tema ada di gaya.css, bagian "Tema".
   Tombol pengalihnya dibuat bersama.js di menu atas.

   Menambah tema: tambahkan satu baris di DAFTAR, lalu buat blok
   :root[data-tema="id-nya"] di gaya.css.
   ============================================================ */
(function () {
  "use strict";

  var KUNCI = "perkakas-tema";
  var BAWAAN = "pelabuhan";

  // warna: dua warna contoh untuk bulatan pada tombol pengalih (utama, aksen).
  // gambar: uraian banner untuk pembaca layar.
  var DAFTAR = [
    { id: "pelabuhan", nama: "Pelabuhan Senja", warna: ["#08274d", "#b8893a"],
      gambar: "Pemandangan teluk saat matahari terbenam dengan perbukitan, gedung kota, dermaga, kilang, dan kapal" },
    { id: "hutan", nama: "Hutan Hujan", warna: ["#123a2b", "#b48a30"],
      gambar: "Hutan hujan berkabut di tepi sungai saat matahari terbit, dengan orang utan di dahan pohon" },
    { id: "mangrove", nama: "Mangrove", warna: ["#0b3d46", "#c18b2f"],
      gambar: "Jembatan kayu dan pondok di hutan mangrove saat senja, dengan bekantan di dahan dan kilang di kejauhan" }
  ];

  function cari(id) {
    for (var i = 0; i < DAFTAR.length; i++) if (DAFTAR[i].id === id) return DAFTAR[i];
    return null;
  }

  function tersimpan() {
    try { return localStorage.getItem(KUNCI); } catch (e) { return null; }
  }

  // Memasang tema pada <html>. Tema bawaan tidak memakai atribut sama sekali.
  function pasang(id) {
    var tema = cari(id) || cari(BAWAAN);
    var akar = document.documentElement;
    if (tema.id === BAWAAN) akar.removeAttribute("data-tema");
    else akar.setAttribute("data-tema", tema.id);
    // Uraian gambar banner di beranda ikut berganti.
    var gambar = document.querySelector("[data-banner-tema]");
    if (gambar) gambar.setAttribute("aria-label", tema.gambar);
    return tema;
  }

  var kini = pasang(tersimpan());

  window.Tema = {
    daftar: DAFTAR,
    kini: function () { return kini.id; },
    // Dipanggil tombol pengalih: pasang, simpan, lalu kabari halaman.
    pakai: function (id) {
      kini = pasang(id);
      try { localStorage.setItem(KUNCI, kini.id); } catch (e) { /* mode privat: tema tetap berlaku di halaman ini */ }
      return kini;
    },
    // Dipanggil sekali setelah halaman selesai dimuat, agar uraian gambar ikut terpasang.
    segarkan: function () { kini = pasang(kini.id); }
  };
})();
