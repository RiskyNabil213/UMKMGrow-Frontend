/**
 * AI Engine — rule-based NLP untuk UMKM Grow+
 * Mencocokkan intent dari pesan user dan mengembalikan respons yang relevan.
 */

// ─── Tipe ────────────────────────────────────────────────────────────────────

interface Rule {
  keywords: string[];
  responses: string[];
}

// ─── Helper ──────────────────────────────────────────────────────────────────

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function matches(msg: string, keywords: string[]): boolean {
  return keywords.some((k) => msg.includes(k));
}

// ─── Rules ───────────────────────────────────────────────────────────────────

const RULES: Rule[] = [
  // ── Salam ──
  {
    keywords: ["halo", "hai", "hello", "hi", "selamat pagi", "selamat siang", "selamat sore", "assalamualaikum", "permisi"],
    responses: [
      "Halo! Senang bertemu kamu 😊 Saya siap bantu kembangkan bisnis kamu. Mau tanya soal apa hari ini?",
      "Hai! Ada yang bisa saya bantu untuk usaha kamu? Jangan sungkan tanya ya 🙌",
      "Selamat datang! Saya UMKM AI Assistant. Ceritakan bisnis kamu dan saya bantu carikan solusinya.",
    ],
  },

  // ── Terima kasih ──
  {
    keywords: ["terima kasih", "makasih", "thx", "thanks", "tq"],
    responses: [
      "Sama-sama! Semangat terus untuk usahamu ya 💪",
      "Dengan senang hati! Kalau ada pertanyaan lain, saya siap membantu 😊",
      "Siap! Sukses selalu untuk bisnismu 🚀",
    ],
  },

  // ── Penjualan & Omzet ──
  {
    keywords: ["penjualan", "omzet", "laku", "sepi", "pelanggan sedikit", "susah jual", "tidak laku", "nggak laku"],
    responses: [
      "Untuk meningkatkan penjualan, coba strategi bundling — gabungkan 2-3 produk dengan harga spesial. Ini terbukti menaikkan nilai transaksi rata-rata 25-30%.",
      "Program loyalitas pelanggan sangat efektif. Buat kartu stamp atau cashback sederhana agar pelanggan terus kembali.",
      "Analisis jam ramai usahamu, lalu fokuskan promosi di 1 jam sebelum jam tersebut. WhatsApp blast ke pelanggan lama juga bisa mendongkrak penjualan.",
      "Coba upselling saat checkout — tawarkan produk tambahan yang relevan. Misalnya, pelanggan beli kopi, tawarkan snack. Bisa menaikkan nilai order 15-20%.",
      "Flash sale 2-3 jam di hari tertentu bisa menciptakan urgensi pembelian. Umumkan H-1 di WhatsApp/Instagram untuk memaksimalkan antusiasme.",
    ],
  },

  // ── Harga & Penentuan Harga ──
  {
    keywords: ["harga", "penetapan harga", "hpp", "harga jual", "markup", "margin", "pricing", "terlalu mahal", "murah"],
    responses: [
      "Rumus dasar: Harga Jual = HPP ÷ (1 - Margin%). Untuk usaha kuliner, margin minimal 40%. Jadi HPP Rp 6.000 → harga jual minimal Rp 10.000.",
      "Hitung HPP dengan teliti: bahan baku + kemasan + gas/listrik + tenaga kerja + overhead. Banyak UMKM lupa memasukkan biaya overhead sehingga rugi tanpa sadar.",
      "Jangan bersaing murni di harga. Tambahkan nilai (value) produk — kemasan premium, pelayanan cepat, atau garansi kepuasan — agar harga bisa lebih tinggi.",
      "Cek harga kompetitor di radius 2 km. Jika kamu lebih mahal, pastikan ada diferensiasi yang jelas. Jika lebih murah, pastikan margin masih sehat minimal 30%.",
    ],
  },

  // ── Promosi & Marketing ──
  {
    keywords: ["promosi", "marketing", "iklan", "ads", "endorse", "influencer", "brand", "awareness"],
    responses: [
      "Untuk UMKM dengan budget terbatas, utamakan WhatsApp Business (broadcast ke pelanggan lama), Instagram Reels (jangkauan organik besar), dan Google Bisnisku (gratis, meningkatkan visibilitas lokal).",
      "Kolaborasi dengan UMKM lain yang targetnya sama tapi produknya berbeda. Misalnya, toko kue kolaborasi dengan toko minuman — saling promosi tanpa biaya.",
      "User-generated content (UGC) sangat powerful. Minta pelanggan foto dan tag usahamu, berikan reward kecil. Konten asli dari pelanggan lebih dipercaya daripada iklan.",
      "Gunakan Google Bisnisku secara maksimal — isi semua info, upload foto produk rutin, dan minta pelanggan beri ulasan. Ini meningkatkan visibilitas pencarian lokal secara gratis.",
    ],
  },

  // ── Instagram ──
  {
    keywords: ["instagram", "ig", "reels", "feed", "stories", "highlight", "followers"],
    responses: [
      "Di Instagram, Reels jangkauannya 3-5x lebih besar dari foto biasa. Buat video 15-30 detik yang menampilkan proses produksi atau transformasi produk — konten behind-the-scenes sangat disukai algoritma.",
      "Konsistensi adalah kunci Instagram. Posting minimal 4x seminggu. Gunakan jadwal tetap agar followers tahu kapan ekspektasi konten baru dari kamu.",
      "Gunakan 5-10 hashtag yang spesifik dan relevan daripada 30 hashtag umum. Hashtag niche (#kopijakartaselatan) lebih efektif daripada hashtag masif (#kopi yang sudah miliaran postingan).",
      "Stories yang interaktif (polling, question box, countdown) meningkatkan engagement dan membuat akun kamu lebih sering muncul di feed followers.",
    ],
  },

  // ── TikTok ──
  {
    keywords: ["tiktok", "fyp", "viral", "for you page"],
    responses: [
      "TikTok algoritmanya tidak bergantung pada jumlah followers — konten bagus bisa langsung viral. Fokus pada video yang entertaining atau informatif di 3 detik pertama.",
      "Format terbaik untuk UMKM di TikTok: before-after produk, proses produksi (satisfying video), review jujur dari pelanggan, atau tips singkat sesuai niche usaha kamu.",
      "Posting di jam 18.00-22.00 untuk menjangkau audiens terbanyak. Gunakan musik trending yang relevan dan tambahkan teks/caption di video karena banyak yang menonton tanpa suara.",
    ],
  },

  // ── WhatsApp Business ──
  {
    keywords: ["whatsapp", "wa", "broadcast", "wa business", "katalog wa"],
    responses: [
      "WhatsApp Business punya fitur Katalog Produk — manfaatkan ini agar pelanggan bisa browsing produkmu langsung dari chat. Tambahkan foto, deskripsi, dan harga.",
      "Broadcast List di WhatsApp berbeda dengan grup — pesan terkirim sebagai pesan pribadi sehingga terasa lebih personal. Kirim promo mingguan ke pelanggan lama secara rutin.",
      "Buat template pesan otomatis untuk: sambutan pelanggan baru, konfirmasi pesanan, dan follow-up kepuasan. Ini menghemat waktu dan membuat bisnis terkesan profesional.",
    ],
  },

  // ── Keuangan ──
  {
    keywords: ["keuangan", "laporan keuangan", "pembukuan", "akuntansi", "catatan keuangan", "arus kas", "cash flow"],
    responses: [
      "Pisahkan rekening pribadi dan usaha dari hari pertama. Ini fondasi keuangan sehat — tanpa ini kamu tidak bisa tahu bisnis untung atau rugi sebenarnya.",
      "Minimal catat 3 hal setiap hari: pemasukan, pengeluaran, dan stok. Bisa pakai Excel, aplikasi BukuWarung, atau Majoo yang gratis untuk UMKM.",
      "Buat laporan laba rugi sederhana setiap bulan. Bandingkan dengan bulan sebelumnya untuk melihat tren. Jika laba turun, cari tahu di pos mana pengeluaran membengkak.",
      "Terapkan aturan 50-30-20: 50% untuk biaya operasional, 30% reinvestasi ke bisnis, 20% cadangan darurat. Konsisten selama 6 bulan, bisnis kamu akan jauh lebih stabil.",
    ],
  },

  // ── Modal & Investasi ──
  {
    keywords: ["modal", "investasi", "pinjaman", "kta", "kur", "kredit usaha", "dana", "pendanaan", "investor"],
    responses: [
      "KUR (Kredit Usaha Rakyat) dari bank pemerintah (BRI, BNI, Mandiri) menawarkan bunga rendah 6%/tahun untuk UMKM. Syaratnya: usaha sudah berjalan minimal 6 bulan dan ada laporan keuangan sederhana.",
      "Sebelum cari pinjaman, hitung dulu ROI investasi yang direncanakan. Jika keuntungan tambahan dari modal itu melebihi bunga pinjaman, baru layak diambil.",
      "Mulai dari modal sendiri atau bootstrapping selama mungkin. Ini melatih efisiensi dan tidak membebani bisnis dengan cicilan. Gunakan profit untuk ekspansi bertahap.",
      "Platform P2P lending seperti Modalku atau Akseleran bisa jadi alternatif jika tidak lolos KUR. Bunga lebih tinggi tapi proses lebih cepat dan fleksibel.",
    ],
  },

  // ── Laba & Profit ──
  {
    keywords: ["laba", "profit", "untung", "rugi", "break even", "bep", "balik modal"],
    responses: [
      "BEP (Break Even Point) = Biaya Tetap ÷ (Harga Jual - Biaya Variabel per unit). Hitung ini dulu sebelum menentukan target penjualan harian.",
      "Jika laba terus tipis, audit pengeluaran — biasanya masalah ada di bahan baku (perlu negosiasi supplier), overhead (listrik, sewa), atau harga jual yang terlalu rendah.",
      "Fokus pada produk dengan margin tertinggi. Identifikasi 20% produk yang menghasilkan 80% keuntungan (Pareto principle) dan optimalkan penjualan produk tersebut.",
    ],
  },

  // ── Stok & Inventori ──
  {
    keywords: ["stok", "inventori", "persediaan", "kehabisan", "overstock", "manajemen stok"],
    responses: [
      "Gunakan metode FIFO (First In First Out) — barang masuk duluan harus keluar duluan. Ini sangat penting untuk produk perishable seperti bahan makanan.",
      "Tentukan reorder point untuk tiap bahan: kapan harus pesan ulang supaya tidak kehabisan. Rumusnya: Reorder Point = (Pemakaian Harian × Lead Time Supplier) + Safety Stock.",
      "Lakukan stock opname mingguan untuk usaha kuliner, bulanan untuk usaha non-food. Selisih antara catatan dan fisik bisa menunjukkan kebocoran atau kesalahan pencatatan.",
    ],
  },

  // ── Supplier & Bahan Baku ──
  {
    keywords: ["supplier", "bahan baku", "distributor", "vendor", "raw material", "pengiriman bahan"],
    responses: [
      "Jangan bergantung pada satu supplier. Miliki minimal 2-3 alternatif untuk bahan utama agar tidak terganggu jika ada masalah ketersediaan atau kenaikan harga mendadak.",
      "Negosiasi bulk buying dengan supplier reguler — pembelian dalam jumlah besar biasanya bisa mendapat diskon 10-20%. Ajukan kontrak bulanan untuk mendapat harga tetap.",
      "Evaluasi supplier setiap 3 bulan: konsistensi kualitas, ketepatan pengiriman, dan respons saat ada masalah. Supplier yang sering telat atau kualitas tidak stabil perlu diganti.",
    ],
  },

  // ── SDM & Karyawan ──
  {
    keywords: ["karyawan", "pegawai", "sdm", "rekrut", "perekrutan", "gaji", "upah", "training", "tim"],
    responses: [
      "Untuk UMKM kecil, mulai rekrut karyawan saat kamu tidak bisa lagi handle semua pekerjaan sendirian dan sudah ada cashflow positif minimal 3 bulan berturut-turut.",
      "Investasi training karyawan itu penting. Karyawan yang terlatih lebih produktif, membuat lebih sedikit kesalahan, dan lebih loyal. Anggaran minimal 2-3% dari gaji untuk pelatihan.",
      "Buat SOP (Standard Operating Procedure) tertulis untuk setiap pekerjaan. Ini memudahkan onboarding karyawan baru dan menjaga konsistensi kualitas produk/layanan.",
    ],
  },

  // ── Produk & Inovasi ──
  {
    keywords: ["produk baru", "inovasi", "pengembangan produk", "ide produk", "varian baru", "menu baru"],
    responses: [
      "Sebelum launch produk baru, validasi dulu dengan cara riset sederhana: tanya 20-30 pelanggan setia kamu apakah mereka mau beli. Pre-order bisa jadi cara validasi terbaik.",
      "Gunakan data penjualan untuk menemukan peluang inovasi. Produk mana yang paling sering ditanyakan pelanggan tapi belum kamu sediakan? Itulah titik start inovasi terbaik.",
      "Jangan langsung ganti semua menu/produk saat inovasi. Uji coba produk baru dalam skala kecil dulu selama 2-4 minggu sambil produk lama tetap jalan.",
    ],
  },

  // ── Pelanggan & Layanan ──
  {
    keywords: ["pelanggan", "customer", "komplain", "keluhan", "kepuasan", "review", "ulasan", "rating"],
    responses: [
      "Tangani komplain dengan cepat — respons dalam 1 jam menunjukkan profesionalisme. Minta maaf dulu, dengarkan, baru tawarkan solusi (ganti produk, refund, atau voucher).",
      "Pelanggan yang komplain dan merasa ditangani dengan baik justru bisa jadi pelanggan paling loyal. Setiap keluhan adalah feedback gratis untuk perbaikan.",
      "Minta review/testimoni dari pelanggan yang puas segera setelah transaksi — saat mereka masih senang. Kirim pesan singkat di WhatsApp dengan link Google Bisnisku.",
      "Buat database pelanggan sederhana: nama, nomor WA, produk favorit, frekuensi beli. Personalisasi promosi berdasarkan data ini jauh lebih efektif dari broadcast massal.",
    ],
  },

  // ── Lokasi & Ekspansi ──
  {
    keywords: ["lokasi", "toko", "outlet", "cabang", "ekspansi", "buka cabang", "sewa tempat", "pindah"],
    responses: [
      "Sebelum ekspansi fisik, pastikan unit ekonomi di lokasi pertama sudah sehat: profit margin minimal 20%, operasional sudah terdokumentasi dalam SOP, dan ada manajer yang bisa handle tanpa kamu.",
      "Riset lokasi baru dengan cermat: hitung traffic harian, cek kompetitor dalam radius 500m, dan survey target pelanggan apakah mereka akan datang ke lokasi tersebut.",
      "Pertimbangkan model cloud kitchen atau online-first sebelum buka outlet fisik baru. Biaya jauh lebih rendah dan risiko lebih kecil untuk memvalidasi pasar di area baru.",
    ],
  },

  // ── E-Commerce & Online ──
  {
    keywords: ["tokopedia", "shopee", "lazada", "online shop", "marketplace", "jualan online", "ecommerce", "cod", "toko online"],
    responses: [
      "Untuk mulai di marketplace, pilih satu platform dulu dan fokus. Shopee bagus untuk produk fashion/beauty/FMCG, Tokopedia untuk elektronik dan lifestyle, Grab/GoFood untuk kuliner.",
      "Foto produk adalah investasi terpenting di marketplace. Gunakan background putih atau sesuai brand, lighting natural atau softbox, dan ambil dari beberapa sudut. Produk dengan foto bagus bisa konversi 3x lebih baik.",
      "Manfaatkan program gratis ongkir dan flash deal dari platform — ini meningkatkan visibility produk kamu di halaman utama secara signifikan tanpa biaya iklan.",
      "Balas chat pelanggan dalam 1 jam agar toko kamu dapat badge 'Respon Cepat'. Badge ini meningkatkan kepercayaan dan konversi pembelian secara signifikan.",
    ],
  },

  // ── Franchise & Kemitraan ──
  {
    keywords: ["franchise", "waralaba", "mitra", "kemitraan", "join", "sistem bagi hasil"],
    responses: [
      "Sebelum jual franchise, pastikan bisnis kamu sudah berjalan minimal 2 tahun, profit konsisten, dan semua proses sudah terdokumentasi dalam SOP yang bisa direplikasi.",
      "Jika ingin beli franchise, hitung total investasi (franchise fee + equipment + working capital) vs proyeksi balik modal realistis. Idealnya BEP tidak lebih dari 18-24 bulan.",
      "Model kemitraan reseller atau dropship lebih mudah dimulai dari franchise. Kamu bisa perluas jangkauan tanpa investasi besar dengan berbagi margin ke mitra.",
    ],
  },

  // ── Digital & Teknologi ──
  {
    keywords: ["aplikasi", "software", "kasir", "pos", "sistem", "teknologi", "digital", "otomasi", "website"],
    responses: [
      "Untuk kasir, aplikasi gratis seperti Moka POS atau iReap sudah cukup untuk UMKM kecil-menengah. Fitur laporan penjualan hariannya sangat berguna untuk tracking omzet.",
      "Website sederhana di Google Sites atau Wix bisa dibuat gratis dan membantu credibility bisnis kamu, terutama untuk klien B2B atau pembelian dalam jumlah besar.",
      "Automasi yang paling impactful untuk UMKM: reminder pembayaran otomatis (WA/email), broadcast promo terjadwal, dan laporan keuangan otomatis dari aplikasi kasir.",
    ],
  },

  // ── Pajak & Legalitas ──
  {
    keywords: ["pajak", "npwp", "pkp", "ppn", "pph", "izin usaha", "siup", "oss", "legalitas", "nib", "halal"],
    responses: [
      "UMKM dengan omzet di bawah Rp 500 juta/tahun bisa memanfaatkan tarif PPh Final 0,5% dari omzet bruto (PP 23/2018). Ini jauh lebih sederhana dari perhitungan pajak normal.",
      "Daftar NIB (Nomor Induk Berusaha) di OSS.go.id — gratis, online, dan selesai dalam hitungan menit. NIB ini menggantikan SIUP dan banyak izin usaha lainnya.",
      "Sertifikasi Halal MUI sekarang lebih mudah lewat BPJPH untuk UMKM kecil. Jika produk kamu makanan/minuman, sertifikasi halal bisa meningkatkan kepercayaan pelanggan secara signifikan.",
    ],
  },

  // ── Packaging & Branding ──
  {
    keywords: ["kemasan", "packaging", "brand", "logo", "desain", "branding", "label"],
    responses: [
      "Kemasan adalah silent salesman. Investasi kemasan yang menarik bisa meningkatkan perceived value produk dan memungkinkan harga jual lebih tinggi.",
      "Untuk UMKM dengan budget terbatas, buat logo di Canva (gratis) dan cetak stiker label. Ini sudah cukup untuk memberikan kesan profesional pada produk.",
      "Konsistensi warna dan font di semua touchpoint (kemasan, sosmed, struk, kartu nama) membangun brand recognition. Pilih 2-3 warna utama dan gunakan selalu.",
    ],
  },

  // ── Mindset & Motivasi ──
  {
    keywords: ["motivasi", "menyerah", "putus asa", "susah", "sulit", "gagal", "stres", "burnout", "cape", "lelah"],
    responses: [
      "Bisnis itu maraton, bukan sprint. Setiap pengusaha sukses pernah melewati fase sulit. Yang membedakan adalah mereka terus belajar dari setiap kegagalan dan tidak berhenti.",
      "Jika sedang kelelahan, delegasikan pekerjaan yang bisa dikerjakan orang lain. Sebagai pemilik usaha, fokus kamu seharusnya di pengambilan keputusan strategis, bukan operasional harian.",
      "Rayakan pencapaian kecil — pelanggan ke-100, omzet pertama Rp 10 juta, review bintang 5 pertama. Momentum positif ini penting untuk menjaga semangat jangka panjang.",
    ],
  },
];

