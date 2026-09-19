import { describe, expect, it } from "vitest";
import { formatDate, formatMonth } from "./format";

describe("formatMonth", () => {
  it("returns an empty string for empty input", () => {
    expect(formatMonth("")).toBe("");
  });

  it("formats a YYYY-MM value into Japanese year/month", () => {
    expect(formatMonth("2024-04")).toBe("2024年4月");
  });

  it("strips a leading zero from the month", () => {
    expect(formatMonth("2024-01")).toBe("2024年1月");
  });

  it("returns the raw value when there is no month segment", () => {
    expect(formatMonth("2024")).toBe("2024");
  });
});

describe("formatDate", () => {
  it("returns an empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });

  it("formats a YYYY-MM-DD value into Japanese year/month/day", () => {
    expect(formatDate("2024-04-12")).toBe("2024年4月12日");
  });

  it("strips leading zeros from month and day", () => {
    expect(formatDate("2024-01-05")).toBe("2024年1月5日");
  });

  it("returns the raw value when the day is missing", () => {
    expect(formatDate("2024-04")).toBe("2024-04");
  });
});
