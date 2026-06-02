"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, ArrowLeft, ChevronRight, Building2, DollarSign } from "lucide-react";
import Link from "next/link";
import { useKonten } from "@/context/KontenContext";

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-blue-50 text-blue-600",
  "Full Time": "bg-blue-50 text-blue-600",
  "Part-time": "bg-purple-50 text-purple-600",
  "Part Time": "bg-purple-50 text-purple-600",
  "Freelance": "bg-teal-50 text-teal-600",
};

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600", "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-600",     "bg-teal-100 text-teal-600",
  "bg-indigo-100 text-indigo-600", "bg-violet-100 text-violet-600",
];

export default function LowonganPage() {
  const { lowongan } = useKonten();
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  // Hanya tampilkan yang aktif
  const active = lowongan.filter((j) => j.status === "active");
  useEffect(() => {
    // intentionally empty — data loaded from KontenContext
  }, [lowongan.length, active.length]);

  const filtered = active.filter((job) => {
    const matchFilter = filter === "Semua" || job.type === filter;
    const matchSearch =
      search === "" ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
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
              <Briefcase size={22} className="text-indigo-600" /> Lowongan Kerja
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Temukan peluang kerja untuk usahamu</p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari posisi atau perusahaan..."
            className="pl-11 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all text-sm shadow-sm" />
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["Semua", "Full-time", "Part-time", "Freelance"].map((type) => (
          <button key={type} onClick={() => setFilter(type)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
              filter === type
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
            }`}>
            {type}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 whitespace-nowrap shrink-0">{filtered.length} lowongan</span>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Tidak ada lowongan ditemukan</p>
            <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : filtered.map((job, i) => {
          const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];
          const initials = job.company.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
          return (
            <div key={job.id} className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-lg hover:border-indigo-100 transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${colorClass}`}>
                    {initials}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-black text-gray-800 text-base group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Building2 size={13} className="text-gray-400" /> {job.company}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MapPin size={11} className="text-indigo-400" /> {job.location}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[job.type] ?? "bg-gray-100 text-gray-600"}`}>
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        <DollarSign size={10} /> {job.salary}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/lowongan/${job.id}`} className="sm:shrink-0 w-full sm:w-auto">
                  <button className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    Lamar Sekarang <ChevronRight size={15} />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
