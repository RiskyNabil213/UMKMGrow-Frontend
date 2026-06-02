"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, Building2, Loader2, Store, CheckCircle2 } from "lucide-react";
import { useAuth, type UserRole } from "@/context/UserContext";

const ROLES: {
  value: UserRole;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  activeBorder: string;
  activeBg: string;
  iconBg: string;
}[] = [
  {
    value:        "customer",
    label:        "Customer",
    desc:         "Akses fitur UMKM, AI konsultasi & kalkulator",
    icon:         User,
    color:        "text-teal-600",
    activeBorder: "border-teal-400",
    activeBg:     "bg-teal-50",
    iconBg:       "bg-teal-100",
  },
  {
    value:        "pemilik_usaha",
    label:        "Pemilik Usaha",
    desc:         "Tambah lowongan kerja & daftarkan supplier",
    icon:         Store,
    color:        "text-orange-600",
    activeBorder: "border-orange-400",
    activeBg:     "bg-orange-50",
    iconBg:       "bg-orange-100",
  },
];

const INPUT = "w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form,         setForm]         = useState({ name: "", email: "", password: "", businessName: "" });
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [showPass,     setShowPass]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password minimal 6 karakter"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, role: selectedRole }),
      });

      // Cek content-type sebelum parse JSON
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", res.status, text.slice(0, 200));
        if (res.status === 404) throw new Error("Endpoint tidak ditemukan. Periksa URL backend.");
        if (res.status >= 500) throw new Error("Server backend sedang bermasalah. Coba beberapa saat lagi.");
        if (res.status === 0 || !res.ok) throw new Error("Tidak dapat terhubung ke server. Periksa koneksi.");
        throw new Error(`Server error (${res.status}). Coba lagi.`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Registrasi gagal");
      await login(form.email, form.password);
      router.push(selectedRole === "pemilik_usaha" ? "/pemilik" : "/");
    } catch (err: any) {
      setError(err.message ?? "Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">U</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">UMKM Grow+</h1>
          <p className="text-gray-400 mt-1 text-sm">Buat akun baru kamu</p>
        </div>

        <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-8 space-y-5">
          <div>
            <h2 className="text-xl font-black text-gray-800">Daftar Sekarang 🚀</h2>
            <p className="text-sm text-gray-400 mt-0.5">Pilih tipe akun yang sesuai</p>
          </div>

          {/* ── Role Selector ── */}
          <div className="space-y-2">
            {ROLES.map((r) => {
              const isActive = selectedRole === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedRole(r.value)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                    isActive
                      ? `${r.activeBorder} ${r.activeBg}`
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 ${isActive ? r.iconBg : "bg-gray-100"} rounded-xl flex items-center justify-center shrink-0 transition-colors`}>
                    <r.icon size={19} className={isActive ? r.color : "text-gray-400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-tight ${isActive ? r.color : "text-gray-700"}`}>
                      {r.label}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{r.desc}</p>
                  </div>
                  {isActive && (
                    <CheckCircle2 size={18} className={`${r.color} shrink-0`} />
                  )}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Nama kamu" required className={INPUT} />
              </div>
            </div>

            {/* Nama Usaha */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Nama Usaha <span className="text-gray-400 normal-case font-normal">(opsional)</span>
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="businessName" value={form.businessName} onChange={handleChange}
                  placeholder="Nama toko / usaha kamu" className={INPUT} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="kamu@email.com" required className={INPUT} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Mendaftar...</> : "Buat Akun"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
