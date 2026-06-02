"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, MapPin, Star, Phone, Mail,
  User, MessageSquare, Send, Loader2, CheckCircle,
  ShoppingBag, Leaf, Box, Shirt, Cpu, Tag, Clock,
  Shield, Truck,
} from "lucide-react";

const SUPPLIERS = [
  {
    id: 1,
    name: "Grosir Sembako Jaya",
    category: "Bahan Pangan",
    location: "Bekasi",
    distance: "2.5 km",
    rating: 4.8,
    reviews: 128,
    price: "Termurah",
    priceColor: "bg-green-100 text-green-700",
    icon: ShoppingBag,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    phone: "0812-3456-7890",
    email: "grosir.sembako@email.com",
    whatsapp: "6281234567890",
    desc: "Grosir Sembako Jaya adalah distributor bahan pangan terpercaya yang telah berdiri sejak 2010. Kami menyediakan berbagai kebutuhan sembako dengan harga grosir terbaik dan kualitas terjamin.",
    products: ["Beras premium & medium", "Minyak goreng", "Gula pasir", "Tepung terigu", "Bumbu dapur lengkap"],
    minOrder: "Rp 500.000",
    delivery: "Gratis ongkir area Bekasi & Jakarta",
    payment: ["Transfer Bank", "COD", "QRIS"],
    certifications: ["Halal MUI", "BPOM", "ISO 9001"],
    hours: "Senin–Sabtu, 07.00–17.00",
  },
  {
    id: 2,
    name: "Plastik Pack Mandiri",
    category: "Kemasan",
    location: "Jakarta",
    distance: "5.0 km",
    rating: 4.5,
    reviews: 87,
    price: "Bersaing",
    priceColor: "bg-blue-100 text-blue-700",
    icon: Box,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    phone: "0821-9876-5432",
    email: "plastikpack@email.com",
    whatsapp: "6282198765432",
    desc: "Plastik Pack Mandiri menyediakan berbagai solusi kemasan untuk UMKM. Dari plastik standing pouch, box karton, hingga label custom. Kami melayani order dalam jumlah kecil maupun besar.",
    products: ["Standing pouch", "Box karton custom", "Plastik klip", "Label stiker", "Bubble wrap"],
    minOrder: "Rp 200.000",
    delivery: "Pengiriman ke seluruh Indonesia",
    payment: ["Transfer Bank", "QRIS", "Marketplace"],
    certifications: ["SNI", "Food Grade"],
    hours: "Senin–Jumat, 08.00–17.00",
  },
  {
    id: 3,
    name: "Tani Makmur Group",
    category: "Sayur & Buah",
    location: "Bogor",
    distance: "10 km",
    rating: 4.9,
    reviews: 214,
    price: "Grosir",
    priceColor: "bg-teal-100 text-teal-700",
    icon: Leaf,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    phone: "0813-1111-2222",
    email: "tanimakmur@email.com",
    whatsapp: "6281311112222",
    desc: "Tani Makmur Group adalah kelompok tani modern yang menyuplai sayur dan buah segar langsung dari kebun ke meja makan. Produk kami bebas pestisida berlebih dan dipanen setiap hari.",
    products: ["Sayuran hijau segar", "Buah-buahan lokal", "Rempah-rempah", "Produk organik", "Paket sayur harian"],
    minOrder: "Rp 300.000",
    delivery: "Pengiriman pagi hari (subuh–07.00)",
    payment: ["Transfer Bank", "COD", "QRIS"],
    certifications: ["Organik Tersertifikasi", "GAP (Good Agricultural Practice)"],
    hours: "Setiap hari, 04.00–12.00",
  },
  {
    id: 4,
    name: "Batik Nusantara",
    category: "Fashion",
    location: "Yogyakarta",
    distance: "Remote",
    rating: 4.7,
    reviews: 63,
    price: "Grosir",
    priceColor: "bg-pink-100 text-pink-700",
    icon: Shirt,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    phone: "0877-3333-4444",
    email: "batiknusantara@email.com",
    whatsapp: "6287733334444",
    desc: "Batik Nusantara adalah produsen batik tulis dan cap berkualitas tinggi dari Yogyakarta. Kami melayani pemesanan grosir untuk reseller, toko fashion, dan souvenir perusahaan.",
    products: ["Batik tulis premium", "Batik cap", "Kain batik meteran", "Baju batik jadi", "Souvenir batik custom"],
    minOrder: "Rp 1.000.000",
    delivery: "Pengiriman via JNE/J&T ke seluruh Indonesia",
    payment: ["Transfer Bank", "Marketplace"],
    certifications: ["Batik Mark Indonesia", "Hak Cipta Motif"],
    hours: "Senin–Sabtu, 08.00–16.00",
  },
  {
    id: 5,
    name: "TechParts Indonesia",
    category: "Elektronik",
    location: "Surabaya",
    distance: "Remote",
    rating: 4.6,
    reviews: 45,
    price: "Bersaing",
    priceColor: "bg-purple-100 text-purple-700",
    icon: Cpu,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    phone: "0856-5555-6666",
    email: "techparts@email.com",
    whatsapp: "6285655556666",
    desc: "TechParts Indonesia adalah distributor komponen elektronik dan aksesoris gadget untuk toko elektronik dan bengkel servis. Kami menyediakan produk original dan KW berkualitas dengan harga kompetitif.",
    products: ["Komponen HP & laptop", "Aksesoris gadget", "Kabel & charger", "Tools servis", "Spare part elektronik"],
    minOrder: "Rp 500.000",
    delivery: "Pengiriman via ekspedisi terpercaya",
    payment: ["Transfer Bank", "QRIS", "Marketplace"],
    certifications: ["Distributor Resmi", "Garansi Produk"],
    hours: "Senin–Jumat, 09.00–17.00",
  },
  {
    id: 6,
    name: "Kemasan Kreatif Co.",
    category: "Kemasan",
    location: "Tangerang",
    distance: "7 km",
    rating: 4.4,
    reviews: 52,
    price: "Termurah",
    priceColor: "bg-green-100 text-green-700",
    icon: Package,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    phone: "0819-7777-8888",
    email: "kemasankreatif@email.com",
    whatsapp: "6281977778888",
    desc: "Kemasan Kreatif Co. spesialis kemasan unik dan menarik untuk produk UMKM. Kami membantu brand kamu tampil profesional dengan kemasan custom yang terjangkau.",
    products: ["Box custom printing", "Paper bag branded", "Stiker label custom", "Kemasan makanan", "Packaging premium"],
    minOrder: "Rp 150.000",
    delivery: "Gratis ongkir area Tangerang & Jakarta",
    payment: ["Transfer Bank", "COD", "QRIS"],
    certifications: ["Food Grade", "Ramah Lingkungan"],
    hours: "Senin–Sabtu, 08.00–18.00",
  },
];

