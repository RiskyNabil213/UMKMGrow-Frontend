"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import {
  LayoutDashboard, Lightbulb, Calculator, MessageSquare,
  Briefcase, Truck, User, Crown, Sparkles, LogOut, Users, Lock,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { isPremium, plan, user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  // Baca sisa token dari localStorage per user ID
  const aiToken = typeof window !== "undefined" && user
    ? Number(localStorage.getItem(`ai_token_${user.id}`) ?? 10)
    : 10;

  // Menu yang selalu tampil
  const baseItems = [
    { icon: LayoutDashboard, label: "Beranda",             href: "/" },
    { icon: Calculator,      label: "Kalkulator Keuangan", href: "/kalkulator" },
    { icon: Briefcase,       label: "Lowongan Kerja",      href: "/lowongan" },
    { icon: Truck,           label: "Supplier",            href: "/supplier" },
    { icon: MessageSquare,   label: "AI Konsultasi",       href: "/ai-chat" },
  ];

  // Menu khusus premium
  const premiumItems = [
    { icon: Lightbulb, label: "Rekomendasi Usaha", href: "/rekomendasi" },
    { icon: Users,     label: "Komunitas",         href: "/komunitas" },
  ];

  return (
    <aside className="w-64 h-screen border-r hidden md:flex flex-col fixed left-0 top-0 z-50 transition-colors duration-200"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>

      {/* ── Logo ── */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">UMKM Grow+</h1>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto">
        {/* Menu dasar */}
        {baseItems.map((item) => {
          const isActive = pathname === item.href;
          const isAiChat = item.href === "/ai-chat";
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-gray-500 hover:bg-indigo-50"
              }`}>
                <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-indigo-600 transition-colors"} />
                <span className="font-medium text-sm flex-1">{item.label}</span>
                {/* Badge token untuk AI Chat non-premium */}
                {isAiChat && !isPremium && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : aiToken > 3
                        ? "bg-indigo-100 text-indigo-600"
                        : aiToken > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                  }`}>
                    {aiToken > 0 ? `${aiToken}` : "0"}
                  </span>
                )}
                {isAiChat && isPremium && (
                  <Crown size={11} className={isActive ? "text-yellow-200 shrink-0" : "text-yellow-500 shrink-0"} />
                )}
              </div>
            </Link>
          );
        })}

        {/* Divider premium */}
        <div className="pt-2 pb-1 px-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Crown size={10} className={isPremium ? "text-yellow-500" : "text-gray-300"} />
            Fitur Premium
          </p>
        </div>

        {/* Menu premium */}
        {premiumItems.map((item) => {
          const isActive = pathname === item.href;
          if (isPremium) {
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-gray-500 hover:bg-indigo-50"
                }`}>
                  <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-indigo-600 transition-colors"} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          }
          // Non-premium: tampil tapi terkunci
          return (
            <Link key={item.href} href="/upgrade">
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group text-gray-300 hover:bg-gray-50">
                <item.icon size={20} className="text-gray-300" />
                <span className="font-medium text-sm flex-1">{item.label}</span>
                <Lock size={12} className="text-gray-300 shrink-0" />
              </div>
            </Link>
          );
        })}

        {/* Profil — selalu tampil, di bawah Komunitas */}
        <Link href="/profil">
          <div className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group ${
            pathname === "/profil"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "text-gray-500 hover:bg-indigo-50"
          }`}>
            <User size={20} className={pathname === "/profil" ? "text-white" : "group-hover:text-indigo-600 transition-colors"} />
            <span className="font-medium text-sm">Profil Saya</span>
          </div>
        </Link>
      </nav>

      {/* ── Bottom ── */}
      <div className="px-4 pb-4 pt-3 shrink-0 space-y-2 border-t border-gray-100">
        {isPremium ? (
          <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Crown size={14} className="text-white" />
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">
                {plan === "business" ? "Bisnis" : "Pro"} Member
              </p>
              <Sparkles size={12} className="text-yellow-100 ml-auto" />
            </div>
            <p className="text-xs text-yellow-100">Semua fitur aktif ✨</p>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Crown size={14} className="text-yellow-300" />
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Fitur Premium</p>
            </div>
            <p className="text-xs text-indigo-200 mb-3">Buka Rekomendasi & Komunitas. AI gratis 10 token.</p>
            <Link href="/upgrade">
              <button className="w-full bg-white text-indigo-600 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-50 transition-colors">
                Upgrade Sekarang ✨
              </button>
            </Link>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
            {initials}
          </div>
          <span className="text-sm font-semibold truncate flex-1 text-left">{user?.name ?? "Pengguna"}</span>
          <LogOut size={15} className="shrink-0" />
        </button>
      </div>
    </aside>
  );
}
