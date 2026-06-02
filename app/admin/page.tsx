"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Users, BarChart3, Settings, LogOut,
  Crown, TrendingUp, Package, AlertCircle, ChevronRight, Database,
} from "lucide-react";

export default function AdminPage() {
  const { user, role, logout } = useAuth();
  const router = useRouter();

  // Redirect jika bukan admin
  useEffect(() => {
    if (user && role !== "admin") {
      router.replace("/login");
    }
  }, [user, role, router]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const stats = [
    { label: "Total Pengguna",  value: "1,248", icon: Users,      color: "text-indigo-600", bg: "bg-indigo-50",  trend: "+12%" },
    { label: "Pengguna Premium",value: "342",   icon: Crown,      color: "text-yellow-600", bg: "bg-yellow-50",  trend: "+8%"  },
    { label: "Transaksi Bulan", value: "89",    icon: TrendingUp, color: "text-green-600",  bg: "bg-green-50",   trend: "+23%" },
    { label: "Produk Aktif",    value: "4,521", icon: Package,    color: "text-purple-600", bg: "bg-purple-50",  trend: "+5%"  },
  ];

  const menuItems = [
    { icon: Users,      label: "Manajemen Pengguna", desc: "Lihat & kelola semua akun",       color: "text-indigo-600", bg: "bg-indigo-50",  href: "/admin/pengguna"   },
    { icon: BarChart3,  label: "Laporan & Analitik", desc: "Statistik platform lengkap",      color: "text-blue-600",   bg: "bg-blue-50",    href: "/admin/analitik"   },
    { icon: Package,    label: "Manajemen Konten",   desc: "Kelola lowongan & supplier",      color: "text-purple-600", bg: "bg-purple-50",  href: "/admin/konten"     },
    { icon: Database,   label: "Database",           desc: "Lihat semua data real-time",      color: "text-green-600",  bg: "bg-green-50",   href: "/admin/database"   },
    { icon: Settings,   label: "Pengaturan Sistem",  desc: "Konfigurasi platform",            color: "text-gray-600",   bg: "bg-gray-100",   href: "/admin/pengaturan" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-100">
            <Settings size={20} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="font-black text-gray-800 text-base leading-tight">Admin Panel</h1>
            <p className="text-[11px] text-gray-400">UMKM Grow+ Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-indigo-500">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 leading-tight">{user?.name ?? "Admin"}</p>
              <p className="text-[10px] font-semibold uppercase text-indigo-500">Admin</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-semibold">
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Welcome */}
        <div className="relative overflow-hidden rounded-3xl p-7 text-white shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-indigo-200">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 bg-white/15">
              <Settings size={12} />
              Admin
            </div>
            <h2 className="text-2xl font-black mb-1">Halo, {user?.name?.split(" ")[0] ?? "Admin"}! 👋</h2>
            <p className="text-white/70 text-sm">
              Kelola platform dan bantu pengguna berkembang bersama UMKM Grow+.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Ringkasan Platform</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <s.icon size={20} className={s.color} />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">{s.trend}</span>
                </div>
                <p className="text-xl font-black text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Menu Pengelolaan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <button key={item.label} onClick={() => router.push(item.href)}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-indigo-100 transition-all text-left group">
                <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  <item.icon size={22} className={item.color} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm group-hover:text-indigo-600 transition-colors">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Info role */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border bg-indigo-50 border-indigo-100">
          <AlertCircle size={16} className="text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-indigo-700">
            Kamu login sebagai Admin. Kelola pengguna dan konten platform dengan bijak.
          </p>
        </div>
      </div>
    </div>
  );
}
