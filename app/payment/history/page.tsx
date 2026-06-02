"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Crown, CheckCircle, Clock, XCircle,
  AlertCircle, Receipt, ChevronRight, Loader2, RefreshCw,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const API_URL = "/api";

interface Payment {
  orderId:      string;
  plan:         string;
  billingCycle: string;
  amount:       number;
  status:       string;
  paidAt:       string | null;
  createdAt:    string;
}

const PLAN_LABEL:    Record<string, string> = { pro: "Pro", business: "Bisnis", free: "Gratis" };
const BILLING_LABEL: Record<string, string> = { monthly: "Bulanan", yearly: "Tahunan" };

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  paid: {
    label:  "Berhasil",
    icon:   <CheckCircle size={15} />,
    bg:     "bg-green-50",
    text:   "text-green-700",
    border: "border-green-200",
  },
  pending: {
    label:  "Menunggu",
    icon:   <Clock size={15} />,
    bg:     "bg-yellow-50",
    text:   "text-yellow-700",
    border: "border-yellow-200",
  },
  failed: {
    label:  "Gagal",
    icon:   <XCircle size={15} />,
    bg:     "bg-red-50",
    text:   "text-red-700",
    border: "border-red-200",
  },
  expired: {
    label:  "Kadaluarsa",
    icon:   <AlertCircle size={15} />,
    bg:     "bg-gray-50",
    text:   "text-gray-500",
    border: "border-gray-200",
  },
};

export default function PaymentHistoryPage() {
  const { isPremium, plan, planExpiresAt, refresh, user } = useUser();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const planLabel = plan === "business" ? "Bisnis" : plan === "pro" ? "Pro" : "Gratis";

  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`/api/payment/history/${user.id}`);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [user?.id]);

  const paidPayments    = payments.filter(p => p.status === "paid");
  const pendingPayments = payments.filter(p => p.status === "pending");
  const otherPayments   = payments.filter(p => !["paid", "pending"].includes(p.status));

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/profil" className="p-2 hover:bg-white rounded-full border border-gray-200 shadow-sm transition-all">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Riwayat Pembayaran</h1>
            <p className="text-sm text-gray-500 mt-0.5">Semua transaksi langganan kamu</p>
          </div>
        </div>
        <button
          onClick={() => { fetchHistory(); refresh(); }}
          className="p-2 hover:bg-white rounded-full border border-gray-200 shadow-sm transition-all"
          title="Refresh"
        >
          <RefreshCw size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Status Akun Aktif */}
      <div className={`rounded-[24px] p-5 ${
        isPremium
          ? "bg-gradient-to-br from-yellow-400 to-orange-400"
          : "bg-gradient-to-br from-indigo-600 to-purple-600"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown size={20} className={isPremium ? "text-white" : "text-yellow-300"} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                {isPremium ? `Paket ${planLabel} Aktif` : "Paket Gratis"}
              </p>
              {isPremium && planExpiresAt ? (
                <p className="text-white/80 text-xs mt-0.5">
                  Aktif hingga {new Date(planExpiresAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
                </p>
              ) : (
                <p className="text-white/80 text-xs mt-0.5">
                  {isPremium ? "Langganan aktif" : "Upgrade untuk fitur lengkap"}
                </p>
              )}
            </div>
          </div>
          {!isPremium && (
            <Link href="/upgrade">
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md transition-all flex items-center gap-1">
                Upgrade <ChevronRight size={14} />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center">
          <Loader2 size={28} className="animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Memuat riwayat pembayaran...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-[24px] p-6 text-center">
          <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-600 font-semibold">{error}</p>
          <button onClick={fetchHistory} className="mt-3 text-xs text-red-500 underline">Coba lagi</button>
        </div>
      )}

      {/* Kosong */}
      {!loading && !error && payments.length === 0 && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center">
          <Receipt size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600 mb-1">Belum ada transaksi</p>
          <p className="text-sm text-gray-400 mb-4">Mulai berlangganan untuk menikmati fitur premium</p>
          <Link href="/upgrade">
            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
              Lihat Paket Premium
            </button>
          </Link>
        </div>
      )}

      {/* Daftar Transaksi */}
      {!loading && !error && payments.length > 0 && (
        <div className="space-y-4">

          {/* Pembayaran Berhasil */}
          {paidPayments.length > 0 && (
            <Section title="Pembayaran Berhasil" count={paidPayments.length}>
              {paidPayments.map(p => <PaymentCard key={p.orderId} payment={p} />)}
            </Section>
          )}

          {/* Menunggu Pembayaran */}
          {pendingPayments.length > 0 && (
            <Section title="Menunggu Pembayaran" count={pendingPayments.length}>
              {pendingPayments.map(p => (
                <PaymentCard key={p.orderId} payment={p}>
                  <Link href={`/payment/pending?order_id=${p.orderId}`}>
                    <button className="text-xs font-bold text-yellow-600 hover:underline flex items-center gap-1">
                      Selesaikan <ChevronRight size={12} />
                    </button>
                  </Link>
                </PaymentCard>
              ))}
            </Section>
          )}

          {/* Gagal / Kadaluarsa */}
          {otherPayments.length > 0 && (
            <Section title="Transaksi Lainnya" count={otherPayments.length}>
              {otherPayments.map(p => <PaymentCard key={p.orderId} payment={p} />)}
            </Section>
          )}
        </div>
      )}

      {/* Ringkasan */}
      {!loading && payments.length > 0 && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-5">
          <h3 className="font-bold text-gray-700 text-sm mb-4">Ringkasan</h3>
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard
              label="Total Transaksi"
              value={payments.length.toString()}
              color="text-gray-800"
            />
            <SummaryCard
              label="Berhasil"
              value={paidPayments.length.toString()}
              color="text-green-600"
            />
            <SummaryCard
              label="Total Dibayar"
              value={`Rp ${paidPayments.reduce((s, p) => s + p.amount, 0).toLocaleString("id-ID")}`}
              color="text-indigo-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-700 text-sm">{title}</h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

function PaymentCard({ payment, children }: { payment: Payment; children?: React.ReactNode }) {
  const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.expired;

  return (
    <div className="px-5 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon plan */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            payment.plan === "business" ? "bg-purple-50" : "bg-indigo-50"
          }`}>
            <Crown size={18} className={payment.plan === "business" ? "text-purple-600" : "text-indigo-600"} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-gray-800 text-sm">
                UMKM Grow+ {PLAN_LABEL[payment.plan] ?? payment.plan}
              </p>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {BILLING_LABEL[payment.billingCycle] ?? payment.billingCycle}
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">{payment.orderId}</p>

            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {/* Status badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                {cfg.icon} {cfg.label}
              </span>

              {/* Tanggal */}
              <span className="text-[11px] text-gray-400">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                  : new Date(payment.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                }
              </span>
            </div>

            {children && <div className="mt-2">{children}</div>}
          </div>
        </div>

        {/* Nominal */}
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-sm ${payment.status === "paid" ? "text-gray-800" : "text-gray-400"}`}>
            Rp {payment.amount.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
      <p className={`font-bold text-base ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
