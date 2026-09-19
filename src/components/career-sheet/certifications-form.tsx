import { Section } from "@/components/ui/section";
import { TextField } from "@/components/ui/field";
import { Certification } from "@/types/career-sheet";
import { generateId, useEntryList } from "@/hooks/use-entry-list";

interface CertificationsFormProps {
  value: Certification[];
  onChange: (value: Certification[]) => void;
}

function createEmptyCertification(): Certification {
  return { id: generateId(), name: "", acquiredDate: "" };
}

export function CertificationsForm({ value, onChange }: CertificationsFormProps) {
  const { add, update, remove } = useEntryList(value, onChange);

  return (
    <Section
      title="資格"
      description="保有している資格・免許を入力してください"
      action={
        <button
          type="button"
          onClick={() => add(createEmptyCertification)}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          + 追加
        </button>
      }
    >
      {value.length === 0 && (
        <p className="text-sm text-slate-400">資格が登録されていません</p>
      )}
      <div className="space-y-3">
        {value.map((certification) => (
          <div
            key={certification.id}
            className="grid grid-cols-1 gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[2fr_1fr_auto] sm:items-end"
          >
            <TextField
              label="資格名"
              htmlFor={`certName-${certification.id}`}
              value={certification.name}
              onChange={(e) => update(certification.id, { name: e.target.value })}
              placeholder="基本情報技術者試験"
            />
            <TextField
              label="取得年月"
              htmlFor={`certDate-${certification.id}`}
              type="month"
              value={certification.acquiredDate}
              onChange={(e) =>
                update(certification.id, { acquiredDate: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => remove(certification.id)}
              className="h-fit text-sm text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}
