/* ============================================================
   Alat bantu bersama. Dimuat semua halaman sebelum skrip masing-masing.
   ============================================================ */
(function () {
  "use strict";

  const HALAMAN = [
    { berkas: "index.html",     nama: "Beranda" },
    { berkas: "koreksi.html",   nama: "Edit Teks" },
    { berkas: "kompres.html",   nama: "Kompres PDF" },
    { berkas: "gabung.html",    nama: "Gabung PDF" },
    { berkas: "pecah.html",     nama: "Pecah PDF" },
    { berkas: "susun.html",     nama: "Susun Halaman" },
    { berkas: "nomor.html",     nama: "Penomor Halaman" },
    { berkas: "tanda-air.html", nama: "Watermark" },
    { berkas: "gambar.html",    nama: "PDF dan Gambar" },
    { berkas: "penanda.html",   nama: "Penanda TTE" }
  ];

  function pasangMenu() {
    const kini = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    
    const bar = document.createElement("nav");
    bar.className = "menu";
    bar.setAttribute("aria-label", "Menu utama");

    const isi = document.createElement("div");
    isi.className = "menu-isi";

    // Logo / Merek Navigasi
    const merek = document.createElement("a");
    merek.className = "menu-nama";
    merek.href = "index.html";
    merek.innerHTML = 'Perkakas PDF<span>.</span>';
    isi.appendChild(merek);

    // Container Dropdown Modern
    const wrapper = document.createElement("div");
    wrapper.className = "menu-dropdown-wrapper";

    // Tombol Pemicu Kapsul
    const tombol = document.createElement("button");
    tombol.className = "menu-dropdown-trigger";
    tombol.type = "button";
    tombol.textContent = "Pilih Alat Editmu!";

    // Isi Menu Dropdown
    const menuKonten = document.createElement("div");
    menuKonten.className = "menu-dropdown-content";

    HALAMAN.forEach((item) => {
      if (item.berkas === "index.html") return; // Abaikan beranda di dalam dropdown

      const a = document.createElement("a");
      a.href = item.berkas;
      a.textContent = item.nama;
      
      if (kini === item.berkas.toLowerCase()) {
        a.classList.add("aktif");
        a.setAttribute("aria-current", "page");
      }
      menuKonten.appendChild(a);
    });

    wrapper.appendChild(tombol);
    wrapper.appendChild(menuKonten);
    isi.appendChild(wrapper);

    bar.appendChild(isi);
    document.body.insertBefore(bar, document.body.firstChild);

    // Event Listener Klik Dropdown
    tombol.addEventListener("click", function (e) {
      e.stopPropagation();
      wrapper.classList.toggle("terbuka");
    });

    // Tutup dropdown jika mengklik area lain
    document.addEventListener("click", function () {
      wrapper.classList.remove("terbuka");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pasangMenu);
  } else {
    pasangMenu();
  }
})();
