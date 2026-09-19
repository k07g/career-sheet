"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCareerSheet } from "@/hooks/use-career-sheet";
import { createSampleCareerSheet } from "@/lib/sample-career-sheet";
import { BasicInfoForm } from "./basic-info-form";
import { TextSectionForm } from "./text-section-form";
import { WorkExperienceForm } from "./work-experience-form";
import { SkillsForm } from "./skills-form";
import { EducationForm } from "./education-form";
import { CertificationsForm } from "./certifications-form";
import { CareerSheetPreview } from "./career-sheet-preview";

type MobileTab = "form" | "preview";

const SAVE_STATUS_LABEL: Record<string, string> = {
  idle: "",
  saving: "保存中...",
  saved: "保存済み",
  error: "保存に失敗しました",
};

interface CareerSheetEditorProps {
  email: string;
}

export function CareerSheetEditor({ email }: CareerSheetEditorProps) {
  const router = useRouter();
  const { sheet, setSheet, isLoaded, saveStatus, resetSheet, loadSample } =
    useCareerSheet(email);
  const [mobileTab, setMobileTab] = useState<MobileTab>("form");

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleLoadSample = () => {
    if (
      sheet.basicInfo.name &&
      !window.confirm("現在の入力内容を上書きしてサンプルを読み込みますか？")
    ) {
      return;
    }
    loadSample(createSampleCareerSheet());
  };

  const handleReset = () => {
    if (!window.confirm("入力内容をすべてクリアします。よろしいですか？")) return;
    resetSheet();
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">キャリアシート作成</h1>
          <p className="text-sm text-slate-500">
            {email} としてログイン中 ・ 入力内容はブラウザに自動保存されます。
            {saveStatus !== "idle" && (
              <span
                className={`ml-2 ${
                  saveStatus === "error" ? "text-red-500" : "text-slate-400"
                }`}
              >
                {SAVE_STATUS_LABEL[saveStatus]}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            サンプルを読み込む
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            クリア
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            印刷 / PDF保存
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ログアウト
          </button>
        </div>
      </header>

      <div className="no-print mb-4 flex rounded-md border border-slate-200 bg-white p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("form")}
          className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
            mobileTab === "form" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          入力
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
            mobileTab === "preview" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          プレビュー
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className={`no-print space-y-5 ${mobileTab === "preview" ? "hidden lg:block" : ""}`}
        >
          <BasicInfoForm
            value={sheet.basicInfo}
            onChange={(basicInfo) => setSheet({ ...sheet, basicInfo })}
          />
          <TextSectionForm
            id="summary"
            title="職務要約"
            description="これまでの経験を簡潔にまとめてください"
            placeholder="例）Webアプリケーションのバックエンド開発に5年間従事..."
            value={sheet.summary}
            onChange={(summary) => setSheet({ ...sheet, summary })}
          />
          <WorkExperienceForm
            value={sheet.workExperiences}
            onChange={(workExperiences) => setSheet({ ...sheet, workExperiences })}
          />
          <SkillsForm
            value={sheet.skills}
            onChange={(skills) => setSheet({ ...sheet, skills })}
          />
          <EducationForm
            value={sheet.educations}
            onChange={(educations) => setSheet({ ...sheet, educations })}
          />
          <CertificationsForm
            value={sheet.certifications}
            onChange={(certifications) => setSheet({ ...sheet, certifications })}
          />
          <TextSectionForm
            id="selfPromotion"
            title="自己PR"
            description="強みやアピールポイントを入力してください"
            placeholder="例）チームをリードしながら課題解決に取り組むことを得意としています..."
            value={sheet.selfPromotion}
            onChange={(selfPromotion) => setSheet({ ...sheet, selfPromotion })}
          />
        </div>

        <div className={mobileTab === "form" ? "hidden lg:block" : ""}>
          <div className="lg:sticky lg:top-6">
            <CareerSheetPreview sheet={sheet} />
          </div>
        </div>
      </div>
    </div>
  );
}
