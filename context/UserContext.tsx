"use client";

import {
  createContext, useContext, useState, useEffect,
  useCallback, useRef, ReactNode,
} from "react";

const API_BASE = "/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "pemilik_usaha" | "customer";

interface AuthUser {
  id:            number;
  name:          string | null;
  email:         string;
  businessName:  string | null;
  role:          UserRole;
  plan:          string;
  planExpiresAt: string | null;
  createdAt:     string;
}

interface UserContextType {
  user:          AuthUser | null;
  token:         string | null;
  isLoggedIn:    boolean;
  authLoading:   boolean;
  isPremium:     boolean;
  plan:          string;
  planExpiresAt: string | null;
  role:          UserRole;
  isAdmin:       boolean;
  isPemilikUsaha: boolean;
  login:          (email: string, password: string) => Promise<void>;
  logout:         () => void;
  refresh:        () => Promise<void>;
  updateProfile:  (data: { name?: string; businessName?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextType>({
  user:          null,
  token:         null,
  isLoggedIn:    false,
  authLoading:   true,
  isPremium:     false,
  plan:          "free",
  planExpiresAt: null,
  role:          "customer",
  isAdmin:       false,
  isPemilikUsaha: false,
  login:          async () => {},
  logout:         () => {},
  refresh:        async () => {},
  updateProfile:  async () => {},
  changePassword: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProvider({ children }: { children: ReactNode }) {
  const [user,        setUser]        = useState<AuthUser | null>(null);
  const [token,       setToken]       = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const tokenRef = useRef<string | null>(null);
  tokenRef.current = token;

  // Restore session dari localStorage saat mount, lalu verifikasi ke server
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser  = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as AuthUser;
        // Langsung set dari localStorage dulu agar UI tidak blank
        setToken(savedToken);
        tokenRef.current = savedToken;
        setUser(parsedUser);
        setAuthLoading(false);

        // Verifikasi ke server di background (tidak blokir render)
        fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("unauthorized");
            return res.json();
          })
          .then((data: AuthUser) => {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          })
          .catch(() => {
            // Backend tidak jalan atau token expired — tetap pakai data lokal
            // Jangan logout agar user tidak kehilangan sesi
          });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthLoading(false);
      }
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Refresh profil dari server
  const refresh = useCallback(async () => {
    const t = tokenRef.current ?? localStorage.getItem("token");
    if (!t) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error("unauthorized");
      const text = await res.text();
      let data: AuthUser;
      try { data = JSON.parse(text); } catch { throw new Error("unauthorized"); }
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch {
      setToken(null);
      tokenRef.current = null;
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
    const text = await res.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch { /* non-JSON response */ }
    if (!res.ok) throw new Error(data.message ?? "Login gagal");

    const { token: newToken, user: newUser } = data as { token: string; user: AuthUser };
    tokenRef.current = newToken;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  }, []);

  // Logout
  const logout = useCallback(() => {
    tokenRef.current = null;
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: { name?: string; businessName?: string }) => {
    const t = tokenRef.current ?? localStorage.getItem("token");
    if (!t) throw new Error("Tidak terautentikasi");
    const res = await fetch(`${API_BASE}/users/update-profile`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body:    JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Gagal memperbarui profil");
    setUser(json.user);
    localStorage.setItem("user", JSON.stringify(json.user));
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const t = tokenRef.current ?? localStorage.getItem("token");
    if (!t) throw new Error("Tidak terautentikasi");
    const res = await fetch(`${API_BASE}/users/change-password`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body:    JSON.stringify({ currentPassword, newPassword }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Gagal mengubah password");
  }, []);

  const plan          = user?.plan          ?? "free";
  const planExpiresAt = user?.planExpiresAt ?? null;
  const role          = user?.role          ?? "customer";

  return (
    <UserContext.Provider value={{
      user,
      token,
      isLoggedIn:   !!user,
      authLoading,
      isPremium:    plan !== "free",
      plan,
      planExpiresAt,
      role,
      isAdmin:        role === "admin",
      isPemilikUsaha: role === "pemilik_usaha",
      login,
      logout,
      refresh,
      updateProfile,
      changePassword,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
export const useAuth = () => useContext(UserContext);
