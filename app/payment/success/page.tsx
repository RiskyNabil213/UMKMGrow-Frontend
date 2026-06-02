"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Crown, ArrowRight, Loader2, Download, Home } from "lucide-react";
import { useUser } from "@/context/UserContext";

const API_URL = "/api";

interface PaymentDetail {
  orderId:      string;
  plan:         string;
  billingCycle: string;
  amount:       number;
  paidAt:       string;
  status:       string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId      = searchParams.get("order_id") ?? "";
  const { refresh }  = useUser();

  const [detail,  setDetail]  = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }

    fetch(`/api/payment/status/${orderId}`)
      .then((r) => r.json())
      .then(setDetail)
      .catch(() => {})
      .finally(async () => {
        setLoading(false);
        // Refresh data user (termasuk plan terbaru) dari server
        await refresh();
      });
  }, [orderId]);

  const planLabel:    Record<string, string> = { pro: "Pro", business: "Bisnis" };
  const billingLabel: Record<string, string> = { monthly: "Bulanan", yearly: "Tahunan" };

  return (
    <div className="max-w-lg mx-auto pt-10 pb-20 text-center space-y-6">

      {/* Icon */}
      <div className="relative inline-flex">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <Crown size={16} className="text-white" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil! 🎉</h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Akun kamu sudah diupgrade. Nikmati semua fitur premium UMKM Grow+.
        </p>
      </div>

      {/* Detail Transaksi */}
      {loading ? (
        <div className="bg-white rounded-[24px] border border-gray-100 p-8">
          <Loader2 size={24} className="animate-spin text-indigo-600 mx-auto" />
        </div>
      ) : detail ? (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 text-left space-y-1">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3">Detail Transaksi</h3>
          <Row label="Order ID"    value={detail.orderId} mono />
          <Row label="Paket"       value={`UMKM Grow+ ${planLabel[detail.plan] ?? detail.plan}`} />
          <Row label="Siklus"      value={billingLabel[detail.billingCycle] ?? detail.billingCycle} />
          <Row label="Total Bayar" value={`Rp ${detail.amount?.toLocaleString("id-ID")}`} highlight />
          {detail.paidAt && (
            <Row
              label="Waktu Bayar"
              value={new Date(detail.paidAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
            />
          )}
          <div className="pt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Pembayaran Dikonfirmasi
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-gray-100 p-5">
          <p className="text-sm text-gray-500">
            Order ID: <span className="font-mono font-bold">{orderId}</span>
          </p>
        </div>
      )}

      {/* Aksi */}
      <div className="space-y-3">
        <Link href="/">
          <button className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            <Home size={18} /> Mulai Gunakan Premium <ArrowRight size={18} />
          </button>
        </Link>
        <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-100 transition-all">
          <Download size={16} /> Unduh Bukti Pembayaran
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Konfirmasi dikirim ke email kamu.{" "}
        <span className="text-indigo-600 cursor-pointer hover:underline">Butuh bantuan?</span>
      </p>
    </div>
  );
}

function Row({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className={`text-sm font-bold ${highlight ? "text-indigo-600" : "text-gray-800"} ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-indigo-600" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
