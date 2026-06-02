"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Globe, Bell, Shield, CreditCard,
  Mail, Save, ChevronRight, ToggleLeft, ToggleRight,
  Info,
} from "lucide-react";

type Section = "umum" | "notifikasi" | "keamanan" | "pembayaran";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="shrink-0">
      {enabled
        ? <ToggleRight size={28} className="text-indigo-600" />
        : <ToggleLeft  size={28} className="text-gray-300" />}
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function PengaturanSistemPage() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<Section>("umum");
  const [saved, setSaved] = useState(false);

  // Toggle states
  const [toggles, setToggles] = useState({
    maintenance:    false,
    registration:   true,
    emailVerify:    false,
    notifNewUser:   true,
    notifPayment:   true,
    notifReport:    false,
    twoFactor:      false,
    loginLog:       true,
    sandboxPayment: true,
    autoUpgrade:    false,
  });

  // Text inputs
  const [appName,    setAppName]    = useState("UMKM Grow+");
  const [supportEmail, setSupportEmail] = useState("support@umkmgrow.id");
  const [maxChat,    setMaxChat]    = useState("10");

  useEffect(() => {
    if (user && role === "customer") router.replace("/");
  }, [user, role, router]);

  function toggle(key: keyof typeof toggles) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const navItems: { key: Section; label: string; icon: React.ElementType }[] = [
    { key: "umum",        label: "Umum",          icon: Globe      },
    { key: "notifikasi",  label: "Notifikasi",     icon: Bell       },
    { key: "keamanan",    label: "Keamanan",       icon: Shield     },
    { key: "pembayaran",  label: "Pembayaran",     icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.push("/admin")}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-gray-800 text-base leading-tight">Pengaturan Sistem</h1>
          <p className="text-[11px] text-gray-400">Konfigurasi platform UMKM Grow+</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            saved ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}>
          <Save size={15} /> {saved ? "Tersimpan ✓" : "Simpan"}
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Nav */}
          <div className="md:w-52 shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              {navItems.map((item) => (
                <button key={item.key} onClick={() => setSection(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0 ${
                    section === item.key
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <item.icon size={16} />
                  {item.label}
                  <ChevronRight size={14} className="ml-auto text-gray-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">

            {/* ── Umum ── */}
            {section === "umum" && (
              <>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Globe size={16} className="text-indigo-600" /> Informasi Aplikasi
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Aplikasi</label>
                      <input value={appName} onChange={(e) => setAppName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Support</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Batas Chat AI Gratis / Hari</label>
                      <input type="number" value={maxChat} onChange={(e) => setMaxChat(e.target.value)} min={1} max={100}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <Globe size={16} className="text-indigo-600" /> Status Platform
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Kontrol akses dan status platform</p>
                  <SettingRow label="Mode Maintenance" desc="Nonaktifkan akses publik sementara">
                    <Toggle enabled={toggles.maintenance} onToggle={() => toggle("maintenance")} />
                  </SettingRow>
                  <SettingRow label="Registrasi Pengguna Baru" desc="Izinkan pendaftaran akun baru">
                    <Toggle enabled={toggles.registration} onToggle={() => toggle("registration")} />
                  </SettingRow>
                  <SettingRow label="Verifikasi Email" desc="Wajibkan verifikasi email saat daftar">
                    <Toggle enabled={toggles.emailVerify} onToggle={() => toggle("emailVerify")} />
                  </SettingRow>
                </div>
              </>
            )}

            {/* ── Notifikasi ── */}
            {section === "notifikasi" && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <Bell size={16} className="text-indigo-600" /> Pengaturan Notifikasi
                </h3>
                <p className="text-xs text-gray-400 mb-4">Atur notifikasi yang dikirim ke admin</p>
                <SettingRow label="Pengguna Baru Mendaftar" desc="Notifikasi saat ada akun baru">
                  <Toggle enabled={toggles.notifNewUser} onToggle={() => toggle("notifNewUser")} />
                </SettingRow>
                <SettingRow label="Pembayaran Masuk" desc="Notifikasi setiap transaksi berhasil">
                  <Toggle enabled={toggles.notifPayment} onToggle={() => toggle("notifPayment")} />
                </SettingRow>
                <SettingRow label="Laporan Mingguan" desc="Kirim ringkasan statistik tiap minggu">
                  <Toggle enabled={toggles.notifReport} onToggle={() => toggle("notifReport")} />
                </SettingRow>
              </div>
            )}

            {/* ── Keamanan ── */}
            {section === "keamanan" && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <Shield size={16} className="text-indigo-600" /> Keamanan Akun
                </h3>
                <p className="text-xs text-gray-400 mb-4">Konfigurasi keamanan platform</p>
                <SettingRow label="Autentikasi Dua Faktor (2FA)" desc="Wajibkan 2FA untuk semua admin">
                  <Toggle enabled={toggles.twoFactor} onToggle={() => toggle("twoFactor")} />
                </SettingRow>
                <SettingRow label="Log Aktivitas Login" desc="Catat semua percobaan login">
                  <Toggle enabled={toggles.loginLog} onToggle={() => toggle("loginLog")} />
                </SettingRow>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3">
                  <Info size={15} className="text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-700 font-medium">
                    Perubahan pengaturan keamanan akan berlaku pada sesi login berikutnya.
                  </p>
                </div>
              </div>
            )}

            {/* ── Pembayaran ── */}
            {section === "pembayaran" && (
              <>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <CreditCard size={16} className="text-indigo-600" /> Konfigurasi Midtrans
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">Pengaturan gateway pembayaran</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Server Key</label>
                      <input type="password" defaultValue="SB-Mid-server-xxxxxxxxxxxx"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Client Key</label>
                      <input type="password" defaultValue="SB-Mid-client-xxxxxxxxxxxx"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-mono" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">Mode & Opsi</h3>
                  <SettingRow label="Mode Sandbox" desc="Gunakan environment testing Midtrans">
                    <Toggle enabled={toggles.sandboxPayment} onToggle={() => toggle("sandboxPayment")} />
                  </SettingRow>
                  <SettingRow label="Auto Upgrade Plan" desc="Otomatis upgrade plan setelah pembayaran">
                    <Toggle enabled={toggles.autoUpgrade} onToggle={() => toggle("autoUpgrade")} />
                  </SettingRow>
                  {toggles.sandboxPayment && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                      <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 font-medium">
                        Mode Sandbox aktif. Transaksi tidak akan diproses secara nyata.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
