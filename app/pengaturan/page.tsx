"use client";

import {
  Settings, Bell, Shield, Moon, Globe, Trash2,
  ChevronLeft, ToggleLeft, ToggleRight, Info,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

// ─── Tipe ─────────────────────────────────────────────────────────────────────

interface ToggleRowProps {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}

// ─── Sub komponen ─────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pt-5 pb-2">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{children}</p>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange, icon }: ToggleRowProps) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0">
      {icon && (
        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)} className="shrink-0 ml-2">
        {value
          ? <ToggleRight size={28} className="text-indigo-600" />
          : <ToggleLeft  size={28} className="text-gray-300" />}
      </button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="text-sm text-gray-400">{value}</p>
    </div>
  );
}

// ─── Halaman ──────────────────────────────────────────────────────────────────

export default function PengaturanPage() {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();

  // Notifikasi
  const [notifPush,     setNotifPush]     = useState(true);
  const [notifEmail,    setNotifEmail]    = useState(true);
  const [notifPromo,    setNotifPromo]    = useState(false);
  const [notifUpdate,   setNotifUpdate]   = useState(true);

  // Tampilan
  const [kompakLayout,  setKompakLayout]  = useState(false);

  // Privasi
  const [dataSaving,    setDataSaving]    = useState(true);

  // Konfirmasi hapus akun
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function handleLogout() { logout(); router.push("/login"); }

  return (
    <div className="max-w-2xl mx-auto pb-20 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 pt-2 pb-2">
        <Link href="/profil"
          className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <ChevronLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Settings size={20} className="text-indigo-600" /> Pengaturan
          </h1>
          <p className="text-xs text-gray-400">Sesuaikan preferensi aplikasi kamu</p>
        </div>
      </div>

      {/* ── Notifikasi ── */}
      <div id="notifikasi" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>🔔 Notifikasi</SectionTitle>
        <ToggleRow
          icon={<Bell size={16} className="text-indigo-500" />}
          label="Push Notification"
          desc="Terima notifikasi langsung di perangkat"
          value={notifPush} onChange={setNotifPush}
        />
        <ToggleRow
          icon={<Bell size={16} className="text-blue-500" />}
          label="Email Notifikasi"
          desc="Kirim ringkasan aktivitas ke email"
          value={notifEmail} onChange={setNotifEmail}
        />
        <ToggleRow
          icon={<Bell size={16} className="text-orange-500" />}
          label="Promo & Penawaran"
          desc="Notifikasi diskon dan promo premium"
          value={notifPromo} onChange={setNotifPromo}
        />
        <ToggleRow
          icon={<Bell size={16} className="text-green-500" />}
          label="Update Fitur Baru"
          desc="Info fitur dan pembaruan aplikasi"
          value={notifUpdate} onChange={setNotifUpdate}
        />
      </div>

      {/* ── Tampilan ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>🎨 Tampilan</SectionTitle>
        <ToggleRow
          icon={<Moon size={16} className="text-gray-600" />}
          label="Mode Gelap"
          desc="Tampilan gelap untuk menghemat baterai"
          value={darkMode} onChange={setDarkMode}
        />
        <ToggleRow
          icon={<Globe size={16} className="text-teal-500" />}
          label="Layout Kompak"
          desc="Tampilkan lebih banyak konten sekaligus"
          value={kompakLayout} onChange={setKompakLayout}
        />
      </div>

      {/* ── Keamanan ── */}
      <div id="keamanan" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>🔐 Keamanan</SectionTitle>
        <ToggleRow
          icon={<Shield size={16} className="text-green-600" />}
          label="Simpan Data Analitik"
          desc="Bantu kami tingkatkan layanan (anonim)"
          value={dataSaving} onChange={setDataSaving}
        />
        <div className="px-6 py-4 border-b border-gray-50">
          <Link href="/profil" className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                <Shield size={16} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">Ganti Password</p>
                <p className="text-xs text-gray-400">Perbarui password akun kamu</p>
              </div>
            </div>
            <ChevronLeft size={16} className="text-gray-300 rotate-180 group-hover:text-indigo-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* ── Info Akun ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>👤 Info Akun</SectionTitle>
        <InfoRow label="Email"         value={user?.email ?? "-"} />
        <InfoRow label="Role"          value={user?.role === "admin" ? "Administrator" : user?.role === "pemilik_usaha" ? "Pemilik Usaha" : "Customer"} />
        <InfoRow label="Status"        value={user?.plan === "free" ? "Gratis" : `Premium (${user?.plan})`} />
        <InfoRow label="Versi Aplikasi" value="1.0.0" />
      </div>

      {/* ── Tentang ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>ℹ️ Tentang Aplikasi</SectionTitle>
        <div className="px-6 py-4 flex items-start gap-3">
          <Info size={16} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed">
            UMKM Grow+ adalah platform digital untuk membantu pelaku UMKM Indonesia berkembang dengan bantuan AI, kalkulator keuangan, dan komunitas bisnis.
          </p>
        </div>
      </div>

      {/* ── Aksi Akun ── */}
      <div className="space-y-3">
        <button onClick={handleLogout}
          className="w-full py-4 bg-white border border-red-100 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all shadow-sm">
          Keluar dari Akun
        </button>

        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)}
            className="w-full py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-400 font-semibold text-sm hover:border-red-200 hover:text-red-400 transition-all flex items-center justify-center gap-2">
            <Trash2 size={15} /> Hapus Akun
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
            <p className="text-sm font-bold text-red-700">Yakin ingin menghapus akun?</p>
            <p className="text-xs text-red-500">Semua data kamu akan dihapus permanen dan tidak bisa dipulihkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(false)}
                className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                Batal
              </button>
              <button className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
