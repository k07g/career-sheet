import { Section } from "@/components/ui/section";
import { TextField, TextAreaField } from "@/components/ui/field";
import { WorkExperience } from "@/types/career-sheet";
import { generateId, useEntryList } from "@/hooks/use-entry-list";

interface WorkExperienceFormProps {
  value: WorkExperience[];
  onChange: (value: WorkExperience[]) => void;
}

function createEmptyWorkExperience(): WorkExperience {
  return {
    id: generateId(),
    companyName: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    position: "",
    description: "",
    technologies: "",
  };
}

export function WorkExperienceForm({ value, onChange }: WorkExperienceFormProps) {
  const { add, update, remove } = useEntryList(value, onChange);

  return (
    <Section
      title="職務経歴"
      description="在籍した会社ごとに業務内容を入力してください"
      action={
        <button
          type="button"
          onClick={() => add(createEmptyWorkExperience)}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          + 追加
        </button>
      }
    >
      {value.length === 0 && (
        <p className="text-sm text-slate-400">職務経歴が登録されていません</p>
      )}
      <div className="space-y-5">
        {value.map((experience, index) => (
          <div
            key={experience.id}
            className="rounded-md border border-slate-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                経歴 {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(experience.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                label="会社名"
                htmlFor={`company-${experience.id}`}
                value={experience.companyName}
                onChange={(e) => update(experience.id, { companyName: e.target.value })}
                placeholder="株式会社サンプル"
              />
              <TextField
                label="雇用形態"
                htmlFor={`employmentType-${experience.id}`}
                value={experience.employmentType}
                onChange={(e) =>
                  update(experience.id, { employmentType: e.target.value })
                }
                placeholder="正社員 / 契約社員 など"
              />
              <TextField
                label="開始年月"
                htmlFor={`start-${experience.id}`}
                type="month"
                value={experience.startDate}
                onChange={(e) => update(experience.id, { startDate: e.target.value })}
              />
              <div>
                <TextField
                  label="終了年月"
                  htmlFor={`end-${experience.id}`}
                  type="month"
                  value={experience.endDate}
                  disabled={experience.isCurrent}
                  onChange={(e) => update(experience.id, { endDate: e.target.value })}
                />
                <label className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={experience.isCurrent}
                    onChange={(e) =>
                      update(experience.id, {
                        isCurrent: e.target.checked,
                        endDate: e.target.checked ? "" : experience.endDate,
                      })
                    }
                  />
                  在籍中
                </label>
              </div>
              <TextField
                label="役職・ポジション"
                htmlFor={`position-${experience.id}`}
                value={experience.position}
                onChange={(e) => update(experience.id, { position: e.target.value })}
                placeholder="バックエンドエンジニア"
                className="sm:col-span-2"
              />
              <TextAreaField
                label="業務内容"
                htmlFor={`description-${experience.id}`}
                value={experience.description}
                onChange={(e) => update(experience.id, { description: e.target.value })}
                placeholder="担当した業務内容や成果を箇条書きで入力してください"
                className="sm:col-span-2"
              />
              <TextField
                label="使用技術"
                htmlFor={`technologies-${experience.id}`}
                value={experience.technologies}
                onChange={(e) => update(experience.id, { technologies: e.target.value })}
                placeholder="TypeScript, React, AWS など"
                className="sm:col-span-2"
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
