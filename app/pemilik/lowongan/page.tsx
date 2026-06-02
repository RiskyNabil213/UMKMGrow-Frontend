"use client";

import { useState, useMemo } from "react";
import {
  Briefcase, Plus, Search, MapPin, Building2, Tag,
  DollarSign, Pencil, Trash2, X, Save,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { useKonten } from "@/context/KontenContext";

type Status = "active" | "inactive";

const TYPES = ["Full-time", "Part-time", "Freelance"];
const INPUT = "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
const empty = { title: "", company: "", location: "", type: "Full-time", salary: "" };

export default function PemilikLowonganPage() {
  const { user } = useAuth();
  const { lowongan, addLowongan, updateLowongan, deleteLowongan } = useKonten();

  const defaultCompany = user?.businessName || user?.name || "Toko Saya";

  // Hanya tampilkan lowongan milik perusahaan sendiri
  const myJobs = useMemo(() => {
    const key = defaultCompany.trim().toLowerCase();
    return lowongan.filter((j) => j.company.trim().toLowerCase() === key);
  }, [lowongan, defaultCompany]);

  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState<number | null>(null);
  const [form,     setForm]     = useState({ ...empty, company: defaultCompany });
  const [formErr,  setFormErr]  = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = myJobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditId(null);
    setForm({ ...empty, company: defaultCompany });
    setFormErr("");
    setModal(true);
  }

  function openEdit(j: typeof myJobs[0]) {
    setEditId(j.id);
    setForm({ title: j.title, company: j.company, location: j.location, type: j.type, salary: j.salary });
    setFormErr("");
    setModal(true);
  }

  function toggleStatus(id: number) {
    const item = myJobs.find((j) => j.id === id);
    if (!item) return;
    const next: Status = item.status === "active" ? "inactive" : "active";
    updateLowongan(id, { status: next });
  }

  function handleSave() {
    if (!form.title.trim() || !form.company.trim() || !form.location.trim() || !form.salary.trim()) {
      setFormErr("Semua field wajib diisi.");
      return;
    }
    if (editId === null) {
      addLowongan({ ...form, status: "active" });
    } else {
      updateLowongan(editId, form);
    }
    setModal(false);
  }

  function doDelete() {
    if (deleteId === null) return;
    deleteLowongan(deleteId);
    setDeleteId(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Briefcase size={22} className="text-orange-500" /> Lowongan Saya
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Kelola lowongan yang kamu buat</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
          <Plus size={16} /> Buat Lowongan
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Lowongan",  value: myJobs.length,                                        color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Aktif",           value: myJobs.filter((j) => j.status === "active").length,   color: "text-green-600",  bg: "bg-green-50"  },
          { label: "Nonaktif",        value: myJobs.filter((j) => j.status === "inactive").length, color: "text-gray-500",   bg: "bg-gray-50"   },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border border-gray-100 rounded-2xl p-5`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lowongan..."
          className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Belum ada lowongan</p>
            <button onClick={openAdd} className="mt-3 text-orange-500 font-semibold text-sm hover:underline">
              + Buat lowongan pertama
            </button>
          </div>
        ) : filtered.map((j) => (
          <div key={j.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
              <Briefcase size={18} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-gray-800">{j.title}</p>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${j.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {j.status === "active" ? "Aktif" : "Nonaktif"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-gray-400"><Building2 size={10} /> {j.company}</span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400"><MapPin size={10} /> {j.location}</span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400"><Tag size={10} /> {j.type}</span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400"><DollarSign size={10} /> {j.salary}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(j)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-orange-50 transition-colors">
                <Pencil size={14} className="text-orange-500" />
              </button>
              <button onClick={() => toggleStatus(j.id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-yellow-50 transition-colors">
                {j.status === "active" ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} className="text-gray-400" />}
              </button>
              <button onClick={() => setDeleteId(j.id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-black text-gray-800 text-lg">{editId ? "Edit" : "Buat"} Lowongan</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editId ? "Ubah detail lowongan" : "Isi detail lowongan baru"}</p>
              </div>
              <button onClick={() => setModal(false)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><label className={LABEL}>Nama Posisi *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Kasir, Admin, Driver..." className={INPUT} /></div>
              <div><label className={LABEL}>Nama Usaha / Perusahaan *</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Nama toko atau usaha" className={INPUT} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={LABEL}>Lokasi *</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Kota / Remote" className={INPUT} /></div>
                <div><label className={LABEL}>Tipe Kerja</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={INPUT + " appearance-none cursor-pointer"}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select></div>
              </div>
              <div><label className={LABEL}>Gaji / Kompensasi *</label>
                <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="Rp 3.000.000 atau Project Based" className={INPUT} /></div>
              {formErr && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{formErr}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(false)} className="flex-1 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">Batal</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                  <Save size={15} /> {editId ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-black text-gray-800 text-lg">Hapus Lowongan?</h3>
              <p className="text-sm text-gray-400 mt-1">Lowongan ini akan dihapus permanen.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all">Batal</button>
              <button onClick={doDelete} className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useAuth } from "@/context/UserContext";
import { useKonten } from "@/context/KontenContext";

type Status = "active" | "inactive";
type Tab = "saya" | "semua";

const TYPES = ["Full-time", "Part-time", "Freelance"];
const INPUT = "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
const empty = { title: "", company: "", location: "", type: "Full-time", salary: "" };

export default function PemilikLowonganPage() {
  const { user } = useAuth();
  const { lowongan, addLowongan, updateLowongan, deleteLowongan } = useKonten();

  const defaultCompany = user?.businessName || user?.name || "Toko Saya";

  // Lowongan milik pemilik ini saja (berdasarkan company name)
  const myJobs = useMemo(() => {
    const key = defaultCompany.trim().toLowerCase();
    return lowongan.filter((j) => j.company.trim().toLowerCase() === key);
  }, [lowongan, defaultCompany]);

  // Semua lowongan dari company lain (read-only)
  const otherJobs = useMemo(() => {
    const key = defaultCompany.trim().toLowerCase();
    return lowongan.filter((j) => j.company.trim().toLowerCase() !== key && j.status === "active");
  }, [lowongan, defaultCompany]);

  const [tab,      setTab]      = useState<Tab>("saya");
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(false);
  const [editId,   setEditId]   = useState<number | null>(null);
  const [form,     setForm]     = useState({ ...empty, company: defaultCompany });
  const [formErr,  setFormErr]  = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredMy = myJobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOther = otherJobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditId(null);
    setForm({ ...empty, company: defaultCompany });
    setFormErr("");
    setModal(true);
  }

  function openEdit(j: typeof myJobs[0]) {
    setEditId(j.id);
    setForm({ title: j.title, company: j.company, location: j.location, type: j.type, salary: j.salary });
    setFormErr("");
    setModal(true);
  }

  function toggleStatus(id: number) {
    const item = myJobs.find((j) => j.id === id);
    if (!item) return;
    const next: Status = item.status === "active" ? "inactive" : "active";
    updateLowongan(id, { status: next });
  }

  function handleSave() {
    if (!form.title.trim() || !form.company.trim() || !form.location.trim() || !form.salary.trim()) {
      setFormErr("Semua field wajib diisi.");
      return;
    }
    if (editId === null) {
      addLowongan({ ...form, status: "active" });
    } else {
      updateLowongan(editId, form);
    }
    setModal(false);
  }

  function doDelete() {
    if (deleteId === null) return;
    deleteLowongan(deleteId);
    setDeleteId(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Briefcase size={22} className="text-orange-500" /> Lowongan Kerja
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Kelola lowonganmu & lihat lowongan lainnya</p>
        </div>
        {tab === "saya" && (
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
            <Plus size={16} /> Buat Lowongan
          </button>
        )}
      </div>

      {/* Tab */}
      <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1 w-fit">
        <button onClick={() => setTab("saya")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            tab === "saya" ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
          }`}>
          <Briefcase size={14} /> Lowongan Saya {myJobs.length > 0 && `(${myJobs.length})`}
        </button>
        <button onClick={() => setTab("semua")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            tab === "semua" ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
          }`}>
          <Eye size={14} /> Lowongan Lainnya {otherJobs.length > 0 && `(${otherJobs.length})`}
        </button>
      </div>

      {/* Stats — hanya di tab Saya */}
      {tab === "saya" && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Lowongan",  value: myJobs.length,                                        color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Aktif",           value: myJobs.filter((j) => j.status === "active").length,   color: "text-green-600",  bg: "bg-green-50"  },
            { label: "Nonaktif",        value: myJobs.filter((j) => j.status === "inactive").length, color: "text-gray-500",   bg: "bg-gray-50"   },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border border-gray-100 rounded-2xl p-5`}>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={tab === "saya" ? "Cari lowongan saya..." : "Cari lowongan dari perusahaan lain..."}
          className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all" />
      </div>

      {/* ── TAB: LOWONGAN SAYA ── */}
      {tab === "saya" && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {filteredMy.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Belum ada lowongan</p>
              <button onClick={openAdd} className="mt-3 text-orange-500 font-semibold text-sm hover:underline">
                + Buat lowongan pertama
              </button>
            </div>
          ) : filteredMy.map((j) => (
            <div key={j.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase size={18} className="text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-gray-800">{j.title}</p>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${j.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {j.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><Building2 size={10} /> {j.company}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><MapPin size={10} /> {j.location}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><Tag size={10} /> {j.type}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><DollarSign size={10} /> {j.salary}</span>
                </div>
              </div>
              {/* Tombol edit/toggle/hapus hanya untuk lowongan milik sendiri */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(j)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-orange-50 transition-colors">
                  <Pencil size={14} className="text-orange-500" />
                </button>
                <button onClick={() => toggleStatus(j.id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-yellow-50 transition-colors">
                  {j.status === "active" ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} className="text-gray-400" />}
                </button>
                <button onClick={() => setDeleteId(j.id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: LOWONGAN LAINNYA (read-only) ── */}
      {tab === "semua" && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {filteredOther.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Eye size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Belum ada lowongan dari perusahaan lain</p>
            </div>
          ) : filteredOther.map((j) => (
            <div key={j.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase size={18} className="text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{j.title}</p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><Building2 size={10} /> {j.company}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><MapPin size={10} /> {j.location}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><Tag size={10} /> {j.type}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400"><DollarSign size={10} /> {j.salary}</span>
                </div>
              </div>
              {/* Tidak ada tombol aksi — hanya view */}
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg shrink-0">View only</span>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-black text-gray-800 text-lg">{editId ? "Edit" : "Buat"} Lowongan</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editId ? "Ubah detail lowongan" : "Isi detail lowongan baru"}</p>
              </div>
              <button onClick={() => setModal(false)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div><label className={LABEL}>Nama Posisi *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Kasir, Admin, Driver..." className={INPUT} /></div>
              <div><label className={LABEL}>Nama Usaha / Perusahaan *</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Nama toko atau usaha" className={INPUT} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={LABEL}>Lokasi *</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Kota / Remote" className={INPUT} /></div>
                <div><label className={LABEL}>Tipe Kerja</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={INPUT + " appearance-none cursor-pointer"}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select></div>
              </div>
              <div><label className={LABEL}>Gaji / Kompensasi *</label>
                <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="Rp 3.000.000 atau Project Based" className={INPUT} /></div>
              {formErr && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{formErr}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(false)} className="flex-1 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">Batal</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                  <Save size={15} /> {editId ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-black text-gray-800 text-lg">Hapus Lowongan?</h3>
              <p className="text-sm text-gray-400 mt-1">Lowongan ini akan dihapus permanen.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all">Batal</button>
              <button onClick={doDelete} className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
