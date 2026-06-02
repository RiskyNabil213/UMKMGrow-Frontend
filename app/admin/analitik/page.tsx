"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowLeft, TrendingUp, Users, Crown,
  MessageSquare, CreditCard, ArrowUpRight, ArrowDownRight,
  BarChart3, Activity,
} from "lucide-react";

const monthlyUsers = [
  { month: "Jan", users: 80,  premium: 12 },
  { month: "Feb", users: 120, premium: 20 },
  { month: "Mar", users: 175, premium: 35 },
  { month: "Apr", users: 210, premium: 48 },
  { month: "Mei", users: 290, premium: 72 },
  { month: "Jun", users: 340, premium: 95 },
];

const recentTx = [
  { name: "Ahmad Fauzi",   plan: "Bisnis", amount: 299000, date: "2 Jun 2026",  status: "success" },
  { name: "Rizky Pratama", plan: "Pro",    amount: 99000,  date: "1 Jun 2026",  status: "success" },
  { name: "Budi Santoso",  plan: "Pro",    amount: 99000,  date: "30 Mei 2026", status: "success" },
  { name: "Nia Kurniawati",plan: "Bisnis", amount: 299000, date: "28 Mei 2026", status: "pending" },
  { name: "Hendra Wijaya", plan: "Bisnis", amount: 299000, date: "25 Mei 2026", status: "success" },
];

const maxUsers = Math.max(...monthlyUsers.map((m) => m.users));

export default function AnalitikPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && role === "customer") router.replace("/");
  }, [user, role, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.push("/admin")}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="font-black text-gray-800 text-base leading-tight">Laporan & Analitik</h1>
          <p className="text-[11px] text-gray-400">Statistik platform lengkap</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Pengguna",   value: "1,248", change: "+12%", up: true,  icon: Users,        color: "text-indigo-600", bg: "bg-indigo-50"  },
            { label: "Pengguna Premium", value: "342",   change: "+8%",  up: true,  icon: Crown,        color: "text-yellow-600", bg: "bg-yellow-50"  },
            { label: "Chat AI Bulan Ini",value: "2,841", change: "+31%", up: true,  icon: MessageSquare,color: "text-purple-600", bg: "bg-purple-50"  },
            { label: "Pendapatan Bulan", value: "Rp 34M",change: "-3%",  up: false, icon: CreditCard,   color: "text-green-600",  bg: "bg-green-50"   },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                  <s.icon size={20} className={s.color} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
                  s.up ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
                }`}>
                  {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {s.change}
                </span>
              </div>
              <p className="text-xl font-black text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bar Chart — Pertumbuhan Pengguna */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800">Pertumbuhan Pengguna</h3>
              <p className="text-xs text-gray-400 mt-0.5">6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" /> Total</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" /> Premium</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {monthlyUsers.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-1 h-32">
                  <div
                    className="flex-1 bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600"
                    style={{ height: `${(m.users / maxUsers) * 100}%` }}
                    title={`${m.users} pengguna`}
                  />
                  <div
                    className="flex-1 bg-yellow-400 rounded-t-lg transition-all hover:bg-yellow-500"
                    style={{ height: `${(m.premium / maxUsers) * 100}%` }}
                    title={`${m.premium} premium`}
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-semibold">{m.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Distribusi Plan */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={18} className="text-indigo-600" />
              <h3 className="font-bold text-gray-800">Distribusi Plan</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Gratis",  value: 906, total: 1248, color: "bg-gray-300" },
                { label: "Pro",     value: 218, total: 1248, color: "bg-indigo-500" },
                { label: "Bisnis",  value: 124, total: 1248, color: "bg-yellow-400" },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>{p.label}</span>
                    <span>{p.value} <span className="text-gray-400 font-normal">({Math.round(p.value / p.total * 100)}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color} rounded-full transition-all`}
                      style={{ width: `${(p.value / p.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaksi Terbaru */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Activity size={18} className="text-green-600" />
              <h3 className="font-bold text-gray-800">Transaksi Terbaru</h3>
            </div>
            <div className="space-y-3">
              {recentTx.map((tx, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600">
                      {tx.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 leading-tight">{tx.name}</p>
                      <p className="text-[10px] text-gray-400">{tx.plan} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-800">Rp {tx.amount.toLocaleString("id-ID")}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      tx.status === "success" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {tx.status === "success" ? "Berhasil" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aktivitas Platform */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-purple-600" />
            <h3 className="font-bold text-gray-800">Aktivitas Platform Hari Ini</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Login",         value: "148", color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Chat AI",       value: "312", color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Kalkulasi",     value: "89",  color: "text-blue-600",   bg: "bg-blue-50"   },
              { label: "Pembayaran",    value: "14",  color: "text-green-600",  bg: "bg-green-50"  },
            ].map((a) => (
              <div key={a.label} className={`${a.bg} rounded-2xl p-4 text-center`}>
                <p className={`text-2xl font-black ${a.color}`}>{a.value}</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
