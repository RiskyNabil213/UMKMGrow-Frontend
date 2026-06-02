"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Briefcase, MapPin, Building2, DollarSign,
  Clock, Users, CheckCircle, Send, Loader2, FileText,
  Phone, Mail, User, Calendar,
} from "lucide-react";

const JOBS = [
  {
    id: 1,
    title: "Kasir Toko",
    company: "Toko Sembako Berkah",
    location: "Jakarta Timur",
    type: "Full Time",
    salary: "Rp 3.500.000",
    color: "bg-orange-100 text-orange-600",
    initials: "TS",
    posted: "3 hari lalu",
    applicants: 12,
    desc: "Kami mencari kasir yang ramah, jujur, dan teliti untuk bergabung bersama tim kami. Kamu akan bertanggung jawab melayani pelanggan, mengelola transaksi, dan menjaga kebersihan area kasir.",
    requirements: [
      "Pendidikan minimal SMA/SMK sederajat",
      "Pengalaman sebagai kasir minimal 6 bulan (diutamakan)",
      "Mampu mengoperasikan mesin kasir dan komputer",
      "Jujur, teliti, dan bertanggung jawab",
      "Bersedia bekerja shift dan hari libur nasional",
    ],
    benefits: ["Gaji pokok + bonus", "BPJS Kesehatan & Ketenagakerjaan", "Makan siang", "Seragam kerja"],
    contact: "0812-3456-7890",
  },
  {
    id: 2,
    title: "Barista",
    company: "Kopi Janji Jiwa",
    location: "Jakarta Selatan",
    type: "Full Time",
    salary: "Rp 4.000.000",
    color: "bg-amber-100 text-amber-700",
    initials: "KJ",
    posted: "1 hari lalu",
    applicants: 28,
    desc: "Bergabunglah sebagai Barista di Kopi Janji Jiwa! Kamu akan menyajikan minuman berkualitas tinggi kepada pelanggan kami yang setia. Kami mencari individu yang passionate terhadap kopi dan pelayanan pelanggan.",
    requirements: [
      "Pengalaman sebagai barista minimal 1 tahun",
      "Menguasai teknik pembuatan espresso dan latte art",
      "Komunikatif dan ramah",
      "Bersedia bekerja shift pagi/sore",
      "Berpenampilan rapi dan bersih",
    ],
    benefits: ["Gaji pokok + tips", "BPJS Kesehatan", "Pelatihan barista lanjutan", "Diskon produk 50%"],
    contact: "0821-9876-5432",
  },
  {
    id: 3,
    title: "Admin Online Shop",
    company: "Fashion Kita",
    location: "Jakarta Barat",
    type: "Part Time",
    salary: "Rp 2.000.000",
    color: "bg-pink-100 text-pink-600",
    initials: "FK",
    posted: "5 hari lalu",
    applicants: 19,
    desc: "Fashion Kita membuka lowongan Admin Online Shop part-time. Kamu akan mengelola toko online di berbagai marketplace, membalas chat pelanggan, dan memproses pesanan.",
    requirements: [
      "Familiar dengan marketplace (Shopee, Tokopedia, dll)",
      "Mampu mengetik cepat dan komunikatif",
      "Memiliki smartphone/laptop sendiri",
      "Bisa bekerja dari rumah (WFH)",
      "Tersedia 4-5 jam per hari",
    ],
    benefits: ["Gaji per jam", "WFH penuh", "Bonus performa", "Fleksibel waktu"],
    contact: "0813-5555-6666",
  },
  {
    id: 4,
    title: "Content Creator",
    company: "Kuliner Enak",
    location: "Remote",
    type: "Freelance",
    salary: "Project Based",
    color: "bg-teal-100 text-teal-600",
    initials: "KE",
    posted: "2 hari lalu",
    applicants: 35,
    desc: "Kuliner Enak mencari Content Creator freelance untuk membuat konten foto dan video produk makanan kami. Konten akan digunakan untuk Instagram, TikTok, dan marketplace.",
    requirements: [
      "Memiliki kamera/smartphone dengan kamera bagus",
      "Pengalaman membuat konten food photography",
      "Menguasai editing foto/video (Lightroom, CapCut, dll)",
      "Kreatif dan mengikuti tren konten terkini",
      "Portofolio konten makanan diutamakan",
    ],
    benefits: ["Bayaran per project", "Fleksibel waktu & tempat", "Produk gratis untuk konten", "Potensi kontrak jangka panjang"],
    contact: "0877-1234-5678",
  },
];

