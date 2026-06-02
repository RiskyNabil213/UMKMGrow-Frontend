"use client";

import { useState, useEffect } from "react";
import { Calculator, Wallet, TrendingUp, ArrowLeft, RefreshCw, Info, Save, Lightbulb, CheckCircle } from "lucide-react";
import Link from "next/link";

const TIPS = [
  "Idealnya laba bersih minimal 20% dari total penjualan.",
  "Catat semua pengeluaran kecil — biasanya menjadi bocoran terbesar.",
  "Gunakan fitur AI Chat untuk strategi penghematan biaya operasional.",
];

export default function KalkulatorPage() {
  const [penjualan,   setPenjualan]   = useState<number>(0);
  const [modalBahan,  setModalBahan]  = useState<number>(0);
  const [operasional, setOperasional] = useState<number>(0);
  const [biayaLain,   setBiayaLain]   = useState<number>(0);

  const [labaKotor,        setLabaKotor]        = useState<number>(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState<number>(0);
  const [labaBersih,       setLabaBersih]       = useState<number>(0);
  const [marginPersen,     setMarginPersen]     = useState<number>(0);

  useEffect(() => {
    const pengeluaran = modalBahan + operasional + biayaLain;
    const kotor  = penjualan - modalBahan;
    const bersih = penjualan - pengeluaran;
    const margin = penjualan > 0 ? Math.round((bersih / penjualan) * 100) : 0;
    setTotalPengeluaran(pengeluaran);
    setLabaKotor(kotor);
    setLabaBersih(bersih);
    setMarginPersen(margin);
  }, [penjualan, modalBahan, operasional, biayaLain]);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

  const handleReset = () => { setPenjualan(0); setModalBahan(0); setOperasional(0); setBiayaLain(0); };

  const isProfit      = labaBersih >= 0;
  const clampedMargin = Math.min(Math.max(marginPersen, 0), 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className="w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Calculator size={22} className="text-indigo-600" /> Kalkulator Keuangan
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Hitung keuntungan usahamu dengan akurat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Input Section ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Wallet size={18} className="text-indigo-600" /> Data Penjualan &amp; Biaya
              </h3>
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors font-semibold">
                <RefreshCw size={13} /> Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-800">
              <InputField label="Total Penjualan / Bulan" value={penjualan} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPenjualan(Number(e.target.value))} placeholder="12.000.000" accent="indigo" />
              <InputField label="Biaya Bahan Baku"        value={modalBahan}  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModalBahan(Number(e.target.value))}  placeholder="3.000.000"  accent="blue"   />
              <InputField label="Biaya Operasional"       value={operasional} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOperasional(Number(e.target.value))} placeholder="1.500.000"  accent="purple" />
              <InputField label="Biaya Lain-lain"         value={biayaLain}   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBiayaLain(Number(e.target.value))}   placeholder="500.000"    accent="teal"   />
            </div>

            {/* Margin Progress Bar */}
            {penjualan > 0 && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">Margin Laba</span>
                  <span className={`font-black text-base ${isProfit ? "text-green-600" : "text-red-500"}`}>{marginPersen}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isProfit ? (marginPersen >= 20 ? "bg-green-500" : "bg-yellow-400") : "bg-red-400"}`}
                    style={{ width: `${clampedMargin}%` }} />
                </div>
                <p className="text-[11px] text-gray-400">
                  {isProfit
                    ? marginPersen >= 20 ? "Margin sehat! Bisnis kamu berjalan dengan baik." : "Margin masih rendah. Coba kurangi biaya operasional."
                    : "Bisnis merugi. Tinjau kembali struktur biaya kamu."}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-3 rounded-2xl text-xs text-amber-700 font-medium">
              <Info size={14} className="shrink-0" />
              Data tidak akan disimpan sebelum kamu menekan tombol "Simpan"
            </div>
          </div>
        </div>

        {/* ── Result Panel ── */}
        <div className="space-y-4">
          <div className={`rounded-3xl p-7 text-white shadow-xl space-y-5 ${isProfit ? "bg-gradient-to-br from-indigo-600 to-purple-700 shadow-indigo-200" : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-200"}`}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <TrendingUp size={18} /> Hasil Analisis
            </h3>
            <div className="space-y-3">
              <ResultRow label="Total Penjualan"   value={formatRupiah(penjualan)} />
              <ResultRow label="Laba Kotor"         value={formatRupiah(labaKotor)} />
              <ResultRow label="Total Pengeluaran"  value={formatRupiah(totalPengeluaran)} />
            </div>
            <div className="pt-4 border-t border-white/20">
              <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold mb-1">Laba Bersih</p>
              <h2 className="text-3xl font-black">{formatRupiah(labaBersih)}</h2>
              <p className="text-white/60 text-xs mt-1">{isProfit ? "Bisnis kamu menguntungkan 🎉" : "Bisnis kamu merugi ⚠️"}</p>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                <Save size={15} /> Simpan
              </button>
              <button onClick={handleReset} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                <RefreshCw size={15} /> Reset
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Lightbulb size={16} /> Tips Keuangan
            </div>
            <div className="space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, accent }: {
  label: string; value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; accent: string;
}) {
  const ringMap: Record<string, string> = {
    indigo: "focus:ring-indigo-200 focus:border-indigo-500",
    blue:   "focus:ring-blue-200 focus:border-blue-500",
    purple: "focus:ring-purple-200 focus:border-purple-500",
    teal:   "focus:ring-teal-200 focus:border-teal-500",
  };
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm select-none">Rp</span>
        <input type="number" value={value === 0 ? "" : value} onChange={onChange} placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 transition-all text-sm ${ringMap[accent] ?? ringMap.indigo}`} />
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/70 text-sm">{label}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
  );
}
