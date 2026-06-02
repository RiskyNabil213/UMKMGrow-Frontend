"use client";

import {
  User, Mail, Building, ShieldCheck, LogOut, Camera,
  Crown, ChevronRight, Star, TrendingUp, MessageSquare, Calculator,
  Bell, Settings, Shield, Clock, Edit3, Sparkles, X, Save,
  Check, Eye, EyeOff, KeyRound, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";
import { useState } from "react";

// ─── Tipe ─────────────────────────────────────────────────────────────────────

type ModalType = "edit-profile" | "change-password" | null;

// ─── Konstanta ────────────────────────────────────────────────────────────────

const INPUT =
  "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

// ─── Komponen ─────────────────────────────────────────────────────────────────

function ProfileField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Modal Edit Profil ────────────────────────────────────────────────────────

function EditProfileModal({
  onClose, initialName, initialBusiness,
}: { onClose: () => void; initialName: string; initialBusiness: string }) {
  const { updateProfile } = useAuth();
  const [name,     setName]     = useState(initialName);
  const [business, setBusiness] = useState(initialBusiness);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSave() {
    if (!name.trim()) { setError("Nama tidak boleh kosong"); return; }
    setLoading(true); setError("");
    try {
      await updateProfile({ name: name.trim(), businessName: business.trim() || undefined });
      setSuccess(true);
      setTimeout(onClose, 800);
    } catch (e: any) {
      setError(e.message ?? "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-800 text-lg">Edit Profil</h2>
            <p className="text-xs text-gray-400 mt-0.5">Perbarui informasi akun kamu</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className={LABEL}>Nama Lengkap *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Nama Usaha</label>
            <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Nama toko / bisnis (opsional)" className={INPUT} />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 px-3 py-2 rounded-xl">
              <AlertCircle size={13} /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-xs bg-green-50 px-3 py-2 rounded-xl">
              <Check size={13} /> Profil berhasil diperbarui!
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">
              Batal
            </button>
            <button onClick={handleSave} disabled={loading || success}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Ganti Password ─────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { changePassword } = useAuth();
  const [current,  setCurrent]  = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSave() {
    if (!current || !next || !confirm) { setError("Semua field wajib diisi"); return; }
    if (next.length < 6) { setError("Password baru minimal 6 karakter"); return; }
    if (next !== confirm) { setError("Konfirmasi password tidak cocok"); return; }
    setLoading(true); setError("");
    try {
      await changePassword(current, next);
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch (e: any) {
      setError(e.message ?? "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-800 text-lg">Ganti Password</h2>
            <p className="text-xs text-gray-400 mt-0.5">Pastikan password baru kuat dan mudah diingat</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Password lama */}
          <div>
            <label className={LABEL}>Password Saat Ini *</label>
            <div className="relative">
              <input type={showCur ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)}
                placeholder="Password lama" className={INPUT + " pr-11"} />
              <button type="button" onClick={() => setShowCur((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCur ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {/* Password baru */}
          <div>
            <label className={LABEL}>Password Baru *</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={next} onChange={(e) => setNext(e.target.value)}
                placeholder="Minimal 6 karakter" className={INPUT + " pr-11"} />
              <button type="button" onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength indicator */}
            {next.length > 0 && (
              <div className="flex gap-1 mt-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                    next.length >= i * 3
                      ? i <= 2 ? "bg-red-400" : i === 3 ? "bg-yellow-400" : "bg-green-500"
                      : "bg-gray-200"
                  }`} />
                ))}
                <span className="text-[10px] text-gray-400 ml-1">
                  {next.length < 6 ? "Lemah" : next.length < 9 ? "Cukup" : next.length < 12 ? "Baik" : "Kuat"}
                </span>
              </div>
            )}
          </div>
          {/* Konfirmasi */}
          <div>
            <label className={LABEL}>Konfirmasi Password Baru *</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password baru" className={INPUT} />
            {confirm && next !== confirm && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> Password tidak cocok
              </p>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 px-3 py-2 rounded-xl">
              <AlertCircle size={13} /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-xs bg-green-50 px-3 py-2 rounded-xl">
              <Check size={13} /> Password berhasil diubah!
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">
              Batal
            </button>
            <button onClick={handleSave} disabled={loading || success}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <KeyRound size={15} />}
              {loading ? "Menyimpan..." : "Ubah Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────

export default function ProfilPage() {
  const router = useRouter();
  const { user, isPremium, plan, logout } = useAuth();
  const [modal, setModal] = useState<ModalType>(null);

  const planLabel  = plan === "business" ? "Bisnis" : plan === "pro" ? "Pro" : "Gratis";
  const initials   = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  const joinedDays = user?.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86_400_000)
    : 0;
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    : "-";

  function handleLogout() { logout(); router.push("/login"); }

  const stats = [
    { label: "Hari Bergabung", value: String(joinedDays), icon: Clock,         color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Konsultasi AI",  value: "0",                icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Kalkulasi",      value: "0",                icon: Calculator,    color: "text-blue-600",   bg: "bg-blue-50"   },
    { label: "Skor Bisnis",    value: "—",                icon: TrendingUp,    color: "text-green-600",  bg: "bg-green-50"  },
  ];

  const menuSettings = [
    {
      icon: Edit3,    label: "Edit Profil",     desc: "Ubah nama dan informasi usaha",
      action: () => setModal("edit-profile"),
    },
    {
      icon: KeyRound, label: "Ganti Password",  desc: "Perbarui password akun kamu",
      action: () => setModal("change-password"),
    },
    {
      icon: Bell,     label: "Notifikasi",      desc: "Atur preferensi notifikasi",
      href: "/pengaturan#notifikasi",
    },
    {
      icon: Shield,   label: "Keamanan",        desc: "Sesi aktif dan riwayat login",
      href: "/pengaturan#keamanan",
    },
    {
      icon: Settings, label: "Pengaturan Aplikasi", desc: "Tampilan, bahasa, dan preferensi",
      href: "/pengaturan",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profil Saya</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola informasi dan akun kamu</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="px-8 pb-8">
          {/* Avatar + Actions */}
          <div className="relative -mt-14 mb-6 flex justify-between items-end">
            <div className="relative group">
              <div className="w-28 h-28 bg-white p-1.5 rounded-3xl shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl font-bold">
                  {initials}
                </div>
              </div>
              <button className="absolute bottom-1 right-1 w-8 h-8 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                <Camera size={14} className="text-gray-500" />
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <button onClick={() => setModal("edit-profile")}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                <Edit3 size={15} /> Edit Profil
              </button>
            </div>
          </div>

          {/* Name & Badge */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-800">{user?.name ?? "Pengguna"}</h2>
              {isPremium ? (
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Crown size={9} /> {planLabel}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Gratis
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {user?.email}{user?.businessName ? ` · ${user.businessName}` : ""}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <p className="text-xl font-bold text-gray-800">{s.value}</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileField icon={<User size={16} />}        label="Nama Lengkap"    value={user?.name ?? "-"} />
            <ProfileField icon={<Mail size={16} />}        label="Email"           value={user?.email ?? "-"} />
            <ProfileField icon={<Building size={16} />}    label="Nama Usaha"      value={user?.businessName ?? "Belum diisi"} />
            <ProfileField icon={<ShieldCheck size={16} />} label="Status Akun"     value={isPremium ? `Premium ${planLabel}` : "Gratis (Standard)"} />
            <ProfileField icon={<Star size={16} />}        label="Bergabung Sejak" value={joinedDate} />
          </div>
        </div>
      </div>

      {/* Upgrade / Premium Banner */}
      {isPremium ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-[28px] p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Crown size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                  Kamu sudah Premium {planLabel}! <Sparkles size={18} className="text-yellow-100" />
                </p>
                <p className="text-orange-100 text-sm mt-1">Semua fitur eksklusif sudah aktif di akun kamu.</p>
              </div>
            </div>
            <Link href="/payment/history">
              <button className="flex-shrink-0 flex items-center gap-2 bg-white text-orange-500 px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
                Riwayat Pembayaran <ChevronRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-[28px] p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Crown size={24} className="text-yellow-300" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Upgrade ke Premium</p>
                <p className="text-indigo-200 text-sm mt-1 max-w-sm">
                  Dapatkan analisis AI tak terbatas, laporan keuangan otomatis, dan fitur eksklusif lainnya.
                </p>
              </div>
            </div>
            <Link href="/upgrade">
              <button className="flex-shrink-0 flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
                Lihat Paket <ChevronRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Settings Menu */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Pengaturan Akun</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {menuSettings.map((item) => {
            const content = (
              <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <item.icon size={18} className="text-gray-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
              </div>
            );
            if ("action" in item) {
              return <button key={item.label} onClick={item.action} className="w-full text-left">{content}</button>;
            }
            return <Link key={item.label} href={item.href!}>{content}</Link>;
          })}
        </div>
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold border border-red-100 rounded-[20px] hover:bg-red-50 transition-all bg-white shadow-sm">
        <LogOut size={18} /> Keluar dari Akun
      </button>

      {/* Modals */}
      {modal === "edit-profile" && (
        <EditProfileModal
          onClose={() => setModal(null)}
          initialName={user?.name ?? ""}
          initialBusiness={user?.businessName ?? ""}
        />
      )}
      {modal === "change-password" && (
        <ChangePasswordModal onClose={() => setModal(null)} />
      )}
    </div>
  );
}
