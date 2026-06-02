"use client";

import {
  Settings, Bell, Shield, Moon, Store, Trash2,
  ChevronLeft, ToggleLeft, ToggleRight, Info, Crown, Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pt-5 pb-2">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{children}</p>
    </div>
  );
}

function ToggleRow({
  label, desc, value, onChange, icon,
}: {
  label: string; desc: string; value: boolean;
  onChange: (v: boolean) => void; icon?: React.ReactNode;
}) {
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
          ? <ToggleRight size={28} className="text-orange-500" />
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

export default function PemilikPengaturanPage() {
  const { user, logout, isPremium, plan } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const router = useRouter();

  const [notifLowongan,  setNotifLowongan]  = useState(true);
  const [notifAplikasi,  setNotifAplikasi]  = useState(true);
  const [notifPromo,     setNotifPromo]     = useState(false);
  const [notifEmail,     setNotifEmail]     = useState(true);
  const [autoPublish,    setAutoPublish]    = useState(false);
  const [showContact,    setShowContact]    = useState(true);
  const [deleteConfirm,  setDeleteConfirm]  = useState(false);

  function handleLogout() { logout(); router.push("/login"); }

  return (
    <div className="max-w-2xl mx-auto pb-20 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3 pt-2 pb-2">
        <Link href="/pemilik"
          className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <ChevronLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Settings size={20} className="text-orange-500" /> Pengaturan Usaha
          </h1>
          <p className="text-xs text-gray-400">Kelola preferensi akun pemilik usaha kamu</p>
        </div>
      </div>

      {/* Status Premium */}
      {isPremium ? (
        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Crown size={22} className="text-white" />
          </div>
          <div>
            <p className="font-black text-white text-base">{plan === "business" ? "Bisnis 👑" : "Pro ⭐"} Aktif</p>
            <p className="text-yellow-100 text-xs mt-0.5">Semua fitur premium sudah aktif</p>
          </div>
        </div>
      ) : (
        <Link href="/upgrade">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 flex items-center gap-4 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Crown size={22} className="text-yellow-300" />
            </div>
            <div className="flex-1">
              <p className="font-black text-white text-base">Upgrade ke Premium</p>
              <p className="text-orange-100 text-xs mt-0.5">Buka fitur AI tak terbatas & analisis usaha</p>
            </div>
            <ChevronLeft size={18} className="text-white/70 rotate-180 shrink-0" />
          </div>
        </Link>
      )}

      {/* Notifikasi Usaha */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>🔔 Notifikasi</SectionTitle>
        <ToggleRow
          icon={<Briefcase size={16} className="text-orange-500" />}
          label="Notifikasi Lowongan"
          desc="Pemberitahuan saat ada pelamar baru"
          value={notifLowongan} onChange={setNotifLowongan}
        />
        <ToggleRow
          icon={<Bell size={16} className="text-blue-500" />}
          label="Email Notifikasi"
          desc="Ringkasan aktivitas usaha ke email"
          value={notifEmail} onChange={setNotifEmail}
        />
        <ToggleRow
          icon={<Bell size={16} className="text-green-500" />}
          label="Update Aplikasi"
          desc="Info fitur baru dan pembaruan"
          value={notifAplikasi} onChange={setNotifAplikasi}
        />
        <ToggleRow
          icon={<Bell size={16} className="text-purple-500" />}
          label="Promo & Penawaran"
          desc="Diskon dan penawaran khusus pemilik"
          value={notifPromo} onChange={setNotifPromo}
        />
      </div>

      {/* Preferensi Usaha */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>🏪 Preferensi Usaha</SectionTitle>
        <ToggleRow
          icon={<Briefcase size={16} className="text-orange-500" />}
          label="Auto Publish Lowongan"
          desc="Lowongan baru langsung aktif tanpa review"
          value={autoPublish} onChange={setAutoPublish}
        />
        <ToggleRow
          icon={<Store size={16} className="text-teal-500" />}
          label="Tampilkan Info Kontak"
          desc="Nomor HP & email terlihat di profil usaha"
          value={showContact} onChange={setShowContact}
        />
      </div>

      {/* Tampilan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>🎨 Tampilan</SectionTitle>
        <ToggleRow
          icon={<Moon size={16} className="text-gray-600" />}
          label="Mode Gelap"
          desc="Tampilan gelap untuk menghemat baterai"
          value={darkMode} onChange={setDarkMode}
        />
      </div>

      {/* Keamanan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>🔐 Keamanan</SectionTitle>
        <div className="px-6 py-4 border-b border-gray-50">
          <Link href="/pemilik/profil" className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                <Shield size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-orange-500 transition-colors">Ganti Password</p>
                <p className="text-xs text-gray-400">Perbarui password akun kamu</p>
              </div>
            </div>
            <ChevronLeft size={16} className="text-gray-300 rotate-180 group-hover:text-orange-400 transition-colors" />
          </Link>
        </div>
        <div className="px-6 py-4">
          <Link href="/pemilik/profil" className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                <Store size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-orange-500 transition-colors">Edit Profil Usaha</p>
                <p className="text-xs text-gray-400">Ubah nama, deskripsi, dan info usaha</p>
              </div>
            </div>
            <ChevronLeft size={16} className="text-gray-300 rotate-180 group-hover:text-orange-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Info Akun */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>👤 Info Akun</SectionTitle>
        <InfoRow label="Nama"          value={user?.name ?? "-"} />
        <InfoRow label="Email"         value={user?.email ?? "-"} />
        <InfoRow label="Nama Usaha"    value={user?.businessName ?? "-"} />
        <InfoRow label="Tipe Akun"     value="Pemilik Usaha" />
        <InfoRow label="Status"        value={isPremium ? `Premium (${plan === "business" ? "Bisnis" : "Pro"})` : "Gratis"} />
        <InfoRow label="Versi Aplikasi" value="1.0.0" />
      </div>

      {/* Tentang */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionTitle>ℹ️ Tentang</SectionTitle>
        <div className="px-6 py-4 flex items-start gap-3">
          <Info size={16} className="text-gray-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed">
            UMKM Grow+ membantu pemilik usaha mengelola lowongan kerja, menemukan supplier terpercaya, dan mengembangkan bisnis dengan bantuan kecerdasan buatan.
          </p>
        </div>
      </div>

      {/* Aksi Akun */}
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
            <p className="text-xs text-red-500">Semua data termasuk lowongan dan supplier yang kamu buat akan dihapus permanen.</p>
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