// ─── Main function ────────────────────────────────────────────────────────────

export function generateAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  // Cari rule yang cocok
  for (const rule of RULES) {
    if (matches(msg, rule.keywords)) {
      return pick(rule.responses);
    }
  }

  // Fallback cerdas — coba parsing kata kunci utama dari pesan
  const words = msg.split(/\s+/);
  const topicWord = words.find((w) => w.length > 4) ?? "";
  const fallbacks = [
    `Pertanyaan yang menarik soal "${topicWord || "bisnis kamu"}"! Untuk jawaban yang lebih tepat, bisa ceritakan lebih detail? Misalnya jenis usaha, skala, dan tantangan utama yang sedang dihadapi.`,
    `Saya ingin bantu kamu dengan topik ini. Bisa ceritakan lebih spesifik? Misalnya: usahamu di bidang apa, sudah berapa lama berjalan, dan apa yang sudah pernah dicoba?`,
    `Topik yang penting! Agar saran saya lebih relevan, boleh share konteks usaha kamu? Misalnya: jenis produk/jasa, target pelanggan, dan kendala utama saat ini.`,
    `Saya siap bantu. Untuk memberikan rekomendasi yang tepat sasaran, ceritakan dulu situasi bisnis kamu secara singkat — jenis usaha, lokasi, dan permasalahan yang paling ingin diselesaikan.`,
  ];
  return pick(fallbacks);
}

