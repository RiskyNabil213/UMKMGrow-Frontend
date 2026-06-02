"use client";

import { useState } from "react";
import {
  Lightbulb, Target, ArrowRight, Wallet, MapPin, Sparkles,
  ArrowLeft, MessageSquare, TrendingUp, AlertTriangle, Crown, Lock,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/UserContext";
import { generateRekomendasi } from "@/lib/ai-engine";

const MINAT_OPTIONS = [
  "Kuliner", "Jasa", "Teknologi", "Kerajinan",
  "Fashion", "Pendidikan", "Kesehatan", "Pertanian",
];
const MODAL_OPTIONS = [
  { label: "Di bawah Rp 1 Juta",  value: "< 1jt"  },
  { label: "Rp 1 – 5 Juta",       value: "1-5jt"  },
  { label: "Rp 5 – 15 Juta",      value: "5-15jt" },
  { label: "Di atas Rp 15 Juta",  value: "> 15jt" },
];

export default function RekomendasiPage() {
  const { isPremium } = useAuth();
  const [loading,       setLoading]       = useState(false);
  const [result,        setResult]        = useState<any>(null);
  const [selectedMinat, setSelectedMinat] = useState<string[]>([]);
  const [lokasi,        setLokasi]        = useState("");
  const [modal,         setModal]         = useState("");

  const toggleMinat = (tag: string) =>
    setSelectedMinat((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const generateIdea = () => {
    setLoading(true); setResult(null);
    setTimeout(() => {
      const res = generateRekomendasi(selectedMinat, modal, lokasi);
      setResult(res);
      setLoading(false);
    }, 2200);
  };

  // ── Gate: non-premium ──────────────────────────────────────────────────────
  if (!isPremium) {
    return (
      <div className="max-w-lg mx-auto pt-16 pb-20 text-center space-y-6 px-4">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto">
          <Lock size={32} className="text-indigo-300" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-800">Fitur Premium</h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Rekomendasi Usaha AI hanya tersedia untuk pengguna Premium. Upgrade sekarang untuk mendapatkan ide bisnis yang dipersonalisasi.
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown size={20} className="text-yellow-300" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Upgrade ke Premium</p>
              <p className="text-indigo-200 text-xs">Mulai dari Rp 99.000 / bulan</p>
            </div>
          </div>
          <ul className="text-left space-y-2">
            {["Rekomendasi usaha AI tanpa batas", "AI Konsultasi bisnis personal", "Akses komunitas eksklusif"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-indigo-100">
                <Sparkles size={13} className="text-yellow-300 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link href="/upgrade">
            <button className="w-full bg-white text-indigo-700 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all">
              Lihat Paket Premium →
            </button>
          </Link>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:underline">
          <ArrowLeft size={14} /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // ── Halaman utama (premium) ────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/" className="w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Sparkles size={22} className="text-indigo-600" /> Rekomendasi Usaha AI
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Beri tahu kami budget dan minatmu, AI akan mencarikan peluang terbaik.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6 h-fit">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Isi Data Kamu</h3>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Wallet size={15} className="text-indigo-500" /> Modal Tersedia</label>
            <select value={modal} onChange={(e) => setModal(e.target.value)}
              className="w-full appearance-none bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all">
              <option value="">Pilih rentang modal...</option>
              {MODAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><MapPin size={15} className="text-indigo-500" /> Lokasi Usaha</label>
            <input type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)}
              placeholder="Misal: Dekat kampus, perumahan, pusat kota..."
              className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all" />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Target size={15} className="text-indigo-500" /> Minat / Keahlian
              <span className="text-[10px] text-gray-400 font-normal">(pilih beberapa)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {MINAT_OPTIONS.map((tag) => {
                const active = selectedMinat.includes(tag);
                return (
                  <button key={tag} onClick={() => toggleMinat(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                      active ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}>
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={generateIdea} disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-indigo-100">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> AI Sedang Menganalisis...</>
              : <>Cari Ide Usaha <ArrowRight size={18} /></>}
          </button>
        </div>

        <div className="relative min-h-[420px]">
          {!result && !loading && (
            <div className="h-full min-h-[420px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-10 gap-4">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center">
                <Lightbulb size={36} className="text-indigo-300" />
              </div>
              <div>
                <p className="font-bold text-gray-500">Hasil AI akan muncul di sini</p>
                <p className="text-sm text-gray-400 mt-1">Isi form di sebelah kiri dan klik "Cari Ide Usaha"</p>
              </div>
            </div>
          )}
          {loading && (
            <div className="h-full min-h-[420px] bg-white border border-gray-100 rounded-3xl flex flex-col items-center justify-center p-10 gap-5 shadow-sm">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-indigo-100 rounded-3xl animate-ping opacity-40" />
                <div className="relative w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200">
                  <Sparkles size={36} className="text-white animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-indigo-700">Menganalisis tren pasar...</p>
                <p className="text-sm text-gray-400">AI sedang memproses data untuk kamu</p>
              </div>
            </div>
          )}
          {result && (
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full">
                  <TrendingUp size={14} className="text-green-300" />
                  <span className="text-xs font-bold">Match {result.match}%</span>
                </div>
                <Sparkles size={20} className="text-yellow-300" />
              </div>
              <div>
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Rekomendasi Terbaik</p>
                <h3 className="text-2xl font-black leading-tight">{result.title}</h3>
                {result.description && (
                  <p className="text-indigo-200 text-sm mt-2 leading-relaxed">{result.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-1">Modal Awal</p>
                  <p className="font-bold text-sm">{result.modal}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-1">Est. Laba</p>
                  <p className="font-bold text-sm">{result.profit}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-indigo-200" />
                <span className="text-xs text-indigo-200">Tingkat Risiko:</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${result.riskColor}`}>{result.risk}</span>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider border-b border-white/20 pb-2">Langkah Awal</p>
                {result.steps.map((step: string, i: number) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <Link href="/ai-chat">
                <button className="w-full bg-white text-indigo-700 py-3.5 rounded-2xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <MessageSquare size={16} /> Konsultasi Detail Ini
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
