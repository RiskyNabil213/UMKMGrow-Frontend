"use client";

import { useState } from "react";
import {
  Users, MessageSquare, Trophy, BookOpen, Heart,
  Crown, Lock, Sparkles, ArrowLeft, Bell, CheckCircle,
  ThumbsUp, Share2, TrendingUp, Star,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/UserContext";

// ─── Data dummy feed ──────────────────────────────────────────────────────────
const POSTS = [
  {
    id: 1,
    avatar: "BS",
    name: "Budi Santoso",
    business: "Warung Budi",
    time: "2 jam lalu",
    content: "Alhamdulillah bulan ini omzet naik 40% setelah pakai strategi bundling produk yang disarankan AI. Terima kasih UMKM Grow+ 🎉",
    likes: 24,
    comments: 8,
    tag: "Sukses",
    tagColor: "bg-green-100 text-green-600",
  },
  {
    id: 2,
    avatar: "SR",
    name: "Siti Rahayu",
    business: "Toko Siti",
    time: "5 jam lalu",
    content: "Ada yang punya rekomendasi supplier bahan baku makanan di Bandung? Lagi cari yang harga grosir dan kualitas bagus. Bantu share ya 🙏",
    likes: 12,
    comments: 15,
    tag: "Tanya",
    tagColor: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    avatar: "AF",
    name: "Ahmad Fauzi",
    business: "CV Ahmad",
    time: "1 hari lalu",
    content: "Tips dari saya: pisahkan rekening pribadi dan usaha dari hari pertama. Ini yang bikin laporan keuangan saya jauh lebih rapi dan mudah dipantau.",
    likes: 47,
    comments: 11,
    tag: "Tips",
    tagColor: "bg-purple-100 text-purple-600",
  },
];

const FEATURES = [
  { icon: MessageSquare, label: "Forum Diskusi",    color: "text-indigo-600", bg: "bg-indigo-50"  },
  { icon: Trophy,        label: "Challenge Bisnis", color: "text-orange-600", bg: "bg-orange-50"  },
  { icon: BookOpen,      label: "Artikel & Panduan",color: "text-teal-600",   bg: "bg-teal-50"    },
  { icon: Heart,         label: "Mentoring",        color: "text-pink-600",   bg: "bg-pink-50"    },
];

const STATS = [
  { value: "2.4K+", label: "Anggota Aktif",   icon: Users,      color: "text-indigo-600" },
  { value: "180+",  label: "Diskusi / Bulan",  icon: MessageSquare, color: "text-purple-600" },
  { value: "4.9",   label: "Rating Komunitas", icon: Star,       color: "text-yellow-500" },
  { value: "50+",   label: "Mentor Tersedia",  icon: TrendingUp, color: "text-green-600"  },
];

// ─── Avatar warna ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-600",
  "bg-teal-100 text-teal-600",
  "bg-orange-100 text-orange-600",
];

export default function KomunitasPage() {
  const { isPremium } = useAuth();
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [liked,     setLiked]     = useState<number[]>([]);

  function toggleLike(id: number) {
    setLiked((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  // ── Gate: non-premium ──────────────────────────────────────────────────────
  if (!isPremium) {
    return (
      <div className="max-w-xl mx-auto pt-12 pb-20 space-y-6 px-4">
        {/* Hero lock */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center shadow-2xl shadow-indigo-200">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
              <Lock size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Komunitas Premium</h1>
              <p className="text-indigo-200 text-sm mt-1 leading-relaxed">
                Bergabung dengan 2.400+ pelaku UMKM yang saling berbagi strategi dan inspirasi bisnis.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-left">
              {["Akses forum diskusi tanpa batas", "Ikuti challenge bisnis mingguan", "Mentoring dari pelaku usaha senior", "Perpustakaan artikel & panduan"].map((f) => (
                <div key={f} className="flex items-start gap-2 bg-white/10 rounded-xl p-3">
                  <Sparkles size={13} className="text-yellow-300 shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-100 leading-snug">{f}</p>
                </div>
              ))}
            </div>
            <Link href="/pemilik/upgrade">
              <button className="w-full bg-white text-indigo-700 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center gap-2">
                <Crown size={16} className="text-yellow-500" /> Upgrade ke Premium
              </button>
            </Link>
          </div>
        </div>

        {/* Preview stats */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <Link href="/pemilik" className="flex items-center justify-center gap-2 text-indigo-600 font-semibold text-sm hover:underline">
          <ArrowLeft size={14} /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // ── Halaman komunitas (premium) ────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-7 text-white shadow-xl shadow-indigo-200">
        <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Crown size={11} /> Premium Member
            </div>
            <h1 className="text-2xl font-black leading-tight">Komunitas UMKM Grow+</h1>
            <p className="text-indigo-200 text-sm mt-1">Ruang diskusi eksklusif untuk pelaku usaha Indonesia</p>
          </div>
          <div className="flex gap-3 shrink-0">
            {STATS.slice(0, 2).map((s) => (
              <div key={s.label} className="bg-white/15 rounded-2xl px-4 py-3 text-center min-w-[80px]">
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-[10px] text-indigo-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Feed kiri ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Diskusi Terbaru</h2>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full">Segera Hadir</span>
          </div>

          {POSTS.map((post, i) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              {/* Header post */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                  {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-800">{post.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.tagColor}`}>{post.tag}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">{post.business} · {post.time}</p>
                </div>
              </div>

              {/* Konten */}
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                    liked.includes(post.id) ? "text-indigo-600" : "text-gray-400 hover:text-indigo-500"
                  }`}
                >
                  <ThumbsUp size={14} fill={liked.includes(post.id) ? "currentColor" : "none"} />
                  {post.likes + (liked.includes(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-indigo-500 transition-colors">
                  <MessageSquare size={14} /> {post.comments} Komentar
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-indigo-500 transition-colors ml-auto">
                  <Share2 size={14} /> Bagikan
                </button>
              </div>
            </div>
          ))}

          {/* Coming soon card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
            <p className="text-sm font-bold text-indigo-700">Forum diskusi penuh segera hadir 🚀</p>
            <p className="text-xs text-indigo-400 mt-1">Kamu akan bisa posting, komentar, dan berinteraksi langsung.</p>
          </div>
        </div>

        {/* ── Sidebar kanan ── */}
        <div className="space-y-4">

          {/* Fitur */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Fitur Komunitas</h3>
            <div className="space-y-3">
              {FEATURES.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${f.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <f.icon size={16} className={f.color} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{f.label}</p>
                  <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Segera</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Statistik Komunitas</h3>
            <div className="space-y-3">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <s.icon size={14} className={s.color} />
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                  <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notifikasi */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white space-y-3">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-yellow-300" />
              <p className="font-bold text-sm">Notifikasi Peluncuran</p>
            </div>
            <p className="text-indigo-200 text-xs leading-relaxed">Jadilah yang pertama tahu saat forum penuh diluncurkan.</p>
            {submitted ? (
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2.5">
                <CheckCircle size={14} className="text-green-300" />
                <p className="text-xs font-semibold">Berhasil didaftarkan!</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubmitted(true); }} className="space-y-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email kamu..." required
                  className="w-full bg-white/15 border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all" />
                <button type="submit" className="w-full bg-white text-indigo-700 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all">
                  Daftarkan Saya
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