// ─── Promosi caption generator ────────────────────────────────────────────────

export function generateCaption(deskripsi: string, platforms: string[]): string {
  const d = deskripsi.toLowerCase();

  // Deteksi jenis produk/jasa
  const isKuliner   = /kopi|makanan|minuman|jajan|snack|cake|roti|mie|nasi|bakso|soto|ayam|ikan|dessert|es/.test(d);
  const isFashion   = /baju|kaos|kemeja|dress|celana|tas|sepatu|hijab|dompet|fashion|outfit/.test(d);
  const isJasa      = /jasa|service|cuci|servis|laundry|potong|salon|pijat|kursus|les|konsultan/.test(d);
  const isKerajinan = /kerajinan|handmade|rajut|batik|tenun|ukir|anyam|craft/.test(d);

  // Ambil nama produk / frasa pertama dari deskripsi
  const firstPhrase = deskripsi.split(/[,.\n]/)[0].trim();

  // Deteksi promo dari deskripsi
  const hasPromo  = /promo|diskon|gratis|free|hemat|murah|sale/.test(d);
  const hasBeli2  = /beli 2|2 gratis|buy 2/.test(d);

  let emoji1 = "✨";
  let emoji2 = "🔥";
  let ctaLine = "DM kami atau klik link di bio untuk pemesanan ya! 📲";
  let hashtags = "#UMKMGrow #ProdukLokal #UMKM";

  if (isKuliner) {
    emoji1 = "😋"; emoji2 = "🍽️";
    hashtags = "#KulinerLokal #MakananEnak #UMKMKuliner #JajanLokal #Foodie";
    ctaLine = "Mau coba? Langsung order via WA atau datang langsung ya! 🛵";
  } else if (isFashion) {
    emoji1 = "👗"; emoji2 = "💫";
    hashtags = "#FashionLokal #OOTDIndonesia #BrandLokal #UMKMFashion #StyleHarian";
    ctaLine = "Stok terbatas! Order sekarang sebelum kehabisan 🛒";
  } else if (isJasa) {
    emoji1 = "⚡"; emoji2 = "👍";
    hashtags = "#JasaLokal #UMKMJasa #ServiceTerpercaya #ProfesionalLokal";
    ctaLine = "Hubungi kami sekarang untuk info lebih lanjut dan booking 📞";
  } else if (isKerajinan) {
    emoji1 = "🎨"; emoji2 = "💎";
    hashtags = "#HandmadeIndonesia #KrajinTangan #ArtisanLokal #UMKMKerajinan";
    ctaLine = "Pesan sekarang — setiap item dibuat khusus untukmu 💌";
  }

  const promoLine = hasPromo
    ? hasBeli2 ? "\n\n🎁 Promo spesial: BELI 2 GRATIS 1! Jangan sampai kelewatan!"
               : "\n\n🔖 Ada promo spesial untuk kamu — jangan lewatkan!"
    : "";

  const platformLine = platforms.includes("instagram")
    ? "\n\n💬 Tag temanmu yang harus tahu ini!"
    : platforms.includes("tiktok")
    ? "\n\n👆 Follow untuk konten menarik lainnya!"
    : "";

  const caption =
    `${emoji1} ${firstPhrase}\n\n` +
    `${deskripsi}` +
    `${promoLine}` +
    `${platformLine}\n\n` +
    `${ctaLine}\n\n` +
    `${emoji2} ${hashtags}`;

  return caption;
}

