"use client";

import {
  createContext, useContext, useState, useEffect, ReactNode,
} from "react";
import {
  fetchLowongan, fetchSupplier,
  createLowongan, createSupplier,
  updateLowongan as apiUpdateLowongan,
  updateSupplier as apiUpdateSupplier,
  deleteLowongan as apiDeleteLowongan,
  deleteSupplier as apiDeleteSupplier,
} from "@/lib/konten-api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LowonganStatus = "active" | "pending" | "inactive";
export type SupplierStatus = "active" | "pending" | "inactive";

export interface Lowongan {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  status: LowonganStatus;
  views: number;
}

export interface Supplier {
  id: number;
  name: string;
  category: string;
  location: string;
  price: string;
  rating: number;
  status: SupplierStatus;
  contact?: string;
}

const STORAGE_KEY = "umkm_konten";

// ─── Initial data ─────────────────────────────────────────────────────────────

export const INIT_LOWONGAN: Lowongan[] = [
  { id: 1, title: "Kasir Toko",       company: "Toko Sembako Berkah", location: "Jakarta Timur",   type: "Full-time", salary: "Rp 3.500.000",  status: "active",   views: 142 },
  { id: 2, title: "Barista",           company: "Kopi Janji Jiwa",     location: "Jakarta Selatan", type: "Full-time", salary: "Rp 4.000.000",  status: "active",   views: 98  },
  { id: 3, title: "Admin Online Shop", company: "Fashion Kita",        location: "Jakarta Barat",   type: "Part-time", salary: "Rp 2.000.000",  status: "active",   views: 211 },
  { id: 4, title: "Content Creator",   company: "Kuliner Enak",        location: "Remote",          type: "Freelance", salary: "Project Based", status: "active",   views: 55  },
  { id: 5, title: "Driver Pengiriman", company: "CV Ahmad",            location: "Surabaya",        type: "Full-time", salary: "Rp 3.500.000",  status: "pending",  views: 0   },
];

export const INIT_SUPPLIER: Supplier[] = [
  { id: 1, name: "Grosir Sembako Jaya",     category: "Bahan Pangan", location: "Bekasi",     price: "Termurah", rating: 4.8, status: "active",   contact: "0812-3456-7890" },
  { id: 2, name: "Plastik Pack Mandiri",    category: "Kemasan",      location: "Jakarta",    price: "Bersaing", rating: 4.5, status: "active",   contact: "0821-9876-5432" },
  { id: 3, name: "Tani Makmur Group",       category: "Sayur & Buah", location: "Bogor",      price: "Grosir",   rating: 4.9, status: "active",   contact: "0813-1111-2222" },
  { id: 4, name: "Batik Nusantara",         category: "Fashion",      location: "Yogyakarta", price: "Grosir",   rating: 4.7, status: "active",   contact: "0877-3333-4444" },
  { id: 5, name: "TechParts Indonesia",     category: "Elektronik",   location: "Surabaya",   price: "Bersaing", rating: 4.6, status: "active",   contact: "0856-5555-6666" },
  { id: 6, name: "Kemasan Kreatif Co.",     category: "Kemasan",      location: "Tangerang",  price: "Termurah", rating: 4.4, status: "active",   contact: "0819-7777-8888" },
];

function asLowonganStatus(s: string): LowonganStatus {
  if (s === "active" || s === "pending" || s === "inactive") return s;
  return "active";
}

function asSupplierStatus(s: string): SupplierStatus {
  if (s === "active" || s === "pending" || s === "inactive") return s;
  return "active";
}

function loadFromStorage(): { lowongan: Lowongan[]; supplier: Supplier[] } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.lowongan) && Array.isArray(parsed.supplier)) {
      return parsed as { lowongan: Lowongan[]; supplier: Supplier[] };
    }
  } catch { /* ignore */ }
  return null;
}

function saveToStorage(lowongan: Lowongan[], supplier: Supplier[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lowongan, supplier }));
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface KontenContextType {
  lowongan: Lowongan[];
  supplier: Supplier[];
  loading: boolean;
  addLowongan:    (data: Omit<Lowongan, "id" | "views">) => void;
  updateLowongan: (id: number, data: Partial<Lowongan>) => void;
  deleteLowongan: (id: number) => void;
  addSupplier:    (data: Omit<Supplier, "id" | "rating">, onIdResolved?: (oldId: number, newId: number) => void) => number;
  updateSupplier: (id: number, data: Partial<Supplier>) => void;
  deleteSupplier: (id: number) => void;
}

