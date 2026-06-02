"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Search, Filter, Users, Crown,
  UserCheck, UserX, MoreVertical, Mail, Building2,
  Calendar, ChevronDown,
} from "lucide-react";

type UserItem = {
  id: number;
  name: string | null;
  email: string;
  businessName: string | null;
  role: string;
  plan: string;
  createdAt: string;
};

const DUMMY_USERS: UserItem[] = [
  { id: 1, name: "Budi Santoso",   email: "budi@email.com",   businessName: "Warung Budi",    role: "customer", plan: "pro",      createdAt: "2025-01-10" },
  { id: 2, name: "Siti Rahayu",    email: "siti@email.com",   businessName: "Toko Siti",      role: "customer", plan: "free",     createdAt: "2025-02-14" },
  { id: 3, name: "Ahmad Fauzi",    email: "ahmad@email.com",  businessName: "CV Ahmad",       role: "customer", plan: "business", createdAt: "2025-03-01" },
  { id: 4, name: "Dewi Lestari",   email: "dewi@email.com",   businessName: null,             role: "customer", plan: "free",     createdAt: "2025-03-20" },
  { id: 5, name: "Rizky Pratama",  email: "rizky@email.com",  businessName: "Rizky Store",    role: "customer", plan: "pro",      createdAt: "2025-04-05" },
  { id: 6, name: "Admin Utama",    email: "admin@umkm.com",   businessName: null,             role: "admin",    plan: "free",     createdAt: "2025-01-01" },
  { id: 7, name: "Nia Kurniawati", email: "nia@email.com",    businessName: "Nia Craft",      role: "customer", plan: "free",     createdAt: "2025-04-18" },
  { id: 8, name: "Hendra Wijaya",  email: "hendra@email.com", businessName: "Hendra Teknik",  role: "customer", plan: "business", createdAt: "2025-05-02" },
];

const planBadge: Record<string, string> = {
  free:     "bg-gray-100 text-gray-500",
  pro:      "bg-indigo-100 text-indigo-600",
  business: "bg-yellow-100 text-yellow-700",
};
const planLabel: Record<string, string> = {
  free: "Gratis", pro: "Pro", business: "Bisnis",
};

export default function ManajemenPenggunaPage() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<"all" | "customer" | "admin" | "premium">("all");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  useEffect(() => {
    if (user && role === "customer") router.replace("/");
  }, [user, role, router]);

  const filtered = DUMMY_USERS.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.businessName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"      ? true :
      filter === "premium"  ? u.plan !== "free" :
      u.role === filter;
    return matchSearch && matchFilter;
  });

  const totalCustomer = DUMMY_USERS.filter((u) => u.role === "customer").length;
  const totalPremium  = DUMMY_USERS.filter((u) => u.plan !== "free").length;
  const totalAdmin    = DUMMY_USERS.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            { label: "Total Customer", value: totalCustomer, icon: Users,     color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Pengguna Premium", value: totalPremium, icon: Crown,    color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Admin",           value: totalAdmin,   icon: UserCheck, color: "text-green-600",  bg: "bg-green-50"  },
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

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, atau usaha..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "customer", "admin", "premium"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  filter === f
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                }`}>
                {f === "all" ? "Semua" : f === "customer" ? "Customer" : f === "admin" ? "Admin" : "Premium"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">{filtered.length} pengguna ditemukan</p>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-semibold">
              <Filter size={13} /> Filter lanjutan <ChevronDown size={13} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <UserX size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-medium">Tidak ada pengguna ditemukan</p>
              </div>
            ) : filtered.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                  u.role === "admin" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600"
                }`}>
                  {u.name?.charAt(0).toUpperCase() ?? "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-800 truncate">{u.name ?? "-"}</p>
                    {u.role === "admin" && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full">Admin</span>
                    )}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${planBadge[u.plan]}`}>
                      {planLabel[u.plan]}
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
                  </div>
                </div>

                {/* Action */}
                <div className="relative shrink-0">
                  <button onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                    <MoreVertical size={15} className="text-gray-400" />
                  </button>
                  {openMenu === u.id && (
                    <div className="absolute right-0 top-9 bg-white border border-gray-100 rounded-xl shadow-lg z-10 w-40 py-1 text-sm">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium">Lihat Detail</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium">Edit Pengguna</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 font-medium">Nonaktifkan</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
