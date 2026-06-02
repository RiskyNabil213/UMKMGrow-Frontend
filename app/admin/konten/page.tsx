"use client";

import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Briefcase, Truck, Plus, Search,
  MapPin, Building2, Tag, Eye, CheckCircle, XCircle,
  Clock, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save,
} from "lucide-react";
import { useKonten } from "@/context/KontenContext";

type Tab    = "lowongan" | "supplier";
type Status = "active" | "pending" | "inactive";
type ModalMode = "add" | "edit";

const statusBadge: Record<Status, string> = {
  active:   "bg-green-100 text-green-600",
  pending:  "bg-yellow-100 text-yellow-600",
  inactive: "bg-gray-100 text-gray-500",
};
const statusLabel: Record<Status, string> = { active: "Aktif", pending: "Menunggu", inactive: "Nonaktif" };
const StatusIcon = ({ s }: { s: Status }) =>
  s === "active" ? <CheckCircle size={11} /> : s === "pending" ? <Clock size={11} /> : <XCircle size={11} />;

const INPUT = "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
const TYPES  = ["Full-time", "Part-time", "Freelance"];
const CATS   = ["Bahan Makanan", "Tekstil", "Elektronik", "Kemasan", "Peralatan", "Lainnya"];
const PRICES = ["Termurah", "Bersaing", "Grosir", "Premium"];

const emptyL = { title: "", company: "", location: "", type: "Full-time", salary: "" };
const emptyS = { name: "", category: "Bahan Makanan", location: "", price: "Bersaing" };

