import { create } from "zustand";

/* ── Admin credentials ──────────────────────────────────────────────── */

const ADMIN_EMAIL = "zozagatewaysnacks@gmail.com";
const ADMIN_PASSWORD = "ZozaZee2";
const STORAGE_KEY = "zoza_admin_auth";

/* ── Store shape ─────────────────────────────────────────────────────── */

interface AdminAuthStore {
  isAuthenticated: boolean;
  email: string | null;

  /** Try to log in – returns true on success */
  login: (email: string, password: string) => boolean;

  /** Log out and clear persisted session */
  logout: () => void;

  /** Restore session from localStorage (call once on mount) */
  hydrate: () => void;
}

/* ── Store ───────────────────────────────────────────────────────────── */

export const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  isAuthenticated: false,
  email: null,

  login: (email, password) => {
    if (
      email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      set({ isAuthenticated: true, email });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email }));
      } catch {
        // SSR or storage blocked – ignore
      }
      return true;
    }
    return false;
  },

  logout: () => {
    set({ isAuthenticated: false, email: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  hydrate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { email } = JSON.parse(raw);
        if (email) {
          set({ isAuthenticated: true, email });
        }
      }
    } catch {
      // ignore
    }
  },
}));