const INPUT = "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

export default function SupplierDetailPage() {
  const { id } = useParams();
  const router  = useRouter();
  const supplier = SUPPLIERS.find((s) => s.id === Number(id));

  const [form, setForm] = useState({ name: "", business: "", phone: "", email: "", need: "", message: "" });
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  if (!supplier) {
    return (
      <div className="max-w-2xl mx-auto pt-20 text-center space-y-4">
        <Package size={40} className="text-gray-300 mx-auto" />
        <p className="font-bold text-gray-500">Supplier tidak ditemukan</p>
        <button onClick={() => router.push("/supplier")}
          className="text-indigo-600 font-semibold text-sm hover:underline">
          ← Kembali ke daftar supplier
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
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Nama dan nomor HP wajib diisi."); return;
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
          <h2 className="text-2xl font-black text-gray-800">Pesan Terkirim! 🎉</h2>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Permintaan kontak kamu ke <strong>{supplier.name}</strong> sudah terkirim. Supplier akan menghubungi kamu dalam 1×24 jam.
          </p>
        </div>
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-left">
          <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Atau Hubungi Langsung</p>
          <a href={`https://wa.me/${supplier.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700">
            <Phone size={14} /> {supplier.phone} (WhatsApp)
          </a>
        </div>
        <button onClick={() => router.push("/supplier")}
          className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all">
          Lihat Supplier Lainnya
        </button>
      </div>
    );
  }

  const IconComp = supplier.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Back */}
      <button onClick={() => router.push("/supplier")}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-semibold">
        <ArrowLeft size={16} /> Kembali ke Supplier
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Detail kiri ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 ${supplier.iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                <IconComp size={28} className={supplier.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black text-gray-800">{supplier.name}</h1>
                <p className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${supplier.iconColor}`}>{supplier.category}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <MapPin size={11} className="text-indigo-400" /> {supplier.location}
                    {supplier.distance !== "Remote" && <span className="text-gray-400"> · {supplier.distance}</span>}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${supplier.priceColor}`}>
                    Harga {supplier.price}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                    <Star size={11} fill="currentColor" /> {supplier.rating} ({supplier.reviews} ulasan)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info detail */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Tentang Supplier</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{supplier.desc}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Tag size={15} className="text-indigo-600" /> Produk yang Tersedia
              </h3>
              <div className="flex flex-wrap gap-2">
                {supplier.products.map((p) => (
                  <span key={p} className="text-xs font-semibold bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-100">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Min. Order</p>
                <p className="text-sm font-bold text-gray-700">{supplier.minOrder}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jam Operasional</p>
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Clock size={12} className="text-indigo-400" /> {supplier.hours}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pengiriman</p>
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Truck size={12} className="text-green-500" /> {supplier.delivery}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Metode Pembayaran</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {supplier.payment.map((p) => (
                    <span key={p} className="text-[10px] font-semibold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Shield size={15} className="text-green-600" /> Sertifikasi & Kepercayaan
              </h3>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((c) => (
                  <span key={c} className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
                    <CheckCircle size={11} /> {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Form kontak kanan ── */}
        <div className="space-y-4">

          {/* Kontak cepat */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-800 text-sm">Hubungi Langsung</h3>
            <a href={`https://wa.me/${supplier.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-colors">
              <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-700">WhatsApp</p>
                <p className="text-xs text-green-600">{supplier.phone}</p>
              </div>
            </a>
            <a href={`mailto:${supplier.email}`}
              className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors">
              <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                <Mail size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-700">Email</p>
                <p className="text-xs text-indigo-600 truncate">{supplier.email}</p>
              </div>
            </a>
          </div>

          {/* Form pesan */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-600" /> Kirim Pesan
            </h3>
            <p className="text-xs text-gray-400 mb-5">Isi form untuk menghubungi supplier</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={LABEL}>Nama Kamu *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Nama lengkap" className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <div>
                <label className={LABEL}>Nama Usaha</label>
                <input name="business" value={form.business} onChange={handleChange}
                  placeholder="Nama toko / usaha kamu" className={INPUT} />
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
                <label className={LABEL}>Produk yang Dibutuhkan</label>
                <input name="need" value={form.need} onChange={handleChange}
                  placeholder="Contoh: Beras 50kg, Minyak 20L" className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Pesan</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Ceritakan kebutuhan kamu lebih detail..."
                  className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all resize-none" />
              </div>

              {error && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</> : <><Send size={15} /> Kirim Pesan</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
