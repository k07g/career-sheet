import { beforeEach, describe, expect, it } from "vitest";
import { createLocalStorageCareerSheetRepository } from "./career-sheet-repository";
import { createEmptyCareerSheet } from "@/types/career-sheet";

describe("createLocalStorageCareerSheetRepository", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when nothing has been saved", async () => {
    const repository = createLocalStorageCareerSheetRepository("user-a@example.com");
    await expect(repository.load()).resolves.toBeNull();
  });

  it("round-trips a saved career sheet", async () => {
    const repository = createLocalStorageCareerSheetRepository("user-a@example.com");
    const sheet = {
      ...createEmptyCareerSheet(),
      basicInfo: {
        ...createEmptyCareerSheet().basicInfo,
        name: "山田 太郎",
      },
    };

    await repository.save(sheet);
    await expect(repository.load()).resolves.toEqual(sheet);
  });

  it("returns null after clear", async () => {
    const repository = createLocalStorageCareerSheetRepository("user-a@example.com");
    await repository.save(createEmptyCareerSheet());
    await repository.clear();

    await expect(repository.load()).resolves.toBeNull();
  });

  it("returns null instead of throwing when stored data is corrupt", async () => {
    const repository = createLocalStorageCareerSheetRepository("user-a@example.com");
    window.localStorage.setItem("career-sheet:data:user-a@example.com", "{not valid json");

    await expect(repository.load()).resolves.toBeNull();
  });

  it("keeps different namespaces isolated from each other", async () => {
    const userA = createLocalStorageCareerSheetRepository("user-a@example.com");
    const userB = createLocalStorageCareerSheetRepository("user-b@example.com");

    await userA.save({
      ...createEmptyCareerSheet(),
      basicInfo: { ...createEmptyCareerSheet().basicInfo, name: "ユーザーA" },
    });

    await expect(userB.load()).resolves.toBeNull();
    await expect(userA.load()).resolves.toMatchObject({ basicInfo: { name: "ユーザーA" } });
  });
});
