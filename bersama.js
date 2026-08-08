/* ============================================================
   Alat bantu bersama. Dimuat semua halaman sebelum skrip masing-masing.
   ============================================================ */
(function () {
  "use strict";

  const HALAMAN = [
    { berkas: "penanda.html",   nama: "Penanda TTE" },
    { berkas: "gabung.html",    nama: "Gabung PDF" },
    { berkas: "pecah.html",     nama: "Pecah PDF" },
    { berkas: "susun.html",     nama: "Susun Halaman" },
    { berkas: "nomor.html",     nama: "Penomor Halaman" },
    { berkas: "tanda-air.html", nama: "Watermark" },
    { berkas: "gambar.html",    nama: "PDF dan Gambar" },
    { berkas: "koreksi.html",   nama: "Edit Teks" }
  ];

  function pasangMenu() {
    const kini = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const bar = document.createElement("nav");
    bar.className = "menu";
    bar.setAttribute("aria-label", "Menu utama");

    const isi = document.createElement("div");
    isi.className = "menu-isi";

    // Merek / Beranda
    const merek = document.createElement("a");
    merek.className = "menu-nama";
    merek.href = "index.html";
    merek.innerHTML = 'Perkakas PDF<span>.</span>';
    isi.appendChild(merek);

    // Container Dropdown "Pilih Alat Editmu!"
    const wrapper = document.createElement("div");
    wrapper.className = "menu-dropdown-wrapper";

    const tombol = document.createElement("button");
    tombol.className = "menu-dropdown-btn";
    tombol.type = "button";
    tombol.innerHTML = 'Pilih Alat Editmu! <span class="panah">▼</span>';

    const menuKonten = document.createElement("div");
    menuKonten.className = "menu-dropdown-content";

    HALAMAN.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.berkas;
      a.textContent = item.nama;
      if (kini === item.berkas.toLowerCase()) {
        a.classList.add("aktif");
      }
      menuKonten.appendChild(a);
    });

    wrapper.appendChild(tombol);
    wrapper.appendChild(menuKonten);
    isi.appendChild(wrapper);

    bar.appendChild(isi);
    document.body.insertBefore(bar, document.body.firstChild);

    // Event listener untuk klik tombol & luar area
    tombol.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.toggle("terbuka");
    });

    document.addEventListener("click", () => {
      wrapper.classList.remove("terbuka");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pasangMenu);
  } else {
    pasangMenu();
  }
})();
