"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, MapPin, Star, Phone,
  User, MessageSquare, Send, Loader2, CheckCircle,
  Tag, Shield, Truck,
} from "lucide-react";
import { useKonten } from "@/context/KontenContext";

const INPUT = "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

export default function SupplierDetailPage() {
  const { id } = useParams();
  const router  = useRouter();
  const { supplier: suppliers } = useKonten();

  const supplier = suppliers.find((s) => s.id === Number(id));

  const [form, setForm] = useState({ name: "", business: "", phone: "", need: "", message: "" });
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
            Permintaan kontak kamu ke <strong>{supplier.name}</strong> sudah terkirim.
          </p>
        </div>
        {supplier.contact && (
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-left">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">Atau Hubungi Langsung</p>
            <a href={`https://wa.me/62${supplier.contact.replace(/[^0-9]/g, "").replace(/^0/, "")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700">
              <Phone size={14} /> {supplier.contact} (WhatsApp)
            </a>
          </div>
        )}
        <button onClick={() => router.push("/supplier")}
          className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all">
          Lihat Supplier Lainnya
        </button>
      </div>
    );
  }

  const initials = supplier.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <button onClick={() => router.push("/supplier")}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-semibold">
        <ArrowLeft size={16} /> Kembali ke Supplier
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 text-orange-600">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black text-gray-800">{supplier.name}</h1>
                <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mt-0.5">{supplier.category}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <MapPin size={11} className="text-indigo-400" /> {supplier.location}
                  </span>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                    Harga {supplier.price}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                    <Star size={11} fill="currentColor" /> {supplier.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Tentang Supplier</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>{supplier.name}</strong> adalah supplier kategori <strong>{supplier.category}</strong> berlokasi di {supplier.location}.
                Menyediakan produk dengan harga {supplier.price} dan rating {supplier.rating}/5.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kategori</p>
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Tag size={12} className="text-indigo-400" /> {supplier.category}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Harga</p>
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Truck size={12} className="text-green-500" /> {supplier.price}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lokasi</p>
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <MapPin size={12} className="text-indigo-400" /> {supplier.location}
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rating</p>
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Shield size={12} className="text-green-500" /> {supplier.rating} / 5.0
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {supplier.contact && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 text-sm">Hubungi Langsung</h3>
              <a href={`https://wa.me/62${supplier.contact.replace(/[^0-9]/g, "").replace(/^0/, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-colors">
                <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700">WhatsApp</p>
                  <p className="text-xs text-green-600">{supplier.contact}</p>
                </div>
              </a>
            </div>
          )}

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
