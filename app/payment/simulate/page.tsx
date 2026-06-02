"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle, Loader2, Lock, Shield, Copy, CheckCheck,
  ArrowLeft, Crown, Check, CreditCard, QrCode,
} from "lucide-react";

const API_URL = "/api";
const PLAN_LABEL: Record<string, string> = { pro: "Pro", business: "Bisnis" };
const BILLING_LABEL: Record<string, string> = { monthly: "Bulanan", yearly: "Tahunan" };

// ─── Data Metode Pembayaran ───────────────────────────────────────────────────

type MethodId = "gopay" | "ovo" | "dana" | "qris" | "bca" | "bni" | "bri" | "mandiri" | "card";
type MethodGroup = "E-Wallet" | "QRIS" | "Transfer Bank" | "Kartu Kredit";

interface Method {
  id:    MethodId;
  label: string;
  group: MethodGroup;
  icon:  React.ReactNode;
  color: string;
  badge?: string;
}

const METHODS: Method[] = [
  { id: "gopay",   label: "GoPay",                   group: "E-Wallet",      icon: <span className="font-black text-green-600 text-base">G</span>,   color: "border-green-300",  badge: "Populer" },
  { id: "ovo",     label: "OVO",                     group: "E-Wallet",      icon: <span className="font-black text-purple-600 text-base">O</span>,  color: "border-purple-300" },
  { id: "dana",    label: "DANA",                    group: "E-Wallet",      icon: <span className="font-black text-blue-500 text-base">D</span>,    color: "border-blue-300" },
  { id: "qris",    label: "QRIS",                    group: "QRIS",          icon: <QrCode size={18} className="text-gray-700" />,                   color: "border-gray-300" },
  { id: "bca",     label: "BCA Virtual Account",     group: "Transfer Bank", icon: <span className="font-black text-blue-700 text-xs">BCA</span>,    color: "border-blue-400" },
  { id: "bni",     label: "BNI Virtual Account",     group: "Transfer Bank", icon: <span className="font-black text-orange-600 text-xs">BNI</span>,  color: "border-orange-300" },
  { id: "bri",     label: "BRI Virtual Account",     group: "Transfer Bank", icon: <span className="font-black text-blue-800 text-xs">BRI</span>,    color: "border-blue-600" },
  { id: "mandiri", label: "Mandiri Virtual Account", group: "Transfer Bank", icon: <span className="font-black text-yellow-600 text-xs">MDR</span>,  color: "border-yellow-400" },
  { id: "card",    label: "Kartu Kredit / Debit",    group: "Kartu Kredit",  icon: <CreditCard size={18} className="text-indigo-600" />,             color: "border-indigo-300" },
];

const GROUPS: MethodGroup[] = ["E-Wallet", "QRIS", "Transfer Bank", "Kartu Kredit"];

// Nomor VA simulasi per bank
const VA_NUMBERS: Record<string, string> = {
  bca:     "1234567890123",
  bni:     "9876543210987",
  bri:     "1111222233334",
  mandiri: "8888999900001",
};

// ─── Komponen Copy ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
      {copied ? <CheckCheck size={15} className="text-green-500" /> : <Copy size={15} className="text-gray-400" />}
    </button>
  );
}

// ─── QR Code SVG sederhana (simulasi) ────────────────────────────────────────

function FakeQR({ value }: { value: string }) {
  // Generate pola QR sederhana dari hash string
  const hash = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const row = Math.floor(i / 21), col = i % 21;
    // Finder patterns (pojok)
    const inFinder =
      (row < 8 && col < 8) || (row < 8 && col > 12) || (row > 12 && col < 8);
    if (inFinder) return (row === 0 || row === 6 || row === 7 || col === 0 || col === 6 || col === 7) ? 1 : 0;
    return ((hash * (i + 1) * 31) % 7 < 3) ? 1 : 0;
  });

  return (
    <div className="inline-block p-3 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
      <svg width="168" height="168" viewBox="0 0 21 21">
        {cells.map((v, i) => v ? (
          <rect
            key={i}
            x={i % 21} y={Math.floor(i / 21)}
            width={1} height={1}
            fill="#1e1b4b"
          />
        ) : null)}
      </svg>
    </div>
  );
}

// ─── Instruksi per metode ─────────────────────────────────────────────────────

