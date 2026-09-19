import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { generateId, useEntryList } from "./use-entry-list";

interface Item {
  id: string;
  label: string;
}

describe("generateId", () => {
  it("returns a non-empty string", () => {
    expect(generateId()).toEqual(expect.any(String));
    expect(generateId().length).toBeGreaterThan(0);
  });

  it("returns unique values across calls", () => {
    const ids = new Set(Array.from({ length: 20 }, () => generateId()));
    expect(ids.size).toBe(20);
  });
});

describe("useEntryList", () => {
  it("add appends a newly created entry", () => {
    const onChange = vi.fn();
    const value: Item[] = [{ id: "1", label: "existing" }];
    const { result } = renderHook(() => useEntryList(value, onChange));

    result.current.add(() => ({ id: "2", label: "new" }));

    expect(onChange).toHaveBeenCalledWith([
      { id: "1", label: "existing" },
      { id: "2", label: "new" },
    ]);
  });

  it("update patches only the matching entry", () => {
    const onChange = vi.fn();
    const value: Item[] = [
      { id: "1", label: "a" },
      { id: "2", label: "b" },
    ];
    const { result } = renderHook(() => useEntryList(value, onChange));

    result.current.update("2", { label: "changed" });

    expect(onChange).toHaveBeenCalledWith([
      { id: "1", label: "a" },
      { id: "2", label: "changed" },
    ]);
  });

  it("remove drops only the matching entry", () => {
    const onChange = vi.fn();
    const value: Item[] = [
      { id: "1", label: "a" },
      { id: "2", label: "b" },
    ];
    const { result } = renderHook(() => useEntryList(value, onChange));

    result.current.remove("1");

    expect(onChange).toHaveBeenCalledWith([{ id: "2", label: "b" }]);
  });
});
