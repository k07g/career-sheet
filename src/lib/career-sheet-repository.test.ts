import { beforeEach, describe, expect, it } from "vitest";
import { localStorageCareerSheetRepository } from "./career-sheet-repository";
import { createEmptyCareerSheet } from "@/types/career-sheet";

describe("localStorageCareerSheetRepository", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when nothing has been saved", async () => {
    await expect(localStorageCareerSheetRepository.load()).resolves.toBeNull();
  });

  it("round-trips a saved career sheet", async () => {
    const sheet = {
      ...createEmptyCareerSheet(),
      basicInfo: {
        ...createEmptyCareerSheet().basicInfo,
        name: "山田 太郎",
      },
    };

    await localStorageCareerSheetRepository.save(sheet);
    await expect(localStorageCareerSheetRepository.load()).resolves.toEqual(sheet);
  });

  it("returns null after clear", async () => {
    await localStorageCareerSheetRepository.save(createEmptyCareerSheet());
    await localStorageCareerSheetRepository.clear();

    await expect(localStorageCareerSheetRepository.load()).resolves.toBeNull();
  });

  it("returns null instead of throwing when stored data is corrupt", async () => {
    window.localStorage.setItem("career-sheet:data", "{not valid json");

    await expect(localStorageCareerSheetRepository.load()).resolves.toBeNull();
  });
});
