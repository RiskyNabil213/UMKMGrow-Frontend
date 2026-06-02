"use client";

import { useState } from "react";
import {
  Sparkles, Share2, Copy, Check, ArrowLeft,
  Camera, MessageCircle, Lightbulb, Zap,
} from "lucide-react";
import Link from "next/link";
import { generateCaption } from "@/lib/ai-engine";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Camera, color: "text-pink-600", bg: "bg-pink-50", activeBg: "bg-pink-600" },
  { id: "tiktok", label: "TikTok", icon: Zap, color: "text-gray-800", bg: "bg-gray-100", activeBg: "bg-gray-800" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-600", bg: "bg-green-50", activeBg: "bg-green-600" },
];

const TIPS = [
  "Tambahkan emoji yang relevan agar caption lebih menarik perhatian.",
  "Gunakan 3–5 hashtag spesifik daripada banyak hashtag umum.",
  "Posting di jam aktif: 07.00–09.00 dan 19.00–21.00 WIB.",
  "Sertakan call-to-action yang jelas seperti 'DM sekarang' atau 'Klik link bio'.",
];

export default function PromosiPage() {
  const [deskripsi, setDeskripsi] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const generateCaptionHandler = () => {
    if (!deskripsi.trim()) return;
    setLoading(true);
    setCaption("");
    setTimeout(() => {
      setCaption(generateCaption(deskripsi, selectedPlatforms));
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Sparkles size={22} className="text-indigo-600" />
            Promosi AI Otomatis
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Generate caption &amp; hashtag untuk media sosialmu dalam hitungan detik
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
        {/* Deskripsi */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Apa yang ingin kamu promosikan?
          </label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Contoh: Kopi susu gula aren harga 15rb, lagi ada promo beli 2 gratis 1. Cocok untuk anak muda yang suka kopi manis."
            rows={4}
            className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all resize-none"
          />
          <p className="text-[11px] text-gray-400 text-right">{deskripsi.length} karakter</p>
        </div>

        {/* Platform Toggle */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">Pilih Platform</label>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map((p) => {
              const active = selectedPlatforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold border transition-all ${
                    active
                      ? `${p.activeBg} text-white border-transparent shadow-md`
                      : `bg-white ${p.color} border-gray-200 hover:border-current`
                  }`}
                >
                  <p.icon size={15} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={generateCaptionHandler}
          disabled={loading || !deskripsi.trim()}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              AI sedang merangkai kata...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Caption &amp; Hashtag
            </>
          )}
        </button>
      </div>

      {/* Result Card */}
      {caption && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Sparkles size={16} />
              Draft Konten Siap Pakai
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
              }`}
            >
              {copied ? (
                <>
                  <Check size={13} />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Salin
                </>
              )}
            </button>
          </div>

          {/* Caption Box */}
          <div className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-sm">
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{caption}</p>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.filter((p) => selectedPlatforms.includes(p.id)).map((p) => (
              <button
                key={p.id}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all ${p.bg} ${p.color} border-transparent hover:opacity-80`}
              >
                <p.icon size={15} />
                Share ke {p.label}
              </button>
            ))}
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all">
              <Share2 size={15} />
              Bagikan
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
          <Lightbulb size={16} />
          Tips Penggunaan
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
