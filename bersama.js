/* ============================================================
   Alat bantu bersama. Dimuat semua halaman sebelum skrip masing-masing.
   ============================================================ */
(function () {
  "use strict";

  const HALAMAN = [
    { berkas: "index.html",     nama: "Beranda" },
    { berkas: "koreksi.html",   nama: "Edit Teks" },
    { berkas: "gabung.html",    nama: "Gabung dan Susun PDF" },
    { berkas: "pecah.html",     nama: "Pecah PDF" },
    { berkas: "tanda-air.html", nama: "Watermark" },
    { berkas: "gambar.html",    nama: "PDF dan Gambar" },
    { berkas: "word.html",      nama: "PDF ke Word" },
    { berkas: "penanda.html",   nama: "Penanda TTE" },
    { berkas: "pengubah-uk.html", nama: "Ubah Ukuran Kertas" },
    { berkas: "kompres.html",   nama: "Kompres PDF" }
  ];

  // Memasang favicon secara otomatis jika belum ada di tag <head>
  function pasangFavicon() {
    if (!document.querySelector("link[rel*='icon']")) {
      // Urutannya: .ico untuk peramban lama, .svg dan .png untuk peramban baru,
      // lalu ikon layar utama untuk ponsel. Akhiran ?v= dinaikkan tiap kali
      // gambarnya diganti, supaya peramban tidak memakai ikon lama dari tembolok.
      [
        { rel: "icon", type: "image/x-icon", href: "favicon.ico?v=4" },
        { rel: "icon", type: "image/svg+xml", href: "favicon.svg?v=4" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "favicon-32.png?v=4" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "favicon-16.png?v=4" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "favicon-192.png?v=4" },
        { rel: "apple-touch-icon", href: "favicon-180.png?v=4" }
      ].forEach((ikon) => {
        const link = document.createElement("link");
        Object.keys(ikon).forEach((k) => link.setAttribute(k, ikon[k]));
        document.head.appendChild(link);
      });
    }
  }

  function pasangMenu() {
    const kini = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const bar = document.createElement("nav");
    bar.className = "menu";
    bar.setAttribute("aria-label", "Navigasi utama");

    const isi = document.createElement("div");
    isi.className = "menu-isi";

    const merek = document.createElement("a");
    merek.className = "menu-nama";
    merek.href = "index.html";
    merek.innerHTML = "Perkakas PDF<small>KPKNL BALIKPAPAN</small>";
    isi.appendChild(merek);

    const beranda = document.createElement("a");
    beranda.className = "menu-beranda";
    beranda.href = "index.html";
    beranda.textContent = "Beranda";
    if (kini === "index.html") beranda.setAttribute("aria-current", "page");
    isi.appendChild(beranda);

    const container = document.createElement("div");
    container.className = "menu-dropdown-wrapper";

    const tombol = document.createElement("button");
    tombol.className = "menu-dropdown-btn";
    tombol.type = "button";
    tombol.textContent = "Daftar Perkakas";
    tombol.setAttribute("aria-expanded", "false");
    tombol.setAttribute("aria-controls", "menu-perkakas");
    tombol.setAttribute("aria-haspopup", "true");

    const menuKonten = document.createElement("div");
    menuKonten.className = "menu-dropdown-content";
    menuKonten.id = "menu-perkakas";

    HALAMAN.forEach((item) => {
      if (item.berkas === "index.html") return;
      const a = document.createElement("a");
      a.href = item.berkas;
      a.textContent = item.nama;
      if (kini === item.berkas.toLowerCase()) {
        a.classList.add("aktif");
        a.setAttribute("aria-current", "page");
      }
      menuKonten.appendChild(a);
    });

    container.append(tombol, menuKonten);
    isi.appendChild(container);
    pasangBukaTutup(container, tombol);

    const pengalih = buatPengalihTema();
    if (pengalih) isi.appendChild(pengalih);

    bar.appendChild(isi);
    // Pada beranda, tautan "Lewati navigasi" harus menjadi elemen fokus pertama.
    const lewati = document.querySelector(".lewati-konten");
    if (lewati) {
      lewati.insertAdjacentElement("afterend", bar);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  // Perilaku buka-tutup yang sama untuk semua menu tarik-turun di bilah atas:
  // klik tombol, klik di luar, tombol Escape, dan fokus yang berpindah keluar.
  function pasangBukaTutup(container, tombol) {
    function aturTerbuka(terbuka) {
      container.classList.toggle("terbuka", terbuka);
      tombol.setAttribute("aria-expanded", String(terbuka));
    }
    tombol.addEventListener("click", (e) => {
      e.stopPropagation();
      aturTerbuka(!container.classList.contains("terbuka"));
    });
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) aturTerbuka(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && container.classList.contains("terbuka")) {
        aturTerbuka(false);
        tombol.focus();
      }
    });
    container.addEventListener("focusout", (e) => {
      if (!container.contains(e.relatedTarget)) aturTerbuka(false);
    });
    return aturTerbuka;
  }

  // Tombol pengalih tema. Daftar temanya berasal dari tema.js; bila berkas itu
  // tidak termuat, tombol tidak dibuat dan situs tetap memakai tema bawaan.
  function buatPengalihTema() {
    if (!window.Tema) return null;

    const wadah = document.createElement("div");
    wadah.className = "menu-dropdown-wrapper menu-tema";

    const tombol = document.createElement("button");
    tombol.className = "menu-dropdown-btn menu-tema-btn";
    tombol.type = "button";
    tombol.setAttribute("aria-expanded", "false");
    tombol.setAttribute("aria-controls", "menu-tema");
    tombol.setAttribute("aria-haspopup", "true");
    tombol.setAttribute("aria-label", "Ganti tema tampilan");
    tombol.innerHTML = '<span class="menu-tema-bulatan" aria-hidden="true"></span><span class="menu-tema-teks">Tema</span>';

    const daftar = document.createElement("div");
    daftar.className = "menu-dropdown-content";
    daftar.id = "menu-tema";
    daftar.setAttribute("role", "menu");
    daftar.setAttribute("aria-label", "Pilihan tema");

    const aturTerbuka = pasangBukaTutup(wadah, tombol);

    function tandai() {
      const kini = window.Tema.kini();
      daftar.querySelectorAll(".menu-tema-pilihan").forEach((b) => {
        b.setAttribute("aria-checked", String(b.dataset.tema === kini));
      });
    }

    window.Tema.daftar.forEach((tema) => {
      const pilihan = document.createElement("button");
      pilihan.type = "button";
      pilihan.className = "menu-tema-pilihan";
      pilihan.dataset.tema = tema.id;
      pilihan.setAttribute("role", "menuitemradio");
      const bulatan = document.createElement("span");
      bulatan.className = "menu-tema-bulatan";
      bulatan.setAttribute("aria-hidden", "true");
      bulatan.style.setProperty("--warna-1", tema.warna[0]);
      bulatan.style.setProperty("--warna-2", tema.warna[1]);
      pilihan.append(bulatan, document.createTextNode(tema.nama));
      pilihan.addEventListener("click", () => {
        window.Tema.pakai(tema.id);
        tandai();
        aturTerbuka(false);
        tombol.focus();
      });
      daftar.appendChild(pilihan);
    });

    tandai();
    wadah.append(tombol, daftar);
    return wadah;
  }

  // Inisialisasi favicon dan menu saat DOM siap
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      pasangFavicon();
      pasangMenu();
      if (window.Tema) window.Tema.segarkan();
    });
  } else {
    pasangFavicon();
    pasangMenu();
    if (window.Tema) window.Tema.segarkan();
  }
})();
