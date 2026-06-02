"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/UserContext";

const AUTH_ROUTES    = ["/login", "/register"];
const PUBLIC_ROUTES  = ["/login", "/register", "/upgrade"];
const ADMIN_ROUTES   = ["/admin"];
const PEMILIK_ROUTES = ["/pemilik"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const { isLoggedIn, authLoading, role } = useAuth();

  const isAuthPage    = AUTH_ROUTES.includes(pathname);
  const isPublicPage  = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminPage   = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isPemilikPage = PEMILIK_ROUTES.some((r) => pathname.startsWith(r));

  // Belum login → ke /login (kecuali halaman public)
  useEffect(() => {
    if (!authLoading && !isLoggedIn && !isPublicPage) {
      router.replace("/login");
    }
  }, [authLoading, isLoggedIn, isPublicPage, router]);

  // Sudah login + di halaman auth → redirect sesuai role
  useEffect(() => {
    if (!authLoading && isLoggedIn && isAuthPage) {
      if (role === "admin") {
        router.replace("/admin");
      } else if (role === "pemilik_usaha") {
        router.replace("/pemilik");
      } else {
        router.replace("/");
      }
    }
  }, [authLoading, isLoggedIn, isAuthPage, role, router]);

  // Customer / pemilik_usaha mencoba akses /admin → ke /
  useEffect(() => {
    if (!authLoading && isLoggedIn && isAdminPage && role !== "admin") {
      router.replace("/");
    }
  }, [authLoading, isLoggedIn, isAdminPage, role, router]);

  // Halaman auth: tanpa layout
  if (isAuthPage) return <>{children}</>;

  // Loading — tampilkan spinner singkat
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Belum login dan bukan halaman public
  if (!isLoggedIn && !isPublicPage) return null;

  // Halaman admin: tanpa Sidebar (punya layout sendiri)
  if (isAdminPage) return <>{children}</>;

  // Halaman pemilik: tanpa Sidebar (punya layout sendiri)
  if (isPemilikPage) return <>{children}</>;

  // Layout utama dengan Sidebar (customer)
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8" style={{ backgroundColor: 'var(--background)' }}>{children}</main>
    </div>
  );
}