// ─── Rekomendasi usaha generator ─────────────────────────────────────────────

interface RekomendasiResult {
  title: string;
  match: number;
  modal: string;
  profit: string;
  risk: string;
  riskColor: string;
  steps: string[];
  description: string;
}

const REKOMENDASI_DB: Record<string, Record<string, RekomendasiResult>> = {
  Kuliner: {
    "< 1jt": {
      title: "Jualan Snack Kiloan Online",
      match: 94, modal: "Rp 300.000 – Rp 800.000", profit: "Rp 800.000 – Rp 1.500.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Jual snack kiloan via WhatsApp & Instagram. Modal minim, bisa dimulai dari dapur rumah.",
      steps: ["Riset 5 snack paling laris di marketplace", "Beli stok dari grosir Tanah Abang atau supplier lokal", "Foto produk dengan background putih dan posting di IG/WA"],
    },
    "1-5jt": {
      title: "Coffee Booth / Minuman Kekinian",
      match: 97, modal: "Rp 2.000.000 – Rp 5.000.000", profit: "Rp 2.000.000 – Rp 4.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Booth minuman kekinian di area ramai. Produk bisa kopi susu, thai tea, atau matcha.",
      steps: ["Survei lokasi strategis (dekat kampus/kantor)", "Beli peralatan dasar: mesin es, blender, dispenser", "Buat 5-7 menu andalan dan harga kompetitif"],
    },
    "5-15jt": {
      title: "Katering Harian / Nasi Box",
      match: 95, modal: "Rp 5.000.000 – Rp 12.000.000", profit: "Rp 4.000.000 – Rp 8.000.000 / bulan",
      risk: "Sedang", riskColor: "bg-yellow-400/20 text-yellow-200",
      description: "Katering nasi box untuk perkantoran, sekolah, atau acara. Pesanan bisa rutin harian.",
      steps: ["Cari 3 klien anchor (kantor/sekolah) untuk pesanan rutin", "Siapkan dapur dengan standar higienitas", "Buat paket bundling mingguan dengan harga lebih hemat"],
    },
    "> 15jt": {
      title: "Restoran / Warung Makan Modern",
      match: 92, modal: "Rp 15.000.000 – Rp 30.000.000", profit: "Rp 8.000.000 – Rp 20.000.000 / bulan",
      risk: "Sedang", riskColor: "bg-yellow-400/20 text-yellow-200",
      description: "Warung makan dengan konsep modern dan menu spesial. Bisa dimulai dari ruko kecil.",
      steps: ["Tentukan konsep unik dan menu signature", "Pilih lokasi dengan traffic tinggi dan parkir mudah", "Daftar di GoFood, GrabFood, dan ShopeeFood sejak hari pertama"],
    },
  },
  Jasa: {
    "< 1jt": {
      title: "Jasa Desain Grafis Freelance",
      match: 96, modal: "Rp 0 – Rp 500.000", profit: "Rp 1.500.000 – Rp 5.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Desain logo, banner, konten sosmed untuk UMKM lain. Modal nyaris nol jika sudah punya laptop.",
      steps: ["Buat portofolio 5-10 desain di Canva atau Figma", "Daftar di Sribulancer dan Fiverr dengan harga kompetitif", "Tawarkan ke UMKM sekitar yang belum punya identitas visual"],
    },
    "1-5jt": {
      title: "Laundry Kiloan Rumahan",
      match: 93, modal: "Rp 2.000.000 – Rp 5.000.000", profit: "Rp 2.500.000 – Rp 5.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Laundry kiloan dari rumah. Permintaan tinggi di area kos-kosan dan apartemen.",
      steps: ["Beli 1-2 mesin cuci + pengering kapasitas 7-10kg", "Pasang spanduk di depan rumah dan daftarkan di Google Maps", "Tawarkan antar-jemput gratis untuk radius 1 km"],
    },
    "5-15jt": {
      title: "Studio Foto Produk / Content Creator",
      match: 91, modal: "Rp 5.000.000 – Rp 15.000.000", profit: "Rp 5.000.000 – Rp 12.000.000 / bulan",
      risk: "Sedang", riskColor: "bg-yellow-400/20 text-yellow-200",
      description: "Layanan foto produk untuk UMKM yang mau jualan online. Permintaan sangat tinggi.",
      steps: ["Siapkan studio mini dengan backdrop dan lighting set", "Buat paket: 10 foto Rp 150rb, 30 foto Rp 350rb", "Target UMKM yang baru mulai jualan di marketplace"],
    },
    "> 15jt": {
      title: "Digital Marketing Agency untuk UMKM",
      match: 90, modal: "Rp 15.000.000 – Rp 25.000.000", profit: "Rp 10.000.000 – Rp 30.000.000 / bulan",
      risk: "Sedang", riskColor: "bg-yellow-400/20 text-yellow-200",
      description: "Agency yang fokus bantu UMKM kelola sosmed, iklan, dan konten. Market masih sangat luas.",
      steps: ["Mulai dengan 3-5 klien UMKM dengan paket Rp 1-3 juta/bulan", "Rekrut 1 content creator dan 1 ads specialist", "Bangun case study dan testimoni untuk akuisisi klien baru"],
    },
  },
  Fashion: {
    "< 1jt": {
      title: "Reseller Fashion Online",
      match: 95, modal: "Rp 300.000 – Rp 1.000.000", profit: "Rp 1.000.000 – Rp 3.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Resell baju dari supplier Tanah Abang atau Shopee via WA dan Instagram.",
      steps: ["Pilih niche spesifik: hijab, baju anak, atau fashion pria", "Foto produk dengan model atau flat lay yang menarik", "Bangun komunitas pembeli di grup WA"],
    },
    "1-5jt": {
      title: "Thrift Shop / Preloved Online",
      match: 94, modal: "Rp 1.000.000 – Rp 4.000.000", profit: "Rp 2.000.000 – Rp 5.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Jual fashion preloved branded. Tren thrift sedang sangat tinggi terutama di Gen Z.",
      steps: ["Cari stok dari garage sale, donasi, atau thrift market", "Cuci, rapikan, dan foto dengan konsep aesthetic", "Jual via Instagram, TikTok, dan Depop/Carousell"],
    },
    "5-15jt": {
      title: "Brand Fashion Lokal (Private Label)",
      match: 88, modal: "Rp 5.000.000 – Rp 15.000.000", profit: "Rp 4.000.000 – Rp 10.000.000 / bulan",
      risk: "Sedang", riskColor: "bg-yellow-400/20 text-yellow-200",
      description: "Buat brand fashion sendiri dengan produksi di konveksi lokal. Margin lebih tinggi.",
      steps: ["Tentukan niche dan identitas brand yang unik", "Cari konveksi lokal untuk minimum order 50-100 pcs", "Launch via Instagram dengan campaign pre-order"],
    },
    "> 15jt": {
      title: "Toko Fashion Multi-Brand",
      match: 87, modal: "Rp 20.000.000 – Rp 35.000.000", profit: "Rp 8.000.000 – Rp 20.000.000 / bulan",
      risk: "Sedang", riskColor: "bg-yellow-400/20 text-yellow-200",
      description: "Toko fashion offline + online dengan berbagai brand lokal pilihan.",
      steps: ["Pilih lokasi di area pasar atau dekat sekolah/kampus", "Kurasi 10-15 brand lokal berkualitas untuk dijual", "Buat loyalty program dan live selling mingguan"],
    },
  },
  Teknologi: {
    "1-5jt": {
      title: "Jasa Service HP & Aksesori",
      match: 92, modal: "Rp 2.000.000 – Rp 5.000.000", profit: "Rp 3.000.000 – Rp 6.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Service HP, ganti baterai/LCD, plus jual aksesori. Permintaan stabil sepanjang tahun.",
      steps: ["Ikuti kursus service HP (banyak yang online 1-2 minggu)", "Beli toolkit dan stok spare part HP populer", "Sewa kios kecil di dekat sekolah atau perkantoran"],
    },
    "5-15jt": {
      title: "Jasa Pembuatan Website UMKM",
      match: 91, modal: "Rp 500.000 – Rp 2.000.000", profit: "Rp 5.000.000 – Rp 15.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Buat website sederhana untuk UMKM lain. Harga Rp 1-3 juta per website.",
      steps: ["Pelajari WordPress atau Webflow (cukup 2-4 minggu)", "Buat 3 website portofolio untuk UMKM kerabat", "Tawarkan ke komunitas UMKM dan grup Facebook bisnis lokal"],
    },
    "> 15jt": {
      title: "Toko Komputer & Laptop",
      match: 89, modal: "Rp 20.000.000 – Rp 40.000.000", profit: "Rp 5.000.000 – Rp 15.000.000 / bulan",
      risk: "Sedang", riskColor: "bg-yellow-400/20 text-yellow-200",
      description: "Toko laptop dan komputer baru/bekas plus jasa service dan upgrade.",
      steps: ["Mulai dengan laptop bekas berkualitas (lebih cepat perputaran)", "Jalin mitra dengan distributor resmi untuk laptop baru", "Buka layanan service dan upgrade RAM/SSD dengan margin tinggi"],
    },
  },
  Kerajinan: {
    "< 1jt": {
      title: "Kerajinan Tangan dari Bahan Daur Ulang",
      match: 93, modal: "Rp 100.000 – Rp 500.000", profit: "Rp 500.000 – Rp 2.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Produk kerajinan dari bahan bekas: pot bunga, tempat lilin, hiasan dinding.",
      steps: ["Pilih 1-2 jenis produk untuk fokus", "Foto dengan lighting natural yang bagus", "Jual via Tokopedia, Shopee, dan Instagram"],
    },
    "1-5jt": {
      title: "Bisnis Lilin Aromaterapi / Soy Candle",
      match: 95, modal: "Rp 500.000 – Rp 2.000.000", profit: "Rp 2.000.000 – Rp 5.000.000 / bulan",
      risk: "Rendah", riskColor: "bg-green-400/20 text-green-200",
      description: "Lilin soy wax dengan aroma dan kemasan cantik. Sangat populer sebagai hampers.",
      steps: ["Beli bahan baku: soy wax, fragrance oil, sumbu, wadah", "Buat 5-8 varian aroma dan kemasan yang instagrammable", "Target pasar: gift shop, hampers lebaran/natal, dan self-care"],
    },
    "5-15jt": {
      title: "Workshop Kerajinan + Jual Online",
      match: 90, modal: "Rp 3.000.000 – Rp 10.000.000", profit: "Rp 4.000.000 – Rp 8.000.000 / bulan",
      risk: "Sedang", riskColor: "bg-yellow-400/20 text-yellow-200",
      description: "Jual produk kerajinan premium sekaligus buka kelas workshop online/offline.",
      steps: ["Produksi batch pertama 50-100 pcs untuk stok awal", "Buat konten tutorial singkat di TikTok/YouTube untuk awareness", "Buka kelas workshop Rp 150-300rb/orang sebagai revenue tambahan"],
    },
  },
};

