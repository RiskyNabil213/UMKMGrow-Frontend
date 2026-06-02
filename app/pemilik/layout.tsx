"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Briefcase, Truck, Calculator,
  MessageSquare, Share2, User, LogOut, Store, Crown, Sparkles,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",        href: "/pemilik" },
  { icon: Briefcase,       label: "Lowongan Kerja",   href: "/pemilik/lowongan" },
  { icon: Truck,           label: "Supplier",         href: "/pemilik/supplier" },
  { icon: Calculator,      label: "Kalkulator",       href: "/pemilik/kalkulator" },
  { icon: MessageSquare,   label: "AI Konsultasi",    href: "/pemilik/ai-chat" },
  { icon: Share2,          label: "Promosi AI",       href: "/pemilik/promosi" },
  { icon: User,            label: "Profil",           href: "/pemilik/profil" },
];

export default function PemilikLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isPremium, plan, logout, authLoading, isLoggedIn } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && isLoggedIn && role !== "pemilik_usaha") {
      router.replace(role === "admin" ? "/admin" : "/");
    }
    if (!authLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [authLoading, isLoggedIn, role, router]);

  if (authLoading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-white border-r border-gray-100 hidden md:flex flex-col fixed left-0 top-0 z-50">
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <Store size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-gray-800 leading-tight">UMKM Grow+</h1>
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Pemilik Usaha</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all group ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "text-gray-500 hover:bg-orange-50"
                }`}>
                  <item.icon size={19} className={isActive ? "text-white" : "group-hover:text-orange-500 transition-colors"} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
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
            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <Crown size={14} className="text-yellow-300" />
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Upgrade Premium</p>
              </div>
              <p className="text-xs text-orange-100 mb-3">Fitur AI tak terbatas.</p>
              <Link href="/upgrade">
                <button className="w-full bg-white text-orange-600 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-orange-50 transition-colors">
                  Upgrade Sekarang ✨
                </button>
              </Link>
            </div>
          )}

          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">
              {initials}
            </div>
            <span className="text-sm font-semibold truncate flex-1 text-left">{user?.name ?? "Pemilik"}</span>
            <LogOut size={15} className="shrink-0" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-8">{children}</main>
    </div>
  );
}
