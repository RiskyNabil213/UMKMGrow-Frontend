"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft, Loader2, MessageSquare } from "lucide-react";

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId  = searchParams.get("order_id") ?? "";
  const plan     = searchParams.get("plan")     ?? "pro";
  const billing  = searchParams.get("billing")  ?? "monthly";

  return (
    <div className="max-w-lg mx-auto pt-10 pb-20 text-center space-y-6">

      {/* Icon */}
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <XCircle size={48} className="text-red-500" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Gagal</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Transaksi tidak dapat diselesaikan. Tidak ada biaya yang dikenakan.
        </p>
      </div>

      {/* Order ID */}
      {orderId && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-4">
          <p className="text-xs text-gray-500">
            Order ID: <span className="font-mono font-bold text-gray-700">{orderId}</span>
          </p>
        </div>
      )}

      {/* Kemungkinan Penyebab */}
      <div className="bg-red-50 border border-red-100 rounded-[24px] p-6 text-left">
        <h3 className="font-bold text-red-700 mb-3 text-sm">Kemungkinan Penyebab</h3>
        <ul className="space-y-2">
          {[
            "Pembayaran dibatalkan",
            "Batas waktu pembayaran habis",
            "Kartu atau rekening ditolak",
            "Saldo tidak mencukupi",
          ].map((r) => (
            <li key={r} className="flex items-center gap-2.5 text-sm text-red-600">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Aksi */}
      <div className="space-y-3">
        <Link href={`/payment/checkout?plan=${plan}&billing=${billing}`}>
          <button className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            <RefreshCw size={18} /> Coba Lagi
          </button>
        </Link>
        <Link href="/upgrade">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-100 transition-all">
            <ArrowLeft size={16} /> Kembali ke Halaman Upgrade
          </button>
        </Link>
        <button className="w-full border border-indigo-100 text-indigo-600 py-3.5 rounded-2xl font-semibold hover:bg-indigo-50 transition-all text-sm flex items-center justify-center gap-2">
          <MessageSquare size={16} /> Hubungi Support
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Merasa ini kesalahan?{" "}
        <span className="text-indigo-600 cursor-pointer hover:underline">Hubungi tim kami</span>
      </p>
    </div>
  );
}

export default function FailedPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-indigo-600" /></div>}>
      <FailedContent />
    </Suspense>
  );
}
