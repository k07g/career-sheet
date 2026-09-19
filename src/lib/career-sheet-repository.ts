import { CareerSheet } from "@/types/career-sheet";

/**
 * Storage abstraction for a career sheet. Swap `createLocalStorageCareerSheetRepository`
 * for an HTTP-backed implementation (same interface) once a data backend exists.
 */
export interface CareerSheetRepository {
  load(): Promise<CareerSheet | null>;
  save(sheet: CareerSheet): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY_PREFIX = "career-sheet:data";

/**
 * `namespace` scopes the stored data (the signed-in user's email) so
 * multiple accounts on the same browser don't share one career sheet.
 */
export function createLocalStorageCareerSheetRepository(
  namespace: string,
): CareerSheetRepository {
  const storageKey = `${STORAGE_KEY_PREFIX}:${namespace}`;

  return {
    async load() {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as CareerSheet;
      } catch {
        return null;
      }
    },

    async save(sheet) {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(storageKey, JSON.stringify(sheet));
    },

    async clear() {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(storageKey);
    },
  };
}

export function getCareerSheetRepository(namespace: string): CareerSheetRepository {
  return createLocalStorageCareerSheetRepository(namespace);
}
