"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Crown, Check, Shield, Lock,
  ChevronRight, Loader2, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/UserContext";

const PLAN_META = {
  pro:      { name: "Pro",    color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-300" },
  business: { name: "Bisnis", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-300" },
} as const;

const PRICES: Record<string, Record<string, number>> = {
  pro:      { monthly: 99_000,  yearly: 990_000  },
  business: { monthly: 249_000, yearly: 2_490_000 },
};

const FEATURES: Record<string, string[]> = {
  pro:      ["Konsultasi AI tak terbatas", "Kalkulator keuangan lengkap", "Analisis AI mendalam", "Laporan keuangan otomatis", "Promosi AI tanpa batas"],
  business: ["Semua fitur Pro", "Direktori supplier premium", "Prioritas dukungan 24/7", "Mentoring bisnis bulanan", "Laporan analitik lanjutan"],
};

const API_URL = "/api";
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";
const IS_PROD    = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const isKeyOk    = (k: string) => !!k && !k.includes("GANTI") && !k.includes("XXXXXXXX") && k.length > 10;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { user, authLoading } = useAuth();

  const rawPlan    = searchParams.get("plan")    ?? "";
  const rawBilling = searchParams.get("billing") ?? "";

  // Sanitasi — pastikan hanya nilai valid yang dipakai
  const plan    = (["pro", "business"].includes(rawPlan)    ? rawPlan    : "pro")     as "pro" | "business";
  const billing = (["monthly", "yearly"].includes(rawBilling) ? rawBilling : "monthly") as "monthly" | "yearly";

  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [snapReady, setSnapReady] = useState(false);
  const snapLoaded = useRef(false);

  const meta     = PLAN_META[plan] ?? PLAN_META.pro;
  const amount   = PRICES[plan]?.[billing] ?? 99_000;
  const features = FEATURES[plan] ?? [];
  const keyOk    = isKeyOk(CLIENT_KEY);

  // Redirect ke login jika tidak ada user setelah auth selesai
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=/payment/checkout?plan=${plan}&billing=${billing}`);
    }
  }, [authLoading, user, plan, billing, router]);

  // Load Midtrans Snap.js (hanya jika key valid)
  useEffect(() => {
    if (!keyOk || snapLoaded.current) return;
    snapLoaded.current = true;
    document.getElementById("midtrans-snap")?.remove();
    const script = document.createElement("script");
    script.id    = "midtrans-snap";
    script.src   = IS_PROD
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", CLIENT_KEY);
    script.onload  = () => setSnapReady(true);
    script.onerror = () => setError("Gagal memuat Midtrans.");
    document.head.appendChild(script);
  }, [keyOk]);

  const handlePay = async () => {
    if (!agreed) { setError("Harap centang persetujuan terlebih dahulu."); return; }

    // Guard: pastikan semua nilai valid sebelum kirim
    if (!["pro", "business"].includes(plan)) {
      setError("Paket tidak valid. Kembali ke halaman upgrade dan pilih paket.");
      return;
    }
    if (!["monthly", "yearly"].includes(billing)) {
      setError("Siklus billing tidak valid. Kembali dan coba lagi.");
      return;
    }
    if (!user?.id) {
      setError("Sesi login tidak ditemukan. Silakan login ulang.");
      return;
    }

    const userId = Number(user.id);
    if (isNaN(userId) || userId <= 0) {
      setError("Data akun tidak valid. Silakan login ulang.");
      return;
    }

    setLoading(true);
    setError("");

    // Ambil token dari localStorage
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      setError("Token login tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        plan:          plan,
        billingCycle:  billing,
        customerName:  user.name  ?? "Pengguna",
        customerEmail: user.email ?? "",
      };

      const res = await fetch(`/api/payment/create`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Gagal menghubungi server");
      }

      const { snapToken, orderId, simulation, snapRedirectUrl } = await res.json();
      if (!orderId) throw new Error("Order ID tidak diterima");

      // Mode simulasi → ke halaman simulasi lokal
      if (simulation) {
        // Ambil query params dari snapRedirectUrl dan redirect ke path lokal
        try {
          const url = new URL(snapRedirectUrl);
          const params = url.searchParams.toString();
          router.push(`/payment/simulate?${params}`);
        } catch {
          // Fallback kalau URL tidak valid
          router.push(`/payment/simulate?order_id=${orderId}&plan=${plan}&billing=${billing}&amount=${PRICES[plan]?.[billing] ?? 99000}`);
        }
        return;
      }

      // Mode Midtrans real → buka Snap popup
      if (!snapReady) throw new Error("Midtrans belum siap, coba lagi.");
      (window as any).snap.pay(snapToken, {
        onSuccess: () => router.push(`/payment/success?order_id=${orderId}`),
        onPending: () => router.push(`/payment/pending?order_id=${orderId}`),
        onError:   () => router.push(`/payment/failed?order_id=${orderId}&plan=${plan}&billing=${billing}`),
        onClose:   () => setLoading(false),
      });
    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/upgrade" className="p-2 hover:bg-white rounded-full border border-gray-200 shadow-sm transition-all">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          <p className="text-sm text-gray-500 mt-0.5">Selesaikan pembayaran untuk mengaktifkan paket</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Kiri: Ringkasan */}
        <div className="lg:col-span-2 space-y-4">
          <div className={`bg-white rounded-[24px] border-2 ${meta.border} p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-11 h-11 ${meta.bg} rounded-xl flex items-center justify-center`}>
                <Crown size={20} className={meta.color} />
              </div>
              <div>
                <p className="font-bold text-gray-800">UMKM Grow+ {meta.name}</p>
                <p className="text-xs text-gray-500">{billing === "monthly" ? "Langganan Bulanan" : "Langganan Tahunan"}</p>
              </div>
            </div>
            <ul className="space-y-2 mb-5">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-green-600" strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-4 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>Rp {amount.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>PPN (0%)</span><span>Rp 0</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 pt-1">
                <span>Total</span>
                <span className={`${meta.color} text-lg`}>Rp {amount.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
            <Shield size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-700">Pembayaran 100% Aman</p>
              <p className="text-xs text-green-600 mt-0.5">Diproses Midtrans, berlisensi Bank Indonesia. SSL 256-bit.</p>
            </div>
          </div>
        </div>

        {/* Kanan: Konfirmasi & Bayar */}
        <div className="lg:col-span-3 space-y-4">

          {/* Info Pembeli */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Informasi Pembeli</h3>
            {[
              { label: "Nama",  value: user?.name ?? "Pengguna" },
              { label: "Email", value: user?.email ?? "-" },
              { label: "Paket", value: `UMKM Grow+ ${meta.name} — ${billing === "monthly" ? "Bulanan" : "Tahunan"}` },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{row.label}</span>
                <span className="text-sm font-semibold text-gray-700">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Persetujuan */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-5">
            <label className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreed(!agreed)}>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                ${agreed ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                {agreed && <Check size={11} className="text-white" strokeWidth={3} />}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Saya menyetujui{" "}
                <span className="text-indigo-600 font-semibold">Syarat & Ketentuan</span>{" "}
                dan{" "}
                <span className="text-indigo-600 font-semibold">Kebijakan Privasi</span>{" "}
                UMKM Grow+.
              </p>
            </label>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading || authLoading}
            className="w-full py-4 rounded-2xl font-bold text-base bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {authLoading
              ? <><Loader2 size={20} className="animate-spin" /> Memuat sesi...</>
              : loading
                ? <><Loader2 size={20} className="animate-spin" /> Memproses...</>
                : <><Lock size={18} /> Pilih Metode & Bayar — Rp {amount.toLocaleString("id-ID")} <ChevronRight size={18} /></>
            }
          </button>

          <p className="text-center text-xs text-gray-400">
            Kamu akan memilih metode pembayaran di langkah berikutnya
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
