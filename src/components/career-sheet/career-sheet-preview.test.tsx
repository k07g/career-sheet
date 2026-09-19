import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareerSheetPreview } from "./career-sheet-preview";
import { CareerSheet, createEmptyCareerSheet } from "@/types/career-sheet";

describe("CareerSheetPreview", () => {
  it("shows a placeholder message when the sheet is empty", () => {
    render(<CareerSheetPreview sheet={createEmptyCareerSheet()} />);

    expect(
      screen.getByText("フォームに入力すると、ここにプレビューが表示されます"),
    ).toBeInTheDocument();
  });

  it("renders entered basic info and work experience", () => {
    const sheet: CareerSheet = {
      ...createEmptyCareerSheet(),
      basicInfo: {
        ...createEmptyCareerSheet().basicInfo,
        name: "山田 太郎",
        email: "taro@example.com",
      },
      workExperiences: [
        {
          id: "1",
          companyName: "株式会社サンプル",
          employmentType: "正社員",
          startDate: "2021-04",
          endDate: "",
          isCurrent: true,
          position: "バックエンドエンジニア",
          description: "API開発",
          technologies: "TypeScript",
        },
      ],
    };

    render(<CareerSheetPreview sheet={sheet} />);

    expect(screen.getByText("山田 太郎")).toBeInTheDocument();
    expect(screen.getByText("taro@example.com")).toBeInTheDocument();
    expect(screen.getByText("株式会社サンプル")).toBeInTheDocument();
    expect(screen.getByText(/現在/)).toBeInTheDocument();
  });

  it("does not render the work experience section when there are no entries", () => {
    const sheet: CareerSheet = {
      ...createEmptyCareerSheet(),
      basicInfo: { ...createEmptyCareerSheet().basicInfo, name: "山田 太郎" },
    };

    render(<CareerSheetPreview sheet={sheet} />);

    expect(screen.queryByText("職務経歴")).not.toBeInTheDocument();
  });
});
