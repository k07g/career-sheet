import { CareerSheet } from "@/types/career-sheet";

/**
 * Storage abstraction for a career sheet. Swap `localStorageCareerSheetRepository`
 * for an HTTP-backed implementation (same interface) once a backend API exists.
 */
export interface CareerSheetRepository {
  load(): Promise<CareerSheet | null>;
  save(sheet: CareerSheet): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = "career-sheet:data";

export const localStorageCareerSheetRepository: CareerSheetRepository = {
  async load() {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CareerSheet;
    } catch {
      return null;
    }
  },

  async save(sheet) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sheet));
  },

  async clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};

export function getCareerSheetRepository(): CareerSheetRepository {
  return localStorageCareerSheetRepository;
}
