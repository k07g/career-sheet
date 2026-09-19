import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WorkExperienceForm } from "./work-experience-form";
import { WorkExperience } from "@/types/career-sheet";

describe("WorkExperienceForm", () => {
  it("shows an empty state when there are no entries", () => {
    render(<WorkExperienceForm value={[]} onChange={vi.fn()} />);

    expect(screen.getByText("職務経歴が登録されていません")).toBeInTheDocument();
  });

  it("adds a new blank entry when clicking the add button", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<WorkExperienceForm value={[]} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "+ 追加" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const newValue = onChange.mock.calls[0][0] as WorkExperience[];
    expect(newValue).toHaveLength(1);
    expect(newValue[0]).toMatchObject({ companyName: "", isCurrent: false });
    expect(newValue[0].id).toEqual(expect.any(String));
  });

  it("removes the matching entry when clicking delete", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const existing: WorkExperience[] = [
      {
        id: "1",
        companyName: "株式会社サンプル",
        employmentType: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        position: "",
        description: "",
        technologies: "",
      },
    ];
    render(<WorkExperienceForm value={existing} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("reports typed input through onChange", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const existing: WorkExperience[] = [
      {
        id: "1",
        companyName: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        position: "",
        description: "",
        technologies: "",
      },
    ];
    render(<WorkExperienceForm value={existing} onChange={onChange} />);

    await user.type(screen.getByLabelText("会社名"), "A");

    expect(onChange).toHaveBeenCalledWith([
      { ...existing[0], companyName: "A" },
    ]);
  });
});
