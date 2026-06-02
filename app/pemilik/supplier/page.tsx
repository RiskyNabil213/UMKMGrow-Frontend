"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Truck, Plus, Search, MapPin, Tag, Star, Phone,
  Pencil, Trash2, X, Save, ToggleLeft, ToggleRight, Package,
} from "lucide-react";
import Link from "next/link";
import { useKonten } from "@/context/KontenContext";
import { useAuth } from "@/context/UserContext";

type Tab = "cari" | "saya";
type SupplierStatus = "active" | "inactive";

interface MySupplier {
  id:       number;
  name:     string;
  category: string;
  location: string;
  price:    string;
  contact:  string;
  status:   SupplierStatus;
  rating:   number;
}

// ─── Warna ────────────────────────────────────────────────────────────────────

const PRICE_COLORS: Record<string, string> = {
  Termurah: "bg-green-100 text-green-700",
  Bersaing: "bg-blue-100 text-blue-700",
  Grosir:   "bg-teal-100 text-teal-700",
  Premium:  "bg-purple-100 text-purple-700",
};

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  "Bahan Makanan":    { bg: "bg-orange-100", text: "text-orange-600" },
  "Bahan Pangan":     { bg: "bg-orange-100", text: "text-orange-600" },
  "Sayur & Buah":     { bg: "bg-green-100",  text: "text-green-600"  },
  "Kemasan":          { bg: "bg-blue-100",   text: "text-blue-600"   },
  "Fashion":          { bg: "bg-pink-100",   text: "text-pink-600"   },
  "Elektronik":       { bg: "bg-purple-100", text: "text-purple-600" },
  "Tekstil":          { bg: "bg-rose-100",   text: "text-rose-600"   },
  "Peralatan":        { bg: "bg-teal-100",   text: "text-teal-600"   },
  "Minuman":          { bg: "bg-cyan-100",   text: "text-cyan-600"   },
  "Daging & Seafood": { bg: "bg-red-100",    text: "text-red-600"    },
  "Bumbu & Rempah":   { bg: "bg-yellow-100", text: "text-yellow-700" },
  "Alat Masak":       { bg: "bg-stone-100",  text: "text-stone-600"  },
  "Furnitur":         { bg: "bg-amber-100",  text: "text-amber-700"  },
  "Otomotif":         { bg: "bg-slate-100",  text: "text-slate-600"  },
  "Pertanian":        { bg: "bg-lime-100",   text: "text-lime-700"   },
  "Lainnya":          { bg: "bg-indigo-100", text: "text-indigo-600" },
};
const DEFAULT_COLOR = { bg: "bg-indigo-100", text: "text-indigo-600" };

// ─── Konstanta Form ───────────────────────────────────────────────────────────

const CATS = [
  "Bahan Makanan", "Bahan Pangan", "Sayur & Buah", "Kemasan",
  "Peralatan", "Tekstil", "Elektronik", "Fashion", "Minuman",
  "Daging & Seafood", "Bumbu & Rempah", "Alat Masak",
  "Furnitur", "Otomotif", "Pertanian", "Lainnya",
];
const PRICES = ["Termurah", "Bersaing", "Grosir", "Premium"];
const INPUT  = "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all";
const LABEL  = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";
const empty  = { name: "", category: "Bahan Makanan", location: "", price: "Bersaing", contact: "" };

// ─── localStorage helpers ─────────────────────────────────────────────────────

function lsKey(userId: number) { return `my_suppliers_${userId}`; }

function lsLoad(userId: number): MySupplier[] {
  try {
    const raw = localStorage.getItem(lsKey(userId));
    return raw ? (JSON.parse(raw) as MySupplier[]) : [];
  } catch { return []; }
}

function lsSave(userId: number, data: MySupplier[]) {
  localStorage.setItem(lsKey(userId), JSON.stringify(data));
}

// ─── Komponen ─────────────────────────────────────────────────────────────────

