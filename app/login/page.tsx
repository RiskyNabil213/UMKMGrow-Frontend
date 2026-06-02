"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, role } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Redirect berdasarkan role dari JWT (diisi setelah login)
      // Baca role langsung dari localStorage karena state belum update
      const saved = localStorage.getItem("user");
      const userRole = saved ? JSON.parse(saved).role : "customer";
      if (userRole === "admin") {
        router.push("/admin");
      } else if (userRole === "pemilik_usaha") {
        router.push("/pemilik");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message ?? "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">U</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">UMKM Grow+</h1>
          <p className="text-gray-400 mt-1 text-sm">Masuk ke akun kamu</p>
        </div>

        <div className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-8 space-y-5">
          <div>
            <h2 className="text-xl font-black text-gray-800">Selamat Datang 👋</h2>
            <p className="text-sm text-gray-400 mt-0.5">Masukkan email dan password kamu</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Masuk...</> : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link href="/register" className="text-indigo-600 font-bold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
