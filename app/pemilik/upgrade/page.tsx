"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  Crown, Check, X, Zap, ArrowLeft, Star, Shield, Sparkles,
  MessageSquare, Calculator, TrendingUp, Users, Briefcase, ChevronRight,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    period: "",
    desc: "Untuk Pemilik Usaha yang baru mulai",
    color: "border-gray-200",
    badge: null,
    buttonStyle: "border border-gray-300 text-gray-600 hover:bg-gray-50",
    features: [
      { text: "5 konsultasi AI per bulan", included: true },
      { text: "Kalkulator keuangan dasar", included: true },
      { text: "Akses lowongan kerja", included: true },
      { text: "Direktori supplier", included: true },
      { text: "Analisis AI mendalam", included: false },
      { text: "Laporan keuangan otomatis", included: false },
      { text: "Promosi AI tanpa batas", included: false },
      { text: "Prioritas dukungan", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99000,
    period: "/bulan",
    desc: "Untuk Pemilik Usaha yang ingin berkembang",
    color: "border-orange-500",
    badge: "Paling Populer",
    buttonStyle: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200",
    features: [
      { text: "Konsultasi AI tak terbatas", included: true },
      { text: "Kalkulator keuangan lengkap", included: true },
      { text: "Akses lowongan kerja", included: true },
      { text: "Direktori supplier premium", included: true },
      { text: "Analisis AI mendalam", included: true },
      { text: "Laporan keuangan otomatis", included: true },
      { text: "Promosi AI tanpa batas", included: true },
      { text: "Prioritas dukungan", included: false },
    ],
  },
  {
    id: "business",
    name: "Bisnis",
    price: 249000,
    period: "/bulan",
    desc: "Untuk Pemilik Usaha skala menengah",
    color: "border-amber-500",
    badge: "Terlengkap",
    buttonStyle: "bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:opacity-90 shadow-lg shadow-amber-200",
    features: [
      { text: "Konsultasi AI tak terbatas", included: true },
      { text: "Kalkulator keuangan lengkap", included: true },
      { text: "Akses lowongan kerja", included: true },
      { text: "Direktori supplier premium", included: true },
      { text: "Analisis AI mendalam", included: true },
      { text: "Laporan keuangan otomatis", included: true },
      { text: "Promosi AI tanpa batas", included: true },
      { text: "Prioritas dukungan 24/7", included: true },
    ],
  },
];

const perks = [
  { icon: Sparkles, title: "AI Tanpa Batas", desc: "Konsultasi bisnis kapan saja tanpa batasan kuota harian", color: "bg-orange-50 text-orange-600" },
  { icon: TrendingUp, title: "Laporan Otomatis", desc: "Laporan keuangan dan analisis tren bisnis mingguan", color: "bg-green-50 text-green-600" },
  { icon: Shield, title: "Data Aman", desc: "Enkripsi end-to-end untuk semua data bisnis kamu", color: "bg-blue-50 text-blue-600" },
  { icon: Users, title: "Komunitas Eksklusif", desc: "Akses grup Pemilik Usaha premium dan sesi mentoring bulanan", color: "bg-amber-50 text-amber-600" },
  { icon: Briefcase, title: "Supplier Prioritas", desc: "Koneksi langsung ke supplier terpercaya dengan harga khusus", color: "bg-teal-50 text-teal-600" },
  { icon: MessageSquare, title: "Dukungan Prioritas", desc: "Tim support siap membantu dalam waktu kurang dari 1 jam", color: "bg-pink-50 text-pink-600" },
];

const testimonials = [
  { name: "Siti Rahayu", business: "Warung Makan Siti", avatar: "SR", text: "Sejak pakai Pro, omzet naik 40% dalam 3 bulan. Fitur analisis AI-nya beneran membantu!", rating: 5 },
  { name: "Budi Santoso", business: "Toko Elektronik Budi", avatar: "BS", text: "Laporan keuangan otomatis menghemat waktu saya 5 jam per minggu. Worth it banget!", rating: 5 },
  { name: "Dewi Lestari", business: "Butik Dewi", avatar: "DL", text: "Promosi AI-nya keren, caption Instagram saya jadi lebih menarik dan engagement naik 3x.", rating: 5 },
];

