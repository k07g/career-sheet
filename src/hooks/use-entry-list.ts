import { useCallback } from "react";

interface WithId {
  id: string;
}

export function useEntryList<T extends WithId>(
  value: T[],
  onChange: (value: T[]) => void,
) {
  const add = useCallback(
    (createEntry: () => T) => {
      onChange([...value, createEntry()]);
    },
    [value, onChange],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      onChange(value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
    },
    [value, onChange],
  );

  const remove = useCallback(
    (id: string) => {
      onChange(value.filter((entry) => entry.id !== id));
    },
    [value, onChange],
  );

  return { add, update, remove };
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
