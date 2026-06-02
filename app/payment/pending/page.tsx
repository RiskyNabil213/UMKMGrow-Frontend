"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, RefreshCw, ArrowRight, Loader2, Copy, CheckCheck } from "lucide-react";

const API_URL = "/api";

function PendingContent() {
  const searchParams = useSearchParams();
  const orderId      = searchParams.get("order_id") ?? "";

  const [copied,   setCopied]   = useState(false);
  const [checking, setChecking] = useState(false);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkStatus = async () => {
    if (!orderId) return;
    setChecking(true);
    try {
      const res  = await fetch(`/api/payment/status/${orderId}`);
      const data = await res.json();
      if (data.status === "paid") {
        window.location.href = `/payment/success?order_id=${orderId}`;
      } else if (data.status === "failed" || data.status === "expired") {
        window.location.href = `/payment/failed?order_id=${orderId}`;
      }
    } catch { /* silent */ }
    finally { setChecking(false); }
  };

  // Auto-check setiap 10 detik
  useEffect(() => {
    if (!orderId) return;
    const id = setInterval(checkStatus, 10000);
    return () => clearInterval(id);
  }, [orderId]);

  return (
    <div className="max-w-lg mx-auto pt-10 pb-20 text-center space-y-6">

      {/* Icon */}
      <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
        <Clock size={48} className="text-yellow-500" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Menunggu Pembayaran</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Selesaikan pembayaran sesuai instruksi yang diberikan sebelum batas waktu habis.
        </p>
      </div>

      {/* Order ID */}
      {orderId && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Order ID</p>
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
            <span className="font-mono text-sm font-bold text-gray-800 truncate">{orderId}</span>
            <button onClick={copyOrderId} className="ml-2 text-indigo-600 hover:text-indigo-700 flex-shrink-0">
              {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Simpan sebagai referensi pembayaran</p>
        </div>
      )}

      {/* Instruksi */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-[24px] p-6 text-left">
        <h3 className="font-bold text-yellow-800 mb-3 text-sm">Cara Menyelesaikan Pembayaran</h3>
        <ol className="space-y-2">
          {[
            "Buka aplikasi bank atau e-wallet kamu",
            "Masukkan kode pembayaran atau scan QR yang diberikan",
            "Pastikan nominal sesuai dengan total tagihan",
            "Selesaikan sebelum batas waktu berakhir",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-yellow-700">
              <span className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Auto-check indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        Mengecek status otomatis setiap 10 detik...
      </div>

      {/* Aksi */}
      <div className="space-y-3">
        <button
          onClick={checkStatus}
          disabled={checking}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {checking ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Cek Status Sekarang
        </button>
        <Link href="/upgrade">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-100 transition-all">
            Kembali ke Halaman Upgrade <ArrowRight size={16} />
          </button>
        </Link>
      </div>

      <p className="text-xs text-gray-400">
        Butuh bantuan?{" "}
        <span className="text-indigo-600 cursor-pointer hover:underline">Hubungi support kami</span>
      </p>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-indigo-600" /></div>}>
      <PendingContent />
    </Suspense>
  );
}