export default function PemilikUpgradePage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selected, setSelected] = useState("pro");
  const router = useRouter();
  const { isPremium, plan: activePlan, authLoading } = useUser();

  const planLabel = activePlan === "business" ? "Bisnis" : activePlan === "pro" ? "Pro" : "";

  // Kalau sudah premium, tampilkan banner status aktif
  if (!authLoading && isPremium) {
    return (
      <div className="max-w-2xl mx-auto pt-10 pb-20 space-y-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Crown size={36} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Kamu sudah Premium {planLabel}! ✨
          </h1>
          <p className="text-gray-500 text-sm">Semua fitur eksklusif sudah aktif di akun kamu.</p>
        </div>
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 text-left space-y-3">
          {[
            "Konsultasi AI tak terbatas",
            "Kalkulator keuangan lengkap",
            "Analisis AI mendalam",
            "Laporan keuangan otomatis",
            "Promosi AI tanpa batas",
            ...(activePlan === "business" ? ["Direktori supplier premium", "Prioritas dukungan 24/7"] : []),
          ].map(f => (
            <div key={f} className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-green-600" strokeWidth={3} />
              </div>
              {f}
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/pemilik">
            <button className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all">
              Kembali ke Beranda
            </button>
          </Link>
          <Link href="/payment/history">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
              Riwayat Pembayaran
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getPrice = (price: number) => {
    if (billing === "yearly") return Math.round(price * 10);
    return price;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/pemilik/profil" className="p-2 hover:bg-white rounded-full border border-gray-200 transition-all shadow-sm">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upgrade Akun</h1>
          <p className="text-sm text-gray-500 mt-0.5">Pilih paket yang sesuai dengan kebutuhan usaha kamu</p>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-[32px] p-8 md:p-12 text-center">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Crown size={32} className="text-yellow-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Wujudkan Usaha Impianmu
          </h2>
          <p className="text-orange-100 max-w-lg mx-auto text-base">
            Bergabung dengan 10.000+ Pemilik Usaha yang sudah berkembang bersama UMKM Grow+ Premium
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center bg-white/10 rounded-2xl p-1 gap-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${billing === "monthly" ? "bg-white text-orange-600 shadow-sm" : "text-white/80 hover:text-white"}`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${billing === "yearly" ? "bg-white text-orange-600 shadow-sm" : "text-white/80 hover:text-white"}`}
            >
              Tahunan
              <span className="bg-green-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-17%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`relative bg-white rounded-[28px] border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
              selected === plan.id ? plan.color + " shadow-lg" : "border-gray-100"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full text-white ${
                  plan.id === "pro" ? "bg-orange-600" : "bg-gradient-to-r from-orange-600 to-amber-500"
                }`}>
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-bold text-gray-800 text-lg">{plan.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{plan.desc}</p>
            </div>

            <div className="mb-6">
              {plan.price === 0 ? (
                <p className="text-3xl font-bold text-gray-800">Gratis</p>
              ) : (
                <div className="flex items-end gap-1">
                  <p className="text-3xl font-bold text-gray-800">
                    Rp {getPrice(plan.price).toLocaleString("id-ID")}
                  </p>
                  <p className="text-gray-400 text-sm mb-1">{billing === "yearly" ? "/tahun" : plan.period}</p>
                </div>
              )}
              {billing === "yearly" && plan.price > 0 && (
                <p className="text-xs text-green-600 font-semibold mt-1">
                  Hemat Rp {(plan.price * 2).toLocaleString("id-ID")} per tahun
                </p>
              )}
            </div>

            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  {f.included ? (
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-green-600" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <X size={12} className="text-gray-400" strokeWidth={3} />
                    </div>
                  )}
                  <span className={f.included ? "text-gray-700" : "text-gray-400"}>{f.text}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.buttonStyle} ${
                plan.price === 0 ? "cursor-default" : "hover:scale-[1.02]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (plan.price > 0) {
                  router.push(`/payment/checkout?plan=${plan.id}&billing=${billing}`);
                }
              }}
            >
              {plan.price === 0 ? "Paket Saat Ini" : `Pilih ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Perks */}
      <div>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Kenapa Upgrade?</h3>
          <p className="text-sm text-gray-500 mt-1">Fitur-fitur eksklusif yang akan mengakselerasi usaha kamu</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {perks.map((perk) => (
            <div key={perk.title} className="bg-white rounded-[24px] border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className={`w-11 h-11 ${perk.color} rounded-2xl flex items-center justify-center mb-3`}>
                <perk.icon size={20} />
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">{perk.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Kata Mereka</h3>
          <p className="text-sm text-gray-500 mt-1">Pemilik Usaha yang sudah merasakan manfaatnya</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-[24px] border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{t.name}</p>
                  <p className="text-[10px] text-gray-400">{t.business}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-gradient-to-br from-orange-600 to-amber-500 rounded-[28px] p-8 text-center">
        <Zap size={32} className="text-yellow-300 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Mulai 7 Hari Gratis</h3>
        <p className="text-orange-100 text-sm mb-6 max-w-sm mx-auto">
          Coba semua fitur Premium tanpa biaya. Batalkan kapan saja, tanpa syarat.
        </p>
        <button
          onClick={() => router.push(`/payment/checkout?plan=pro&billing=monthly`)}
          className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2">
          Coba Gratis Sekarang <ChevronRight size={16} />
        </button>
        <p className="text-orange-200 text-xs mt-3">Tidak perlu kartu kredit</p>
      </div>

    </div>
  );
}