function PaymentInstructions({
  method, amount, orderId, onPay, loading,
}: {
  method: Method; amount: number; orderId: string; onPay: () => void; loading: boolean;
}) {
  const isEwallet = method.group === "E-Wallet";
  const isQris    = method.id === "qris";
  const isVA      = method.group === "Transfer Bank";
  const isCard    = method.group === "Kartu Kredit";
  const vaNumber  = VA_NUMBERS[method.id] ?? "0000000000000";

  return (
    <div className="space-y-4">
      {/* ── E-Wallet: QR + deep link ── */}
      {(isEwallet || isQris) && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 text-center">
          <p className="font-bold text-gray-800 mb-1">Scan QR Code</p>
          <p className="text-xs text-gray-500 mb-4">
            Buka aplikasi {method.label} → Scan QR di bawah ini
          </p>
          <div className="flex justify-center mb-4">
            <FakeQR value={`${orderId}-${method.id}-${amount}`} />
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100 mt-3">
            <span className="text-xs text-gray-500">Kode:</span>
            <span className="font-mono text-sm font-bold text-gray-800">{orderId.slice(-8).toUpperCase()}</span>
            <CopyButton text={orderId.slice(-8).toUpperCase()} />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Total: <span className="font-bold text-gray-700">Rp {amount.toLocaleString("id-ID")}</span>
          </p>
        </div>
      )}

      {/* ── Transfer Bank: Nomor VA ── */}
      {isVA && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6">
          <p className="font-bold text-gray-800 mb-4">Nomor Virtual Account</p>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-4">
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider mb-1">{method.label}</p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold text-indigo-700 tracking-widest">{vaNumber}</span>
              <CopyButton text={vaNumber} />
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-700">Cara Transfer:</p>
            {[
              `Buka aplikasi m-Banking atau ATM ${method.label.replace(" Virtual Account", "")}`,
              "Pilih menu Transfer → Virtual Account",
              `Masukkan nomor VA: ${vaNumber}`,
              `Konfirmasi nominal Rp ${amount.toLocaleString("id-ID")}`,
              "Selesaikan transaksi",
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-xs">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
            <p className="text-xs text-yellow-700">
              ⏱ Batas waktu pembayaran: <span className="font-bold">24 jam</span>
            </p>
          </div>
        </div>
      )}

      {/* ── Kartu Kredit: Form ── */}
      {isCard && (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6">
          <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-indigo-600" />
            Detail Kartu
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Kartu</label>
              <div className="flex items-center gap-2 bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 mt-1.5">
                <input
                  type="text"
                  placeholder="4811 1111 1111 1114"
                  maxLength={19}
                  className="flex-1 bg-transparent text-sm font-mono outline-none text-gray-700"
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                    e.target.value = v.replace(/(.{4})/g, "$1 ").trim();
                  }}
                />
                <CreditCard size={16} className="text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expired</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all mt-1.5"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={3}
                  className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all mt-1.5"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama di Kartu</label>
              <input
                type="text"
                placeholder="RAKA PUTRA"
                className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all mt-1.5"
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            Test: gunakan kartu <span className="font-mono font-bold">4811 1111 1111 1114</span>, CVV <span className="font-mono font-bold">123</span>
          </p>
        </div>
      )}

      {/* Tombol Bayar */}
      <button
        onClick={onPay}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
      >
        {loading
          ? <><Loader2 size={20} className="animate-spin" /> Memproses...</>
          : <><Lock size={18} /> Konfirmasi Pembayaran — Rp {amount.toLocaleString("id-ID")}</>
        }
      </button>
    </div>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────

function SimulateContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const orderId = searchParams.get("order_id") ?? "";
  const plan    = searchParams.get("plan")     ?? "pro";
  const billing = searchParams.get("billing")  ?? "monthly";
  const amount  = Number(searchParams.get("amount") ?? 99000);

  const [selected, setSelected] = useState<MethodId | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [step,     setStep]     = useState<"select" | "pay" | "processing" | "done">("select");

  const method = METHODS.find(m => m.id === selected);

  const handleConfirmPay = async () => {
    if (!selected) return;
    setLoading(true);
    setStep("processing");

    await new Promise(r => setTimeout(r, 2000));

    try {
      await fetch(`/api/payment/simulate/${orderId}/success`, { method: "POST" });
    } catch { /* silent */ }

    setStep("done");
    setLoading(false);

    setTimeout(() => router.push(`/payment/success?order_id=${orderId}`), 1500);
  };

  // ── Step: Pilih Metode ────────────────────────────────────────────────────

  if (step === "select") {
    return (
      <div className="max-w-lg mx-auto pt-4 pb-20 space-y-4">

        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[24px] p-5 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown size={18} className="text-yellow-300" />
            </div>
            <div>
              <p className="font-bold">Pembayaran Premium</p>
              <p className="text-indigo-200 text-xs">UMKM Grow+ {PLAN_LABEL[plan]} · {BILLING_LABEL[billing]}</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
            <span className="text-indigo-200 text-sm">Total Pembayaran</span>
            <span className="font-bold text-xl">Rp {amount.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Pilih Metode */}
        <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="font-bold text-gray-800">Pilih Metode Pembayaran</p>
          </div>

          {GROUPS.map(group => (
            <div key={group}>
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group}</p>
              </div>
              <div className="p-3 space-y-1.5">
                {METHODS.filter(m => m.group === group).map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left
                      ${selected === m.id
                        ? "border-indigo-500 bg-indigo-50 shadow-sm"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    {/* Radio */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${selected === m.id ? "border-indigo-600" : "border-gray-300"}`}>
                      {selected === m.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                    </div>
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border
                      ${selected === m.id ? "bg-white border-indigo-100 shadow-sm" : "bg-gray-50 border-gray-100"}`}>
                      {m.icon}
                    </div>
                    {/* Label */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${selected === m.id ? "text-indigo-700" : "text-gray-700"}`}>
                          {m.label}
                        </span>
                        {m.badge && (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full uppercase">
                            {m.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    {selected === m.id && <Check size={16} className="text-indigo-600 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => selected && setStep("pay")}
          disabled={!selected}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Lock size={18} />
          Lanjutkan dengan {method?.label ?? "Metode Terpilih"}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield size={12} />
          <span>Transaksi aman & terenkripsi</span>
        </div>
      </div>
    );
  }

  // ── Step: Instruksi Bayar ─────────────────────────────────────────────────

  if (step === "pay" && method) {
    return (
      <div className="max-w-lg mx-auto pt-4 pb-20 space-y-4">

        {/* Header ringkas */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("select")}
            className="p-2 hover:bg-white rounded-full border border-gray-200 shadow-sm transition-all"
          >
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 bg-white ${method.color}`}>
            {method.icon}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">{method.label}</p>
            <p className="text-xs text-gray-500">Rp {amount.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Ringkasan order */}
        <div className="bg-white rounded-[20px] border border-gray-100 p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Paket</p>
            <p className="font-bold text-gray-800 text-sm">UMKM Grow+ {PLAN_LABEL[plan]} · {BILLING_LABEL[billing]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-bold text-indigo-600">Rp {amount.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Instruksi sesuai metode */}
        <PaymentInstructions
          method={method}
          amount={amount}
          orderId={orderId}
          onPay={handleConfirmPay}
          loading={loading}
        />

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield size={12} />
          <span>Transaksi aman & terenkripsi</span>
        </div>
      </div>
    );
  }

  // ── Step: Processing ──────────────────────────────────────────────────────

  if (step === "processing") {
    return (
      <div className="max-w-lg mx-auto pt-20 pb-20 text-center space-y-5">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <Loader2 size={36} className="text-indigo-600 animate-spin" />
        </div>
        <p className="font-bold text-gray-800 text-lg">Memverifikasi Pembayaran...</p>
        <p className="text-gray-500 text-sm">Mohon tunggu sebentar</p>
      </div>
    );
  }

  // ── Step: Done ────────────────────────────────────────────────────────────

  return (
    <div className="max-w-lg mx-auto pt-20 pb-20 text-center space-y-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <p className="font-bold text-gray-800 text-xl">Pembayaran Berhasil! 🎉</p>
      <p className="text-gray-500 text-sm">Akun kamu sedang diupgrade ke Premium...</p>
      <Loader2 size={20} className="animate-spin text-indigo-400 mx-auto" />
    </div>
  );
}

export default function SimulatePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    }>
      <SimulateContent />
    </Suspense>
  );
}
