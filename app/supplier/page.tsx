"use client";

import { useState } from "react";
import { Search, MapPin, Star, Package, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useKonten } from "@/context/KontenContext";

const PRICE_COLORS: Record<string, string> = {
  Termurah: "bg-green-100 text-green-700",
  Bersaing: "bg-blue-100 text-blue-700",
  Grosir:   "bg-teal-100 text-teal-700",
  Premium:  "bg-purple-100 text-purple-700",
};

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  "Bahan Pangan": { bg: "bg-orange-100", text: "text-orange-600" },
  "Sayur & Buah": { bg: "bg-green-100",  text: "text-green-600"  },
  "Kemasan":      { bg: "bg-blue-100",   text: "text-blue-600"   },
  "Fashion":      { bg: "bg-pink-100",   text: "text-pink-600"   },
  "Elektronik":   { bg: "bg-purple-100", text: "text-purple-600" },
  "Tekstil":      { bg: "bg-rose-100",   text: "text-rose-600"   },
  "Peralatan":    { bg: "bg-teal-100",   text: "text-teal-600"   },
};
const DEFAULT_COLOR = { bg: "bg-indigo-100", text: "text-indigo-600" };

export default function SupplierPage() {
  const { supplier } = useKonten();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");

  // Hanya tampilkan yang aktif
  const active = supplier.filter((s) => s.status === "active");
  const categories = ["Semua", ...Array.from(new Set(active.map((s) => s.category)))];

  const filtered = active.filter((s) => {
    const matchCat    = activeCategory === "Semua" || s.category === activeCategory;
    const matchSearch = search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft size={18} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <Package size={22} className="text-indigo-600" /> Cari Supplier
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Temukan supplier terpercaya untuk usahamu</p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari bahan baku atau supplier..."
            className="pl-11 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm shadow-sm" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Supplier tidak ditemukan</p>
            <p className="text-sm mt-1">Coba ubah kategori atau kata kunci</p>
          </div>
        ) : filtered.map((s) => {
          const col = CAT_COLORS[s.category] ?? DEFAULT_COLOR;
          return (
            <div key={s.id} className="group bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${col.bg} rounded-2xl flex items-center justify-center`}>
                  <Package size={22} className={col.text} />
                </div>
                {s.rating > 0 && (
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={13} fill="currentColor" />
                    <span>{s.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <h3 className="font-black text-gray-800 text-base leading-tight">{s.name}</h3>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1 mb-3">{s.category}</p>
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  <span>{s.location}</span>
                </div>
                <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${PRICE_COLORS[s.price] ?? "bg-gray-100 text-gray-600"}`}>
                  Harga {s.price}
                </span>
              </div>
              <Link href={`/supplier/${s.id}`}>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                  <Phone size={15} /> Hubungi Supplier
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