export default function PemilikSupplierPage() {
  const { supplier: globalSupplier, addSupplier: addToGlobal } = useKonten();
  const { user } = useAuth();

  const [tab,    setTab]    = useState<Tab>("cari");
  // myList: data supplier milik pemilik ini, tersimpan penuh di localStorage
  const [myList, setMyList] = useState<MySupplier[]>([]);
  // loaded: apakah sudah load dari localStorage
  const [loaded, setLoaded] = useState(false);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchCari,     setSearchCari]     = useState("");
  const [searchMy,       setSearchMy]       = useState("");
  const [modal,          setModal]          = useState(false);
  const [editId,         setEditId]         = useState<number | null>(null);
  const [form,           setForm]           = useState(empty);
  const [formErr,        setFormErr]        = useState("");
  const [deleteId,       setDeleteId]       = useState<number | null>(null);

  // Load data dari localStorage setelah user tersedia
  useEffect(() => {
    if (!user?.id) return;
    const saved = lsLoad(user.id);
    setMyList(saved);
    setLoaded(true);
  }, [user?.id]);

  // Simpan ke localStorage setiap myList berubah (setelah initial load)
  useEffect(() => {
    if (!loaded || !user?.id) return;
    lsSave(user.id, myList);
  }, [myList, loaded, user?.id]);

  // ── Catalog (tab Cari — data global) ──────────────────────────────────────

  const activeCatalog = useMemo(
    () => globalSupplier.filter((s) => s.status === "active"),
    [globalSupplier],
  );

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(activeCatalog.map((s) => s.category)))],
    [activeCatalog],
  );

  const filteredDirektori = activeCatalog.filter((s) => {
    const matchCat    = activeCategory === "Semua" || s.category === activeCategory;
    const matchSearch = searchCari === "" ||
      s.name.toLowerCase().includes(searchCari.toLowerCase()) ||
      s.category.toLowerCase().includes(searchCari.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Supplier Saya ─────────────────────────────────────────────────────────

  const filteredMy = myList.filter((s) =>
    s.name.toLowerCase().includes(searchMy.toLowerCase()) ||
    s.category.toLowerCase().includes(searchMy.toLowerCase()),
  );

  // ── Helpers ───────────────────────────────────────────────────────────────

  function openAdd() { setEditId(null); setForm(empty); setFormErr(""); setModal(true); }

  function openEdit(s: MySupplier) {
    setEditId(s.id);
    setForm({ name: s.name, category: s.category, location: s.location, price: s.price, contact: s.contact });
    setFormErr("");
    setModal(true);
  }

  function toggleStatus(id: number) {
    setMyList((prev) =>
      prev.map((s) => s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s),
    );
  }

  function handleSave() {
    if (!form.name.trim() || !form.location.trim()) {
      setFormErr("Nama dan lokasi wajib diisi.");
      return;
    }

    if (editId === null) {
      const newSupplier: MySupplier = {
        id:       Date.now(),
        name:     form.name.trim(),
        category: form.category,
        location: form.location.trim(),
        price:    form.price,
        contact:  form.contact.trim(),
        status:   "active",
        rating:   0,
      };
      // Simpan ke myList (otomatis tersimpan ke localStorage via useEffect)
      setMyList((prev) => [newSupplier, ...prev]);
      // Juga tambah ke global agar muncul di halaman supplier umum
      addToGlobal({
        name: newSupplier.name, category: newSupplier.category,
        location: newSupplier.location, price: newSupplier.price,
        status: "active", contact: newSupplier.contact,
      });
      setTab("saya");
    } else {
      setMyList((prev) =>
        prev.map((s) =>
          s.id === editId
            ? { ...s, name: form.name.trim(), category: form.category, location: form.location.trim(), price: form.price, contact: form.contact.trim() }
            : s,
        ),
      );
    }
    setModal(false);
  }

  function doDelete() {
    if (deleteId === null) return;
    setMyList((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Truck size={22} className="text-orange-500" /> Supplier
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Cari supplier atau kelola daftar suppliermu</p>
        </div>
        {tab === "saya" && (
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
            <Plus size={16} /> Tambah Supplier
          </button>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1 w-fit">
        <button onClick={() => setTab("cari")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            tab === "cari" ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
          }`}>
          <Search size={14} /> Cari Supplier
        </button>
        <button onClick={() => setTab("saya")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
            tab === "saya" ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
          }`}>
          <Truck size={14} /> Supplier Saya {myList.length > 0 && `(${myList.length})`}
        </button>
      </div>

      {/* ── TAB: CARI SUPPLIER ── */}
      {tab === "cari" && (
        <>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchCari} onChange={(e) => setSearchCari(e.target.value)}
              placeholder="Cari bahan baku atau supplier..."
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all shadow-sm" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-orange-200 hover:text-orange-500"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDirektori.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Supplier tidak ditemukan</p>
              </div>
            ) : filteredDirektori.map((s) => {
              const col = CAT_COLORS[s.category] ?? DEFAULT_COLOR;
              const priceColor = PRICE_COLORS[s.price] ?? "bg-gray-100 text-gray-600";
              return (
                <div key={s.id} className="group bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:border-orange-100 hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${col.bg} rounded-2xl flex items-center justify-center`}>
                      <Package size={22} className={col.text} />
                    </div>
                    {s.rating > 0 && (
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <Star size={13} fill="currentColor" /><span>{s.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-black text-gray-800 text-base leading-tight">{s.name}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1 mb-3">{s.category}</p>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin size={13} className="text-gray-400 shrink-0" /><span>{s.location}</span>
                    </div>
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${priceColor}`}>
                      Harga {s.price}
                    </span>
                  </div>
                  <Link href={`/supplier/${s.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                      <Phone size={15} /> Hubungi Supplier
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── TAB: SUPPLIER SAYA ── */}
      {tab === "saya" && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Supplier",   value: myList.length,                                         color: "text-orange-500" },
              { label: "Aktif",            value: myList.filter((s) => s.status === "active").length,    color: "text-green-600"  },
              { label: "Rata-rata Rating", value: myList.length ? (myList.reduce((a, s) => a + s.rating, 0) / myList.length).toFixed(1) : "0", color: "text-yellow-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchMy} onChange={(e) => setSearchMy(e.target.value)}
              placeholder="Cari supplier saya..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all" />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {filteredMy.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Truck size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Belum ada supplier</p>
                <button onClick={openAdd} className="mt-3 text-orange-500 font-semibold text-sm hover:underline">
                  + Tambah supplier pertama
                </button>
              </div>
            ) : filteredMy.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <Truck size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-800">{s.name}</p>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${s.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                      {s.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><Tag size={10} /> {s.category}</span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><MapPin size={10} /> {s.location}</span>
                    <span className="text-[11px] text-gray-400">Harga {s.price}</span>
                    {s.rating > 0 && <span className="flex items-center gap-0.5 text-[11px] text-yellow-500 font-bold"><Star size={10} fill="currentColor" /> {s.rating}</span>}
                    {s.contact && <span className="text-[11px] text-gray-400">📞 {s.contact}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(s)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-orange-50 transition-colors">
                    <Pencil size={14} className="text-orange-500" />
                  </button>
                  <button onClick={() => toggleStatus(s.id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-yellow-50 transition-colors">
                    {s.status === "active" ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} className="text-gray-400" />}
                  </button>
                  <button onClick={() => setDeleteId(s.id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Tambah/Edit */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-black text-gray-800 text-lg">{editId ? "Edit" : "Tambah"} Supplier</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editId ? "Ubah detail supplier" : "Isi detail supplier baru"}</p>
              </div>
              <button onClick={() => setModal(false)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={LABEL}>Nama Supplier *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama toko atau perusahaan" className={INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={INPUT + " appearance-none cursor-pointer"}>
                    {CATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Kisaran Harga</label>
                  <select value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={INPUT + " appearance-none cursor-pointer"}>
                    {PRICES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={LABEL}>Lokasi *</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Jakarta, Bandung, Remote..." className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>No. WhatsApp / Telepon</label>
                <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="0812-3456-7890" className={INPUT} />
              </div>
              {formErr && <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-xl">{formErr}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setModal(false)}
                  className="flex-1 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">
                  Batal
                </button>
                <button onClick={handleSave}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                  <Save size={15} /> {editId ? "Update" : "Simpan"}
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
              <h3 className="font-black text-gray-800 text-lg">Hapus Supplier?</h3>
              <p className="text-sm text-gray-400 mt-1">Data supplier ini akan dihapus permanen.</p>
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
