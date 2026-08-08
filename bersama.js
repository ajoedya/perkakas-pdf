/* ============================================================
   Alat bantu bersama. Dimuat semua halaman sebelum skrip masing-masing.
   ============================================================ */
(function () {
  "use strict";

  const HALAMAN = [
    { berkas: "index.html",     nama: "Beranda" },
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

    const merek = document.createElement("a");
    merek.className = "menu-nama";
    merek.href = "index.html";
    merek.innerHTML = 'Perkakas PDF<span>.</span>';
    isi.appendChild(merek);

    // Wrapper Dropdown
    const container = document.createElement("div");
    container.className = "menu-dropdown-wrapper";

    const tombol = document.createElement("button");
    tombol.className = "menu-dropdown-btn";
    tombol.type = "button";
    tombol.innerHTML = 'Pilih Alat Editmu! <span class="panah">&#9660;</span>';

    const menuKonten = document.createElement("div");
    menuKonten.className = "menu-dropdown-content";

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

    container.appendChild(tombol);
    container.appendChild(menuKonten);
    isi.appendChild(container);

    bar.appendChild(isi);
    document.body.insertBefore(bar, document.body.firstChild);

    // Event Listener Klik Dropdown
    tombol.addEventListener("click", function (e) {
      e.stopPropagation();
      container.classList.toggle("terbuka");
    });

    document.addEventListener("click", function () {
      container.classList.remove("terbuka");
    });
  }

  // ============================================================
  // Objek Bersama: Fungsi Alat Bantu & Penanganan Unggah
  // ============================================================
  window.Bersama = {
    // Memasang area seret-lepas (drag and drop) dan klik pilihan berkas
    pasangJatuhan: function (area, input, callback) {
      if (!area || !input) return;

      area.addEventListener("click", () => input.click());
      area.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          input.click();
        }
      });

      ["dragenter", "dragover"].forEach((namaEvent) => {
        area.addEventListener(namaEvent, (e) => {
          e.preventDefault();
          e.stopPropagation();
          area.classList.add("aktif");
        });
      });

      ["dragleave", "drop"].forEach((namaEvent) => {
        area.addEventListener(namaEvent, (e) => {
          e.preventDefault();
          e.stopPropagation();
          area.classList.remove("aktif");
        });
      });

      area.addEventListener("drop", (e) => {
        const berkas = Array.from(e.dataTransfer.files || []);
        if (berkas.length > 0 && typeof callback === "function") {
          callback(berkas);
        }
      });

      input.addEventListener("change", () => {
        const berkas = Array.from(input.files || []);
        if (berkas.length > 0 && typeof callback === "function") {
          callback(berkas);
        }
        input.value = ""; // reset agar bisa memilih berkas yang sama ulang
      });
    },

    // Penyaring berkas PDF saja
    pdfSaja: function (daftar) {
      return daftar.filter((f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name));
    },

    // Penyaring berkas Gambar (JPG & PNG) saja
    gambarSaja: function (daftar) {
      return daftar.filter((f) => /image\/(jpeg|png)/i.test(f.type) || /\.(jpg|jpeg|png)$/i.test(f.name));
    },

    // Menampilkan kotak pesan/kabar
    pesan: function (id, teks, jenis) {
      const el = document.getElementById(id);
      if (!el) return;
      el.className = "kabar" + (jenis ? " " + jenis : "");
      el.innerHTML = teks;
    },

    // Membaca berkas PDF menggunakan PDF.js
    bacaPdf: async function (file) {
      const bytes = await file.arrayBuffer();
      const dok = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
      return { bytes, dok, nama: file.name };
    },

    // Merender halaman PDF ke bentuk elemen <canvas>
    halamanKeKanvas: async function (dok, nomorHalaman, targetLebar) {
      const hal = await dok.getPage(nomorHalaman);
      const vpAsli = hal.getViewport({ scale: 1 });
      const skala = targetLebar / vpAsli.width;
      const vp = hal.getViewport({ scale: skala });

      const kanvas = document.createElement("canvas");
      const ctx = kanvas.getContext("2d");
      kanvas.width = vp.width;
      kanvas.height = vp.height;

      await hal.render({ canvasContext: ctx, viewport: vp }).promise;
      return kanvas;
    },

    // Memicu unduhan berkas otomatis
    unduh: function (dataBytes, namaBerkas) {
      const blob = new Blob([dataBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = namaBerkas;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    },

    // Memotong ekstensi .pdf dari nama berkas
    tanpaAkhiran: function (nama) {
      return nama.replace(/\.pdf$/i, "");
    },

    // Sanitasi karakter HTML
    lolos: function (str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },

    // Format ukuran berkas (KB / MB)
    ukuran: function (bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / 1048576).toFixed(1) + " MB";
    },

    // Mengurai teks rentang halaman (misal: "1-3, 5, 8-10")
    bacaRentang: function (teks, totalHalaman) {
      const hasil = new Set();
      const bagian = teks.split(",");
      for (let item of bagian) {
        item = item.trim();
        if (!item) continue;
        if (item.includes("-")) {
          const [awal, akhir] = item.split("-").map((n) => parseInt(n.trim(), 10));
          if (!isNaN(awal) && !isNaN(akhir)) {
            const min = Math.max(1, Math.min(awal, akhir));
            const max = Math.min(totalHalaman, Math.max(awal, akhir));
            for (let i = min; i <= max; i++) hasil.add(i);
          }
        } else {
          const n = parseInt(item, 10);
          if (!isNaN(n) && n >= 1 && n <= totalHalaman) {
            hasil.add(n);
          }
        }
      }
      return Array.from(hasil).sort((a, b) => a - b);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pasangMenu);
  } else {
    pasangMenu();
  }
})();
