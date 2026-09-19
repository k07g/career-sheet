"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCareerSheetRepository } from "@/lib/career-sheet-repository";
import { CareerSheet, createEmptyCareerSheet } from "@/types/career-sheet";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 600;

export function useCareerSheet(email: string) {
  const repository = getCareerSheetRepository(email);
  const [sheet, setSheetState] = useState<CareerSheet>(createEmptyCareerSheet());
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    repository.load().then((loaded) => {
      if (cancelled) return;
      if (loaded) setSheetState(loaded);
      setIsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleSave = useCallback(
    (next: CareerSheet) => {
      setSaveStatus("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        repository
          .save(next)
          .then(() => setSaveStatus("saved"))
          .catch(() => setSaveStatus("error"));
      }, AUTOSAVE_DELAY_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const setSheet = useCallback(
    (updater: CareerSheet | ((prev: CareerSheet) => CareerSheet)) => {
      setSheetState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const resetSheet = useCallback(() => {
    setSheet(createEmptyCareerSheet());
  }, [setSheet]);

  const loadSample = useCallback(
    (sample: CareerSheet) => {
      setSheet(sample);
    },
    [setSheet],
  );

  return {
    sheet,
    setSheet,
    isLoaded,
    saveStatus,
    resetSheet,
    loadSample,
  };
}
