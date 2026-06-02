const BASE = "/api/konten";

export interface Lowongan {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  status: string;
  views: number;
  createdAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  category: string;
  location: string;
  price: string;
  rating: number;
  status: string;
  createdAt: string;
}

// ─── Lowongan ─────────────────────────────────────────────────────────────────

export async function fetchLowongan(): Promise<Lowongan[]> {
  const res = await fetch(`${BASE}/lowongan`);
  if (!res.ok) throw new Error("Gagal memuat lowongan");
  return res.json();
}

export async function fetchActiveLowongan(): Promise<Lowongan[]> {
  const res = await fetch(`${BASE}/lowongan/active`);
  if (!res.ok) throw new Error("Gagal memuat lowongan");
  return res.json();
}

export async function createLowongan(
  data: Omit<Lowongan, "id" | "status" | "views" | "createdAt">,
  token: string,
): Promise<Lowongan> {
  const res = await fetch(`${BASE}/lowongan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? "Gagal menyimpan"); }
  return res.json();
}

export async function updateLowongan(
  id: number,
  data: Partial<Lowongan>,
  token: string,
): Promise<Lowongan> {
  const res = await fetch(`${BASE}/lowongan/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? "Gagal mengupdate"); }
  return res.json();
}

export async function deleteLowongan(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/lowongan/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? "Gagal menghapus"); }
}

export async function incrementLowonganView(id: number): Promise<void> {
  await fetch(`${BASE}/lowongan/${id}/view`, { method: "PATCH" });
}

// ─── Supplier ─────────────────────────────────────────────────────────────────

export async function fetchSupplier(): Promise<Supplier[]> {
  const res = await fetch(`${BASE}/supplier`);
  if (!res.ok) throw new Error("Gagal memuat supplier");
  return res.json();
}

export async function fetchActiveSupplier(): Promise<Supplier[]> {
  const res = await fetch(`${BASE}/supplier/active`);
  if (!res.ok) throw new Error("Gagal memuat supplier");
  return res.json();
}

export async function createSupplier(
  data: Omit<Supplier, "id" | "rating" | "status" | "createdAt">,
  token: string,
): Promise<Supplier> {
  const res = await fetch(`${BASE}/supplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? "Gagal menyimpan"); }
  return res.json();
}

export async function updateSupplier(
  id: number,
  data: Partial<Supplier>,
  token: string,
): Promise<Supplier> {
  const res = await fetch(`${BASE}/supplier/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? "Gagal mengupdate"); }
  return res.json();
}

export async function deleteSupplier(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/supplier/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message ?? "Gagal menghapus"); }
}