export function generateRekomendasi(
  minat: string[],
  modal: string,
  lokasi: string,
): RekomendasiResult {
  // Coba cari rekomendasi spesifik berdasarkan minat + modal
  for (const m of minat) {
    const db = REKOMENDASI_DB[m];
    if (db) {
      const result = db[modal];
      if (result) {
        // Sesuaikan deskripsi dengan lokasi jika ada
        if (lokasi) {
          const r = { ...result };
          r.steps = r.steps.map((s) =>
            s.includes("lokasi") ? s.replace("lokasi", lokasi) : s
          );
          return r;
        }
        return result;
      }
    }
  }

  // Fallback generik jika kombinasi tidak ditemukan
  const modalLabel: Record<string, string> = {
    "< 1jt": "Rp 500.000 – Rp 1.000.000",
    "1-5jt": "Rp 1.000.000 – Rp 5.000.000",
    "5-15jt": "Rp 5.000.000 – Rp 15.000.000",
    "> 15jt": "Rp 15.000.000 – Rp 30.000.000",
  };
  return {
    title: "Usaha Jasa & Konsultasi Online",
    match: 85,
    modal: modalLabel[modal] ?? "Sesuai rencana",
    profit: "Rp 2.000.000 – Rp 8.000.000 / bulan",
    risk: "Rendah",
    riskColor: "bg-green-400/20 text-green-200",
    description: "Manfaatkan keahlian dan minat kamu untuk menawarkan jasa secara online.",
    steps: [
      "Identifikasi keahlian utama kamu dan potensi pasarnya",
      "Buat profil profesional di LinkedIn dan platform freelance",
      `Tawarkan jasa ke komunitas UMKM${lokasi ? ` di ${lokasi}` : " sekitar kamu"}`,
    ],
  };
}