const KontenContext = createContext<KontenContextType>({
  lowongan: [],
  supplier: [],
  loading: true,
  addLowongan:    () => {},
  updateLowongan: () => {},
  deleteLowongan: () => {},
  addSupplier:    () => 0,
  updateSupplier: () => {},
  deleteSupplier: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function KontenProvider({ children }: { children: ReactNode }) {
  const [lowongan, setLowongan] = useState<Lowongan[]>(INIT_LOWONGAN);
  const [supplier, setSupplier] = useState<Supplier[]>(INIT_SUPPLIER);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [apiL, apiS] = await Promise.all([fetchLowongan(), fetchSupplier()]);
        if (!cancelled && (apiL.length > 0 || apiS.length > 0)) {
          setLowongan(apiL.map((l) => ({
            id: l.id, title: l.title, company: l.company, location: l.location,
            type: l.type, salary: l.salary, status: asLowonganStatus(l.status), views: l.views ?? 0,
          })));
          setSupplier(apiS.map((s) => ({
            id: s.id, name: s.name, category: s.category, location: s.location,
            price: s.price, rating: s.rating ?? 0, status: asSupplierStatus(s.status),
          })));
          if (!cancelled) setLoading(false);
          return;
        }
      } catch { /* API unavailable */ }

      const stored = loadFromStorage();
      if (!cancelled && stored) {
        setLowongan(stored.lowongan);
        setSupplier(stored.supplier);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loading) saveToStorage(lowongan, supplier);
  }, [lowongan, supplier, loading]);

  function addLowongan(data: Omit<Lowongan, "id" | "views">) {
    const token = getToken();
    const optimistic: Lowongan = { id: Date.now(), views: 0, ...data };
    setLowongan((prev) => {
      const next = [optimistic, ...prev];
      saveToStorage(next, supplier);
      return next;
    });
    if (token) {
      createLowongan(
        { title: data.title, company: data.company, location: data.location, type: data.type, salary: data.salary },
        token,
      ).then((created) => {
        setLowongan((prev) => {
          const next = [
            { id: created.id, title: created.title, company: created.company, location: created.location, type: created.type, salary: created.salary, status: asLowonganStatus(created.status), views: created.views ?? 0 },
            ...prev.filter((l) => l.id !== optimistic.id),
          ];
          saveToStorage(next, supplier);
          return next;
        });
      }).catch(() => {});
    }
  }

  function updateLowongan(id: number, data: Partial<Lowongan>) {
    setLowongan((prev) => {
      const next = prev.map((l) => l.id === id ? { ...l, ...data } : l);
      saveToStorage(next, supplier);
      return next;
    });
    const token = getToken();
    if (token) apiUpdateLowongan(id, data, token).catch(() => {});
  }

  function deleteLowongan(id: number) {
    setLowongan((prev) => {
      const next = prev.filter((l) => l.id !== id);
      saveToStorage(next, supplier);
      return next;
    });
    const token = getToken();
    if (token) apiDeleteLowongan(id, token).catch(() => {});
  }

  function addSupplier(data: Omit<Supplier, "id" | "rating">, onIdResolved?: (oldId: number, newId: number) => void): number {
    const token = getToken();
    const optimisticId = Date.now();
    const optimistic: Supplier = { id: optimisticId, rating: 0, ...data };
    setSupplier((prev) => {
      const next = [optimistic, ...prev];
      saveToStorage(lowongan, next);
      return next;
    });
    if (token) {
      createSupplier(
        { name: data.name, category: data.category, location: data.location, price: data.price },
        token,
      ).then((created) => {
        setSupplier((prev) => {
          const next = [
            { id: created.id, name: created.name, category: created.category, location: created.location, price: created.price, rating: created.rating ?? 0, status: asSupplierStatus(created.status), contact: data.contact },
            ...prev.filter((s) => s.id !== optimisticId),
          ];
          saveToStorage(lowongan, next);
          return next;
        });
        // Callback untuk update ID jika tersedia
        if (onIdResolved) onIdResolved(optimisticId, created.id);
      }).catch(() => {});
    }
    // Return optimistic ID agar caller bisa langsung track
    return optimisticId;
  }

  function updateSupplier(id: number, data: Partial<Supplier>) {
    setSupplier((prev) => {
      const next = prev.map((s) => s.id === id ? { ...s, ...data } : s);
      saveToStorage(lowongan, next);
      return next;
    });
    const token = getToken();
    if (token) apiUpdateSupplier(id, data, token).catch(() => {});
  }

  function deleteSupplier(id: number) {
    setSupplier((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveToStorage(lowongan, next);
      return next;
    });
    const token = getToken();
    if (token) apiDeleteSupplier(id, token).catch(() => {});
  }

  return (
    <KontenContext.Provider value={{
      lowongan, supplier, loading,
      addLowongan, updateLowongan, deleteLowongan,
      addSupplier, updateSupplier, deleteSupplier,
    }}>
      {children}
    </KontenContext.Provider>
  );
}

export const useKonten = () => useContext(KontenContext);