const INPUT = "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

const TYPE_COLORS: Record<string, string> = {
  "Full Time": "bg-blue-50 text-blue-600",
  "Part Time": "bg-purple-50 text-purple-600",
  "Freelance": "bg-teal-50 text-teal-600",
};

export default function LowonganDetailPage() {
  const { id } = useParams();
  const router  = useRouter();
  const job     = JOBS.find((j) => j.id === Number(id));

  const [form, setForm] = useState({ name: "", email: "", phone: "", experience: "", message: "" });
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto pt-20 text-center space-y-4">
        <Briefcase size={40} className="text-gray-300 mx-auto" />
        <p className="font-bold text-gray-500">Lowongan tidak ditemukan</p>
        <button onClick={() => router.push("/lowongan")}
          className="text-indigo-600 font-semibold text-sm hover:underline">
          ← Kembali ke daftar lowongan
        </button>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Nama, email, dan nomor HP wajib diisi."); return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto pt-20 pb-20 text-center space-y-6 px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={36} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">Lamaran Terkirim! 🎉</h2>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Lamaran kamu untuk posisi <strong>{job.title}</strong> di <strong>{job.company}</strong> sudah berhasil dikirim. Tim HR akan menghubungi kamu dalam 3-5 hari kerja.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-left space-y-2">
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Langkah Selanjutnya</p>
          {["Cek email kamu secara berkala", "Siapkan CV dan portofolio terbaru", "Pelajari lebih lanjut tentang perusahaan"].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-indigo-600">
              <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
        <button onClick={() => router.push("/lowongan")}
          className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all">
          Lihat Lowongan Lainnya
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Back */}
      <button onClick={() => router.push("/lowongan")}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-semibold">
        <ArrowLeft size={16} /> Kembali ke Lowongan
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Detail kiri ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${job.color}`}>
                {job.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black text-gray-800">{job.title}</h1>
                <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1.5">
                  <Building2 size={13} /> {job.company}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <MapPin size={11} className="text-indigo-400" /> {job.location}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${TYPE_COLORS[job.type] ?? "bg-gray-100 text-gray-600"}`}>
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    <DollarSign size={11} /> {job.salary}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Clock size={11} /> Diposting {job.posted}</span>
              <span className="flex items-center gap-1"><Users size={11} /> {job.applicants} pelamar</span>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" /> Deskripsi Pekerjaan
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{job.desc}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Persyaratan</h3>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" /> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Benefit</h3>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((b) => (
                  <span key={b} className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
                    ✓ {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Form lamaran kanan ── */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-1">Kirim Lamaran</h3>
            <p className="text-xs text-gray-400 mb-5">Isi form di bawah untuk melamar posisi ini</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Nama Lengkap *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Nama kamu" className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <div>
                <label className={LABEL}>Email *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="kamu@email.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <div>
                <label className={LABEL}>No. WhatsApp *</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="0812-xxxx-xxxx" className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <div>
                <label className={LABEL}>Pengalaman Kerja</label>
                <input name="experience" value={form.experience} onChange={handleChange}
                  placeholder="Contoh: 1 tahun sebagai kasir" className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Pesan / Motivasi</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Ceritakan kenapa kamu cocok untuk posisi ini..."
                  className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all resize-none" />
              </div>

              {error && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</> : <><Send size={15} /> Kirim Lamaran</>}
              </button>
            </form>
          </div>

          {/* Kontak langsung */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Atau Hubungi Langsung</p>
            <a href={`https://wa.me/62${job.contact.replace(/[^0-9]/g, "").slice(1)}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
              <Phone size={14} /> {job.contact}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
