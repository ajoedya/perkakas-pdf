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
    { berkas: "gambar.html",    nama: "PDF ke gambar" }
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

    HALAMAN.forEach((h) => {
      if (h.berkas === "index.html") return;
      const a = document.createElement("a");
      a.className = "tautan" + (h.berkas === kini ? " kini" : "");
      a.href = h.berkas;
      a.textContent = h.nama;
      if (h.berkas === kini) a.setAttribute("aria-current", "page");
      isi.appendChild(a);
    });

    bar.appendChild(isi);
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* Kotak seret dan lepas. saat(daftarBerkas) dipanggil tiap ada berkas masuk. */
  function pasangJatuhan(kotak, input, saat) {
    kotak.addEventListener("click", () => input.click());
    kotak.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
    });
    ["dragenter", "dragover"].forEach((n) => kotak.addEventListener(n, (e) => {
      e.preventDefault(); kotak.classList.add("aktif");
    }));
    ["dragleave", "drop"].forEach((n) => kotak.addEventListener(n, (e) => {
      e.preventDefault(); kotak.classList.remove("aktif");
    }));
    kotak.addEventListener("drop", (e) => {
      const f = [...e.dataTransfer.files];
      if (f.length) saat(f);
    });
    input.addEventListener("change", (e) => {
      const f = [...e.target.files];
      if (f.length) saat(f);
      input.value = "";
    });
  }

  function pdfSaja(daftar) { return daftar.filter((f) => f.type === "application/pdf"); }
  function gambarSaja(daftar) { return daftar.filter((f) => /^image\/(jpeg|png)$/.test(f.type)); }

  /* Membaca PDF sekaligus menyiapkan salinan bytes, sebab pdf.js memindahkan buffer. */
  async function bacaPdf(file) {
    const buf = await file.arrayBuffer();
    const bytes = buf.slice(0);
    const dok = await pdfjsLib.getDocument({ data: buf }).promise;
    return { dok, bytes, nama: file.name };
  }

  async function halamanKeKanvas(dok, no, lebarTarget) {
    const h = await dok.getPage(no);
    const dasar = h.getViewport({ scale: 1 });
    const skala = lebarTarget / dasar.width;
    const v = h.getViewport({ scale: skala });
    const k = document.createElement("canvas");
    k.width = v.width; k.height = v.height;
    await h.render({ canvasContext: k.getContext("2d"), viewport: v }).promise;
    return k;
  }

  function unduh(bytes, nama, jenis) {
    const tautan = document.createElement("a");
    tautan.href = URL.createObjectURL(new Blob([bytes], { type: jenis || "application/pdf" }));
    tautan.download = nama;
    document.body.appendChild(tautan);
    tautan.click();
    tautan.remove();
    setTimeout(() => URL.revokeObjectURL(tautan.href), 4000);
  }

  function tanpaAkhiran(nama) { return (nama || "dokumen.pdf").replace(/\.[^.]+$/, ""); }

  function pesan(kotak, isi, jenis) {
    const k = typeof kotak === "string" ? document.getElementById(kotak) : kotak;
    if (!k) return;
    k.innerHTML = isi;
    k.className = "kabar" + (jenis ? " " + jenis : "");
  }

  function lolos(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  function ukuran(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(0) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  }

  /* Membaca rentang halaman seperti "1-3, 5, 8-10" menjadi daftar nomor. */
  function bacaRentang(teks, maksimum) {
    const hasil = [];
    teks.split(",").forEach((bagian) => {
      const t = bagian.trim();
      if (!t) return;
      const cocok = t.match(/^(\d+)\s*-\s*(\d+)$/);
      if (cocok) {
        let a = parseInt(cocok[1], 10), b = parseInt(cocok[2], 10);
        if (a > b) { const c = a; a = b; b = c; }
        for (let i = a; i <= b; i++) if (i >= 1 && i <= maksimum) hasil.push(i);
      } else if (/^\d+$/.test(t)) {
        const n = parseInt(t, 10);
        if (n >= 1 && n <= maksimum) hasil.push(n);
      }
    });
    return [...new Set(hasil)].sort((a, b) => a - b);
  }

  window.Bersama = {
    pasangJatuhan, pdfSaja, gambarSaja, bacaPdf, halamanKeKanvas,
    unduh, tanpaAkhiran, pesan, lolos, ukuran, bacaRentang
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pasangMenu);
  } else {
    pasangMenu();
  }
})();
