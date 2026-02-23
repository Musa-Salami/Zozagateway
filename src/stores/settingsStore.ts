import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ── Settings shape ─────────────────────────────────────────────────── */

export interface StoreSettings {
  // General
  storeName: string;
  storeDescription: string;
  currency: string;
  timezone: string;

  // Delivery
  deliveryFee: number;
  freeDeliveryThreshold: number;
  deliveryAreas: string;

  // Payments
  stripeEnabled: boolean;
  bankTransferEnabled: boolean;
  cashOnDelivery: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;

  // Notifications
  emailNewOrder: boolean;
  emailLowStock: boolean;
  emailDailyReport: boolean;
  emailCancelledOrder: boolean;
  lowStockThreshold: number;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Zoza Gateway Snacks",
  storeDescription: "Freshly made snacks, delivered to your doorstep",
  currency: "NGN",
  timezone: "Africa/Lagos",

  deliveryFee: 1500,
  freeDeliveryThreshold: 12500,
  deliveryAreas: "Victoria Island, Lekki, Ikoyi, Surulere, Yaba, Ikeja, Ajah",

  stripeEnabled: true,
  bankTransferEnabled: true,
  cashOnDelivery: false,
  stripePublicKey: "",
  stripeSecretKey: "",

  emailNewOrder: true,
  emailLowStock: true,
  emailDailyReport: false,
  emailCancelledOrder: true,
  lowStockThreshold: 10,
};

/* ── Store interface ─────────────────────────────────────────────────── */

interface SettingsStore {
  settings: StoreSettings;
  _hasHydrated: boolean;
  _loading: boolean;

  loadSettings: () => Promise<void>;
  saveSettings: (patch: Partial<StoreSettings>) => Promise<void>;
}

/* ── Firestore doc ref ───────────────────────────────────────────────── */

const SETTINGS_DOC = "settings/storeConfig";

/* ── Zustand store ───────────────────────────────────────────────────── */

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },
  _hasHydrated: false,
  _loading: false,

  loadSettings: async () => {
    if (get()._hasHydrated) return;
    set({ _loading: true });
    try {
      const snap = await getDoc(doc(db, SETTINGS_DOC));
      if (snap.exists()) {
        set({ settings: { ...DEFAULT_SETTINGS, ...snap.data() } as StoreSettings });
      } else {
        // Seed defaults on first load
        await setDoc(doc(db, SETTINGS_DOC), DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      set({ _hasHydrated: true, _loading: false });
    }
  },

  saveSettings: async (patch) => {
    const merged = { ...get().settings, ...patch };
    set({ settings: merged, _loading: true });
    try {
      await setDoc(doc(db, SETTINGS_DOC), merged);
    } catch (err) {
      console.error("Failed to save settings:", err);
      throw err;
    } finally {
      set({ _loading: false });
    }
  },
}));

/* ── Auto-load in the browser ────────────────────────────────────────── */

if (typeof window !== "undefined") {
  useSettingsStore.getState().loadSettings();
}
