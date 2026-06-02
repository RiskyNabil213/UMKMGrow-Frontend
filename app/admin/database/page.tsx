"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft, Users, Briefcase, Truck, CreditCard,
  MessageSquare, RefreshCw, Loader2, Crown, Shield,
  TrendingUp, Database,
} from "lucide-react";

type Tab = "users" | "lowongan" | "supplier" | "transactions" | "payments" | "chats";

const TABS: { key: Tab; label: string; icon: React.ElementType; color: string }[] = [
  { key: "users",        label: "User",        icon: Users,         color: "text-indigo-600" },
  { key: "lowongan",     label: "Lowongan",    icon: Briefcase,     color: "text-orange-500" },
  { key: "supplier",     label: "Supplier",    icon: Truck,         color: "text-purple-500" },
  { key: "transactions", label: "Transaksi",   icon: TrendingUp,    color: "text-green-600"  },
  { key: "payments",     label: "Payment",     icon: CreditCard,    color: "text-blue-600"   },
  { key: "chats",        label: "Chat AI",     icon: MessageSquare, color: "text-pink-500"   },
];

const PLAN_BADGE: Record<string, string> = {
  free:     "bg-gray-100 text-gray-500",
  pro:      "bg-indigo-100 text-indigo-700",
  business: "bg-yellow-100 text-yellow-700",
};
const STATUS_BADGE: Record<string, string> = {
  active:  "bg-green-100 text-green-700",
  inactive:"bg-gray-100 text-gray-500",
  pending: "bg-yellow-100 text-yellow-700",
  paid:    "bg-green-100 text-green-700",
  failed:  "bg-red-100 text-red-600",
  expired: "bg-red-100 text-red-500",
};

