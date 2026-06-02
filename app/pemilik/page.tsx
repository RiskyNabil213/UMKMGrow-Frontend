"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import {
  Briefcase, Truck, Calculator, MessageSquare,
  Share2, ChevronRight, TrendingUp, Users, Star, Zap,
} from "lucide-react";

const quickActions = [
  { icon: Briefcase,     label: "Buat Lowongan",    desc: "Pasang lowongan kerja baru",       href: "/pemilik/lowongan", color: "text-indigo-600", bg: "bg-indigo-50",  border: "hover:border-indigo-200" },
  { icon: Truck,         label: "Tambah Supplier",  desc: "Daftarkan supplier usahamu",       href: "/pemilik/supplier", color: "text-purple-600", bg: "bg-purple-50",  border: "hover:border-purple-200" },
  { icon: Calculator,    label: "Kalkulator",       desc: "Hitung laba & keuangan usaha",     href: "/pemilik/kalkulator", color: "text-blue-600", bg: "bg-blue-50",    border: "hover:border-blue-200"   },
  { icon: MessageSquare, label: "AI Konsultasi",    desc: "Tanya strategi bisnis ke AI",      href: "/pemilik/ai-chat",  color: "text-green-600",  bg: "bg-green-50",   border: "hover:border-green-200"  },
  { icon: Share2,        label: "Promosi AI",       desc: "Generate caption & hashtag",       href: "/pemilik/promosi",  color: "text-pink-600",   bg: "bg-pink-50",    border: "hover:border-pink-200"   },
];

const stats = [
  { label: "Lowongan Aktif",  value: "3",  icon: Briefcase,   color: "text-indigo-600", bg: "bg-indigo-50"  },
  { label: "Supplier Terdaftar", value: "2", icon: Truck,     color: "text-purple-600", bg: "bg-purple-50"  },
  { label: "Pelamar Masuk",   value: "12", icon: Users,       color: "text-green-600",  bg: "bg-green-50"   },
  { label: "Rating Usaha",    value: "4.8",icon: Star,        color: "text-yellow-600", bg: "bg-yellow-50"  },
];

export default function PemilikDashboard() {
  const { user } = useAuth();
  const router   = useRouter();
  const firstName = user?.name?.split(" ")[0] ?? "Pemilik";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 rounded-3xl p-7 text-white shadow-xl shadow-orange-200">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-xs font-bold mb-3">
            <Zap size={12} /> Pemilik Usaha
          </div>
          <h2 className="text-2xl font-black mb-1">Halo, {firstName}! 👋</h2>
          <p className="text-orange-100 text-sm max-w-md">
            Kelola usahamu dengan mudah — pasang lowongan, cari supplier, dan optimalkan bisnis dengan AI.
          </p>
          {user?.businessName && (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl text-sm font-semibold">
              🏪 {user.businessName}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-2xl font-black text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Menu Utama</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 text-left group hover:shadow-md transition-all ${item.border}`}
            >
              <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                <item.icon size={22} className={item.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm group-hover:text-orange-500 transition-colors">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-orange-500" />
          <h3 className="font-bold text-gray-800">Tips Hari Ini</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tip: "Pasang lowongan dengan deskripsi lengkap untuk menarik kandidat terbaik.", num: "01" },
            { tip: "Gunakan AI Chat untuk strategi promosi yang lebih efektif dan hemat biaya.", num: "02" },
            { tip: "Cek kalkulator keuangan rutin setiap bulan untuk pantau kesehatan usaha.", num: "03" },
          ].map((t) => (
            <div key={t.num} className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <span className="text-2xl font-black text-orange-200">{t.num}</span>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
