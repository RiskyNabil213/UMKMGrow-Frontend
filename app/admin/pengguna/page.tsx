"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Search, Filter, Users, Crown,
  UserCheck, UserX, Mail, Building2,
  Calendar, ChevronDown, Loader2, Shield,
} from "lucide-react";

type UserItem = {
  id: number;
  name: string | null;
  email: string;
  businessName: string | null;
  role: string;
  plan: string;
  planExpiresAt: string | null;
  createdAt: string;
};

const PLAN_BADGE: Record<string, string> = {
  free:     "bg-gray-100 text-gray-500 border border-gray-200",
  pro:      "bg-indigo-100 text-indigo-700 border border-indigo-200",
  business: "bg-yellow-100 text-yellow-700 border border-yellow-200",
};
const PLAN_LABEL: Record<string, string> = {
  free: "Gratis", pro: "Pro ⭐", business: "Bisnis 👑",
};
const PLAN_ICON: Record<string, string> = {
  free: "👤", pro: "⭐", business: "👑",
};

export default function ManajemenPenggunaPage() {
  const { user, role, token } = useAuth();
  const router = useRouter();
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<"all" | "customer" | "pemilik_usaha" | "admin" | "premium">("all");
  const [users,   setUsers]   = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && role !== "admin") router.replace("/");
  }, [user, role, router]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : data.data ?? []);
        }
      } catch { /* pakai dummy jika API gagal */ }
      finally { setLoading(false); }
    })();
  }, [token]);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.businessName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"           ? true :
      filter === "premium"       ? u.plan !== "free" :
      filter === "pemilik_usaha" ? u.role === "pemilik_usaha" :
      u.role === filter;
    return matchSearch && matchFilter;
  });

  const totalUser    = users.filter((u) => u.role !== "admin").length;
  const totalPremium = users.filter((u) => u.plan !== "free").length;
  const totalAdmin   = users.filter((u) => u.role === "admin").length;

  function isPremiumExpired(u: UserItem) {
    if (!u.planExpiresAt) return false;
    return new Date(u.planExpiresAt) < new Date();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.push("/admin")}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="font-black text-gray-800 text-base leading-tight">Manajemen Pengguna</h1>
          <p className="text-[11px] text-gray-400">Lihat & kelola semua akun</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Pengguna", value: totalUser,    icon: Users,     color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Pengguna Premium", value: totalPremium, icon: Crown,   color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Admin",           value: totalAdmin,  icon: UserCheck, color: "text-green-600",  bg: "bg-green-50"  },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon size={20} className={s.color} />
              </div>
              <p className="text-2xl font-black text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-4 text-xs">
          <p className="font-bold text-gray-500 w-full">Keterangan Tipe Akun:</p>
          <div className="flex items-center gap-2"><span className="text-base">👤</span><span className="text-gray-600">Gratis — akses terbatas (5 AI/bulan)</span></div>
          <div className="flex items-center gap-2"><span className="text-base">⭐</span><span className="text-gray-600">Pro — AI tak terbatas, analisis mendalam</span></div>
          <div className="flex items-center gap-2"><span className="text-base">👑</span><span className="text-gray-600">Bisnis — semua fitur + dukungan prioritas</span></div>
          <div className="flex items-center gap-2"><Shield size={14} className="text-indigo-600" /><span className="text-gray-600">Admin — akses penuh ke dashboard</span></div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, atau usaha..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {([
              { key: "all",           label: "Semua" },
              { key: "customer",      label: "Customer" },
              { key: "pemilik_usaha", label: "Pemilik" },
              { key: "admin",         label: "Admin" },
              { key: "premium",       label: "Premium ⭐" },
            ] as const).map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  filter === f.key
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">{filtered.length} pengguna ditemukan</p>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-semibold">
              <Filter size={13} /> Filter <ChevronDown size={13} />
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <Loader2 size={28} className="animate-spin text-indigo-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Memuat data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <UserX size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-medium">Tidak ada pengguna ditemukan</p>
            </div>
          ) : filtered.map((u) => {
            const expired = isPremiumExpired(u);
            const isPremium = u.plan !== "free" && !expired;
            return (
              <div key={u.id} className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 ${isPremium ? "border-l-4 border-l-yellow-400" : ""}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  u.role === "admin"        ? "bg-indigo-100 text-indigo-600" :
                  isPremium                 ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {PLAN_ICON[u.plan]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-800 truncate">{u.name ?? "-"}</p>
                    {u.role === "admin" && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-200">
                        Admin
                      </span>
                    )}
                    {u.role === "pemilik_usaha" && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full border border-orange-200">
                        Pemilik
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${expired ? "bg-red-100 text-red-500 border border-red-200" : PLAN_BADGE[u.plan]}`}>
                      {expired ? "Expired" : PLAN_LABEL[u.plan]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Mail size={10} /> {u.email}
                    </span>
                    {u.businessName && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Building2 size={10} /> {u.businessName}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Calendar size={10} /> {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {u.planExpiresAt && !expired && (
                      <span className="text-[11px] text-green-600 font-semibold">
                        Premium s/d {new Date(u.planExpiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Plan indicator */}
                <div className={`shrink-0 w-2 h-10 rounded-full ${
                  u.plan === "business" ? "bg-yellow-400" :
                  u.plan === "pro"      ? "bg-indigo-400" :
                  "bg-gray-200"
                }`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