export default function ManajemenKontenPage() {
  const { user, role } = useAuth();
  const router = useRouter();
  const {
    lowongan, supplier,
    addLowongan, updateLowongan, deleteLowongan,
    addSupplier, updateSupplier, deleteSupplier,
  } = useKonten();

  const [tab,      setTab]      = useState<Tab>("lowongan");
  const [search,   setSearch]   = useState("");

  const [modal,     setModal]     = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editId,    setEditId]    = useState<number | null>(null);
  const [formL,     setFormL]     = useState(emptyL);
  const [formS,     setFormS]     = useState(emptyS);
  const [formErr,   setFormErr]   = useState("");
  const [deleteId,  setDeleteId]  = useState<number | null>(null);

  useEffect(() => {
    if (user && role === "customer") router.replace("/");
  }, [user, role, router]);

  function openAdd() {
    setModalMode("add"); setEditId(null);
    setFormL(emptyL); setFormS(emptyS); setFormErr("");
    setModal(true);
  }

  function openEdit(id: number) {
    setModalMode("edit"); setEditId(id); setFormErr("");
    if (tab === "lowongan") {
      const item = lowongan.find((l) => l.id === id)!;
      setFormL({ title: item.title, company: item.company, location: item.location, type: item.type, salary: item.salary });
    } else {
      const item = supplier.find((s) => s.id === id)!;
      setFormS({ name: item.name, category: item.category, location: item.location, price: item.price });
    }
    setModal(true);
  }

  function toggleStatus(id: number) {
    if (tab === "lowongan") {
      const item = lowongan.find((l) => l.id === id);
      if (item) updateLowongan(id, { status: item.status === "active" ? "inactive" : "active" });
    } else {
      const item = supplier.find((s) => s.id === id);
      if (item) updateSupplier(id, { status: item.status === "active" ? "inactive" : "active" });
    }
  }

  function handleSave() {
    if (tab === "lowongan") {
      if (!formL.title.trim() || !formL.company.trim() || !formL.location.trim() || !formL.salary.trim()) {
        setFormErr("Semua field wajib diisi."); return;
      }
      if (modalMode === "add") {
        addLowongan({ ...formL, status: "active" });
      } else if (editId !== null) {
        updateLowongan(editId, formL);
      }
    } else {
      if (!formS.name.trim() || !formS.location.trim()) {
        setFormErr("Nama dan lokasi wajib diisi."); return;
      }
      if (modalMode === "add") {
        addSupplier({ ...formS, status: "active" });
      } else if (editId !== null) {
        updateSupplier(editId, formS);
      }
    }
    setModal(false);
  }

  function doDelete() {
    if (deleteId === null) return;
    if (tab === "lowongan") deleteLowongan(deleteId);
    else deleteSupplier(deleteId);
    setDeleteId(null);
  }

  const filteredL = lowongan.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase())
  );
  const filteredS = supplier.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Lowongan",  value: lowongan.length,                                       color: "text-indigo-600", bg: "bg-indigo-50",  icon: Briefcase   },
    { label: "Lowongan Aktif",  value: lowongan.filter((l) => l.status === "active").length,  color: "text-green-600",  bg: "bg-green-50",   icon: CheckCircle },
    { label: "Total Supplier",  value: supplier.length,                                       color: "text-purple-600", bg: "bg-purple-50",  icon: Truck       },
    { label: "Menunggu Review", value: [...lowongan, ...supplier].filter((i) => i.status === "pending").length, color: "text-yellow-600", bg: "bg-yellow-50", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.push("/admin")}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-gray-800 text-base leading-tight">Manajemen Konten</h1>
          <p className="text-[11px] text-gray-400">Kelola lowongan & supplier</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
          <Plus size={15} /> Tambah {tab === "lowongan" ? "Lowongan" : "Supplier"}
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon size={20} className={s.color} />
              </div>
              <p className="text-2xl font-black text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
            {(["lowongan", "supplier"] as Tab[]).map((t) => (
              <button key={t} onClick={() => { setTab(t); setSearch(""); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  tab === t ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                }`}>
                {t === "lowongan" ? <><Briefcase size={14} /> Lowongan</> : <><Truck size={14} /> Supplier</>}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full sm:w-auto">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={`Cari ${tab}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" />
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {tab === "lowongan" ? (
            filteredL.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Belum ada lowongan</p>
              </div>
            ) : filteredL.map((l) => (
              <div key={l.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <Briefcase size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-800">{l.title}</p>
                    <span className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${statusBadge[l.status]}`}>
                      <StatusIcon s={l.status} /> {statusLabel[l.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><Building2 size={10} /> {l.company}</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><MapPin size={10} /> {l.location}</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><Tag size={10} /> {l.type}</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><Eye size={10} /> {l.views} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(l.id)} title="Edit"
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-indigo-50 transition-colors">
                    <Pencil size={14} className="text-indigo-500" />
                  </button>
                  <button onClick={() => toggleStatus(l.id)} title={l.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-yellow-50 transition-colors">
                    {l.status === "active" ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} className="text-gray-400" />}
                  </button>
                  <button onClick={() => setDeleteId(l.id)} title="Hapus"
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            filteredS.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Truck size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Belum ada supplier</p>
              </div>
            ) : filteredS.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <Truck size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-800">{s.name}</p>
                    <span className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${statusBadge[s.status]}`}>
                      <StatusIcon s={s.status} /> {statusLabel[s.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><Tag size={10} /> {s.category}</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><MapPin size={10} /> {s.location}</span>
                    <span className="text-[11px] text-gray-400">Harga {s.price}</span>
                    {s.rating > 0 && <span className="text-[11px] text-yellow-500 font-bold">★ {s.rating}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(s.id)} title="Edit"
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-indigo-50 transition-colors">
                    <Pencil size={14} className="text-indigo-500" />
                  </button>
                  <button onClick={() => toggleStatus(s.id)} title={s.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-yellow-50 transition-colors">
                    {s.status === "active" ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} className="text-gray-400" />}
                  </button>
                  <button onClick={() => setDeleteId(s.id)} title="Hapus"
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-black text-gray-800 text-lg">
                  {modalMode === "add" ? "Tambah" : "Edit"} {tab === "lowongan" ? "Lowongan" : "Supplier"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{modalMode === "add" ? "Isi detail data baru" : "Ubah informasi yang diperlukan"}</p>
              </div>
              <button onClick={() => setModal(false)}
                className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {tab === "lowongan" ? (
                <>
                  <div><label className={LABEL}>Nama Posisi *</label>
                    <input value={formL.title} onChange={(e) => setFormL({ ...formL, title: e.target.value })}
                      placeholder="Kasir, Barista, Admin..." className={INPUT} /></div>
                  <div><label className={LABEL}>Nama Perusahaan / Usaha *</label>
                    <input value={formL.company} onChange={(e) => setFormL({ ...formL, company: e.target.value })}
                      placeholder="Nama toko atau usaha" className={INPUT} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={LABEL}>Lokasi *</label>
                      <input value={formL.location} onChange={(e) => setFormL({ ...formL, location: e.target.value })}
                        placeholder="Kota / Remote" className={INPUT} /></div>
                    <div><label className={LABEL}>Tipe Kerja</label>
                      <select value={formL.type} onChange={(e) => setFormL({ ...formL, type: e.target.value })}
                        className={INPUT + " appearance-none cursor-pointer"}>
                        {TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select></div>
                  </div>
                  <div><label className={LABEL}>Gaji / Kompensasi *</label>
                    <input value={formL.salary} onChange={(e) => setFormL({ ...formL, salary: e.target.value })}
                      placeholder="Rp 3.000.000 atau Project Based" className={INPUT} /></div>
                </>
              ) : (
                <>
                  <div><label className={LABEL}>Nama Supplier *</label>
                    <input value={formS.name} onChange={(e) => setFormS({ ...formS, name: e.target.value })}
                      placeholder="Nama toko atau perusahaan" className={INPUT} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={LABEL}>Kategori</label>
                      <select value={formS.category} onChange={(e) => setFormS({ ...formS, category: e.target.value })}
                        className={INPUT + " appearance-none cursor-pointer"}>
                        {CATS.map((c) => <option key={c}>{c}</option>)}
                      </select></div>
                    <div><label className={LABEL}>Kisaran Harga</label>
                      <select value={formS.price} onChange={(e) => setFormS({ ...formS, price: e.target.value })}
                        className={INPUT + " appearance-none cursor-pointer"}>
                        {PRICES.map((p) => <option key={p}>{p}</option>)}
                      </select></div>
                  </div>
                  <div><label className={LABEL}>Lokasi *</label>
                    <input value={formS.location} onChange={(e) => setFormS({ ...formS, location: e.target.value })}
                      placeholder="Jakarta, Bandung, Remote..." className={INPUT} /></div>
                </>
              )}
              {formErr && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{formErr}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(false)}
                  className="flex-1 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">
                  Batal
                </button>
                <button onClick={handleSave}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <Save size={15} /> {modalMode === "add" ? "Simpan" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi Hapus */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-black text-gray-800 text-lg">Hapus Data?</h3>
              <p className="text-sm text-gray-400 mt-1">Data ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all">
                Batal
              </button>
              <button onClick={doDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
