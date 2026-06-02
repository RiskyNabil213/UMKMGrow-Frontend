"use client";

import Link from "next/link";
import {
  Bell, Lightbulb, Calculator, MessageSquare, Briefcase, Truck,
  Share2, TrendingUp, ArrowUpRight, Sparkles, Crown, ChevronRight,
  Wallet, Package, Clock,
} from "lucide-react";
import { useAuth } from "@/context/UserContext";

const quickActions = [
  { icon: Lightbulb,     label: "Rekomendasi", desc: "Ide usaha AI",       href: "/rekomendasi", color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-100" },
  { icon: Calculator,    label: "Kalkulator",  desc: "Hitung laba",        href: "/kalkulator",  color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-100"   },
  { icon: MessageSquare, label: "AI Chat",     desc: "Konsultasi bisnis",  href: "/ai-chat",     color: "text-purple-600", bg: "bg-purple-50",  border: "border-purple-100" },
  { icon: Briefcase,     label: "Lowongan",    desc: "Cari karyawan",      href: "/lowongan",    color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-100" },
  { icon: Truck,         label: "Supplier",    desc: "Bahan baku murah",   href: "/supplier",    color: "text-teal-600",   bg: "bg-teal-50",    border: "border-teal-100"   },
  { icon: Share2,        label: "Promosi",     desc: "Caption AI",         href: "/promosi",     color: "text-pink-600",   bg: "bg-pink-50",    border: "border-pink-100"   },
];

const tips = [
  { tag: "Marketing",   tagColor: "bg-indigo-100 text-indigo-700", title: "5 Cara Efektif Promosi di Instagram Tanpa Iklan Berbayar",      read: "3 menit" },
  { tag: "Keuangan",    tagColor: "bg-green-100 text-green-700",   title: "Cara Atur Arus Kas UMKM Agar Tidak Boncos di Akhir Bulan",      read: "4 menit" },
  { tag: "Operasional", tagColor: "bg-orange-100 text-orange-700", title: "Manajemen Stok Sederhana untuk Usaha Kecil yang Efisien",       read: "2 menit" },
];

export default function Home() {
  const { user, isPremium, plan } = useAuth();

  const firstName = user?.name?.split(" ")[0] ?? "Pengguna";
  const initials  = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">

      {/* ── Header ── */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Dashboard</p>
          <h2 className="text-xl font-bold text-gray-800 mt-0.5">Selamat datang kembali 👋</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <Bell size={18} className="text-gray-500" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xs">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">{user?.name ?? "Pengguna"}</p>
              <p className="text-[10px] text-gray-400">Pemilik UMKM</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Card ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-indigo-200">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles size={12} className="text-yellow-300" />
              AI-Powered Business Assistant
            </div>
            <h1 className="text-2xl md:text-3xl font-black leading-tight">
              Halo, <span className="text-yellow-300">{firstName}!</span>
              <br />
              Bisnis kamu siap berkembang hari ini?
            </h1>
            <p className="text-indigo-200 text-sm max-w-sm leading-relaxed">
              "Kesuksesan bukan tentang seberapa besar usahamu, tapi seberapa konsisten kamu melangkah maju."
            </p>
            <Link href="/rekomendasi">
              <button className="mt-2 inline-flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg">
                Mulai Analisis AI
                <ArrowUpRight size={16} />
              </button>
            </Link>
          </div>

          {/* Skor Bisnis Ring */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="10"
                  strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">75</span>
                <span className="text-[10px] text-indigo-200 font-semibold">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-indigo-200 font-semibold">Skor Bisnis</p>
          </div>
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Fitur Utama</h3>
          <span className="text-xs text-gray-400">6 fitur tersedia</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={`group bg-white border ${action.border} rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}>
                <div className={`w-10 h-10 ${action.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <action.icon size={20} className={action.color} />
                </div>
                <p className="text-sm font-bold text-gray-800 leading-tight">{action.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{action.desc}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className={`text-[10px] font-semibold ${action.color}`}>Buka</span>
                  <ChevronRight size={10} className={`${action.color} group-hover:translate-x-0.5 transition-transform`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Ringkasan Usaha</h3>
          <button className="text-xs text-indigo-600 font-semibold hover:underline">Lihat Detail</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Wallet}      iconBg="bg-orange-100" iconColor="text-orange-600" label="Estimasi Omzet" value="Rp 15.000.000" trend="+12%" trendUp />
          <StatCard icon={TrendingUp}  iconBg="bg-green-100"  iconColor="text-green-600"  label="Laba Bersih"    value="Rp 3.250.000"  trend="+8%"  trendUp />
          <StatCard icon={Package}     iconBg="bg-blue-100"   iconColor="text-blue-600"   label="Produk Aktif"   value="150 Unit"       trend="-3%"  trendUp={false} />
        </div>
      </section>

      {/* ── Tips Bisnis ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Tips Bisnis Hari Ini</h3>
          <button className="text-xs text-indigo-600 font-semibold hover:underline">Lihat Semua</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group">
              <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${tip.tagColor} mb-3`}>
                {tip.tag}
              </span>
              <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors">
                {tip.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-3 text-gray-400">
                <Clock size={12} />
                <span className="text-[11px]">{tip.read} baca</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Premium Banner ── */}
      {isPremium ? (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-orange-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Crown size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-base">{plan === "business" ? "Bisnis" : "Pro"} Member Aktif ✨</p>
              <p className="text-yellow-100 text-xs mt-0.5">Semua fitur premium sudah aktif untuk akun kamu</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <Sparkles size={14} className="text-white" />
            <span className="text-white text-xs font-bold">Aktif</span>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-indigo-200">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Crown size={24} className="text-yellow-300" />
            </div>
            <div>
              <p className="text-white font-black text-base">Upgrade ke Premium</p>
              <p className="text-indigo-200 text-xs mt-0.5">Dapatkan analisis AI lebih mendalam, laporan keuangan, dan fitur eksklusif</p>
            </div>
          </div>
          <Link href="/upgrade" className="relative shrink-0">
            <button className="bg-white text-indigo-700 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg whitespace-nowrap">
              Upgrade Sekarang ✨
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value, trend, trendUp }: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  label: string; value: string; trend: string; trendUp: boolean;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {trend}
        </span>
      </div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-xl font-black text-gray-800 mt-1">{value}</p>
    </div>
  );
}
