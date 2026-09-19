import { Section } from "@/components/ui/section";
import { TextField } from "@/components/ui/field";
import { Education } from "@/types/career-sheet";
import { generateId, useEntryList } from "@/hooks/use-entry-list";

interface EducationFormProps {
  value: Education[];
  onChange: (value: Education[]) => void;
}

function createEmptyEducation(): Education {
  return { id: generateId(), schoolName: "", major: "", startDate: "", endDate: "" };
}

export function EducationForm({ value, onChange }: EducationFormProps) {
  const { add, update, remove } = useEntryList(value, onChange);

  return (
    <Section
      title="学歴"
      description="最終学歴を含む学歴を入力してください"
      action={
        <button
          type="button"
          onClick={() => add(createEmptyEducation)}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          + 追加
        </button>
      }
    >
      {value.length === 0 && (
        <p className="text-sm text-slate-400">学歴が登録されていません</p>
      )}
      <div className="space-y-3">
        {value.map((education) => (
          <div
            key={education.id}
            className="rounded-md border border-slate-200 p-4"
          >
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => remove(education.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                label="学校名"
                htmlFor={`school-${education.id}`}
                value={education.schoolName}
                onChange={(e) => update(education.id, { schoolName: e.target.value })}
                placeholder="〇〇大学"
              />
              <TextField
                label="学部・専攻"
                htmlFor={`major-${education.id}`}
                value={education.major}
                onChange={(e) => update(education.id, { major: e.target.value })}
                placeholder="情報工学部"
              />
              <TextField
                label="入学年月"
                htmlFor={`eduStart-${education.id}`}
                type="month"
                value={education.startDate}
                onChange={(e) => update(education.id, { startDate: e.target.value })}
              />
              <TextField
                label="卒業年月"
                htmlFor={`eduEnd-${education.id}`}
                type="month"
                value={education.endDate}
                onChange={(e) => update(education.id, { endDate: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