function fmt(d: string) {
  return new Date(d).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function AdminDatabasePage() {
  const { user, role, token } = useAuth();
  const router = useRouter();
  const [tab,     setTab]     = useState<Tab>("users");
  const [data,    setData]    = useState<any[]>([]);
  const [stats,   setStats]   = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && role !== "admin") router.replace("/");
  }, [user, role, router]);

  const fetchData = useCallback(async (t: Tab) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${t}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setData(await res.json());
    } catch { setData([]); }
    finally { setLoading(false); }
  }, [token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStats(await res.json());
    } catch { /* silent */ }
  }, [token]);

  useEffect(() => {
    fetchStats();
    fetchData(tab);
  }, [tab, fetchData, fetchStats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.push("/admin")}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-gray-800 text-base leading-tight flex items-center gap-2">
            <Database size={18} className="text-indigo-600" /> Database Admin
          </h1>
          <p className="text-[11px] text-gray-400">Lihat semua data real-time dari server</p>
        </div>
        <button onClick={() => fetchData(tab)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
          <RefreshCw size={13} /> Refresh
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total User",    value: stats.users,        icon: Users,      color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "User Premium",  value: stats.premium,      icon: Crown,      color: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "Total Payment", value: stats.payments,     icon: CreditCard, color: "text-blue-600",   bg: "bg-blue-50"   },
              { label: "Total Revenue", value: fmtRp(stats.revenue), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50"  },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <p className="text-xl font-black text-gray-800">{s.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Keterangan plan */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-xs flex flex-wrap gap-4">
          <p className="font-bold text-gray-500 w-full">Keterangan:</p>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block" /> Gratis — akses terbatas</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-400 inline-block" /> Pro ⭐ — AI tak terbatas + analisis</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Bisnis 👑 — semua fitur + prioritas</span>
          <span className="flex items-center gap-1.5"><Shield size={12} className="text-indigo-600" /> Admin — akses penuh dashboard</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                tab === t.key
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-200"
              }`}>
              <t.icon size={14} />
              {t.label}
              {stats && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  tab === t.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {stats[t.key === "chats" ? "chats" : t.key] ?? ""}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">{data.length} record</p>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <Loader2 size={28} className="animate-spin text-indigo-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Database size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Belum ada data</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {tab === "users" && (
                      <>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Usaha</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Plan</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Daftar</th>
                      </>
                    )}
                    {tab === "lowongan" && (
                      <>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Posisi</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Perusahaan</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lokasi</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tipe</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gaji</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      </>
                    )}
                    {tab === "supplier" && (
                      <>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Lokasi</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      </>
                    )}
                    {tab === "transactions" && (
                      <>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Jumlah</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Deskripsi</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                      </>
                    )}
                    {tab === "payments" && (
                      <>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Paket</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nominal</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Waktu</th>
                      </>
                    )}
                    {tab === "chats" && (
                      <>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pesan</th>
                        <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Waktu</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      {tab === "users" && (
                        <>
                          <td className="px-4 py-3 text-gray-400 text-xs">{row.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                row.plan === "business" ? "bg-yellow-100 text-yellow-700" :
                                row.plan === "pro"      ? "bg-indigo-100 text-indigo-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {row.name?.charAt(0)?.toUpperCase() ?? "?"}
                              </div>
                              <span className="font-semibold text-gray-800">{row.name ?? "-"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{row.email}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{row.businessName ?? "-"}</td>
                          <td className="px-4 py-3">
                            {row.role === "admin"
                              ? <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full w-fit"><Shield size={9} /> Admin</span>
                              : row.role === "pemilik_usaha"
                              ? <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">Pemilik</span>
                              : <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">Customer</span>
                            }
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${PLAN_BADGE[row.plan] ?? PLAN_BADGE.free}`}>
                              {row.plan === "pro" ? "Pro ⭐" : row.plan === "business" ? "Bisnis 👑" : "Gratis"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(row.createdAt)}</td>
                        </>
                      )}
                      {tab === "lowongan" && (
                        <>
                          <td className="px-4 py-3 text-gray-400 text-xs">{row.id}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{row.title}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{row.company}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{row.location}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{row.type}</td>
                          <td className="px-4 py-3 text-green-600 font-semibold text-xs">{row.salary}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${STATUS_BADGE[row.status] ?? "bg-gray-100 text-gray-500"}`}>
                              {row.status}
                            </span>
                          </td>
                        </>
                      )}
                      {tab === "supplier" && (
                        <>
                          <td className="px-4 py-3 text-gray-400 text-xs">{row.id}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{row.name}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{row.category}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{row.location}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{row.price}</td>
                          <td className="px-4 py-3 text-yellow-500 font-bold text-xs">★ {row.rating}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${STATUS_BADGE[row.status] ?? "bg-gray-100 text-gray-500"}`}>
                              {row.status}
                            </span>
                          </td>
                        </>
                      )}
                      {tab === "transactions" && (
                        <>
                          <td className="px-4 py-3 text-gray-400 text-xs">{row.id}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{row.user?.name ?? row.userId}</td>
                          <td className="px-4 py-3 font-bold text-gray-800">{fmtRp(row.amount)}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">{row.description}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(row.date)}</td>
                        </>
                      )}
                      {tab === "payments" && (
                        <>
                          <td className="px-4 py-3 text-gray-400 text-xs font-mono">{row.orderId?.slice(-12)}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{row.user?.name ?? row.userId}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${PLAN_BADGE[row.plan] ?? PLAN_BADGE.free}`}>
                              {row.plan === "pro" ? "Pro ⭐" : "Bisnis 👑"} · {row.billingCycle === "monthly" ? "Bulanan" : "Tahunan"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-800">{fmtRp(row.amount)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${STATUS_BADGE[row.status] ?? "bg-gray-100 text-gray-500"}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(row.createdAt)}</td>
                        </>
                      )}
                      {tab === "chats" && (
                        <>
                          <td className="px-4 py-3 text-gray-400 text-xs">{row.id}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{row.user?.name ?? row.userId}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs max-w-[300px]">
                            <p className="truncate">{row.message}</p>
                            {row.response && (
                              <p className="truncate text-indigo-500 mt-0.5">↩ {row.response}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{fmt(row.createdAt)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
