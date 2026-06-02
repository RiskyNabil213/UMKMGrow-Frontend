"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/UserContext";
import { Menu, ArrowLeft } from "lucide-react";

const AUTH_ROUTES    = ["/login", "/register"];
const PUBLIC_ROUTES  = ["/login", "/register", "/upgrade"];
const ADMIN_ROUTES   = ["/admin"];
const PEMILIK_ROUTES = ["/pemilik"];

// Halaman yang punya judul untuk mobile header
const PAGE_TITLES: Record<string, string> = {
  "/":            "Beranda",
  "/kalkulator":  "Kalkulator Keuangan",
  "/lowongan":    "Lowongan Kerja",
  "/supplier":    "Direktori Supplier",
  "/ai-chat":     "AI Konsultasi",
  "/rekomendasi": "Rekomendasi Usaha",
  "/komunitas":   "Komunitas",
  "/profil":      "Profil Saya",
  "/upgrade":     "Upgrade Premium",
  "/pengaturan":  "Pengaturan",
  "/promosi":     "Promosi AI",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const { isLoggedIn, authLoading, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage    = AUTH_ROUTES.includes(pathname);
  const isPublicPage  = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminPage   = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isPemilikPage = PEMILIK_ROUTES.some((r) => pathname.startsWith(r));

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn && !isPublicPage) {
      router.replace("/login");
    }
  }, [authLoading, isLoggedIn, isPublicPage, router]);

  useEffect(() => {
    if (!authLoading && isLoggedIn && isAuthPage) {
      if (role === "admin") router.replace("/admin");
      else if (role === "pemilik_usaha") router.replace("/pemilik");
      else router.replace("/");
    }
  }, [authLoading, isLoggedIn, isAuthPage, role, router]);

  useEffect(() => {
    if (!authLoading && isLoggedIn && isAdminPage && role !== "admin") {
      router.replace("/");
    }
  }, [authLoading, isLoggedIn, isAdminPage, role, router]);

  if (isAuthPage) return <>{children}</>;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn && !isPublicPage) return null;

  // Admin & pemilik punya layout sendiri
  if (isAdminPage || isPemilikPage) return <>{children}</>;

  // Cari judul halaman
  const pageTitle = Object.entries(PAGE_TITLES).find(([key]) => pathname === key)?.[1]
    ?? (pathname.startsWith("/lowongan/") ? "Detail Lowongan"
      : pathname.startsWith("/supplier/") ? "Detail Supplier"
      : pathname.startsWith("/payment/") ? "Pembayaran"
      : "UMKM Grow+");

  const showBack = pathname !== "/" && !Object.keys(PAGE_TITLES).includes(pathname)
    || ["/upgrade", "/pengaturan", "/promosi"].includes(pathname);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b shadow-sm"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          {showBack ? (
            <button onClick={() => router.back()}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Menu size={22} className="text-gray-600" />
            </button>
          )}
          <h1 className="font-bold text-gray-800 text-base flex-1 truncate">{pageTitle}</h1>
          {/* Hamburger always accessible even on back pages */}
          {showBack && (
            <button onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Menu size={22} className="text-gray-600" />
            </button>
          )}
        </header>

        <main className="flex-1 p-4 md:p-8" style={{ backgroundColor: 'var(--background)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
