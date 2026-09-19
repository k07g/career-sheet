import { Section } from "@/components/ui/section";
import { TextField } from "@/components/ui/field";
import { SkillItem } from "@/types/career-sheet";
import { generateId, useEntryList } from "@/hooks/use-entry-list";

interface SkillsFormProps {
  value: SkillItem[];
  onChange: (value: SkillItem[]) => void;
}

function createEmptySkill(): SkillItem {
  return { id: generateId(), category: "", name: "", level: "" };
}

export function SkillsForm({ value, onChange }: SkillsFormProps) {
  const { add, update, remove } = useEntryList(value, onChange);

  return (
    <Section
      title="スキル"
      description="言語・フレームワーク・ツールなどのスキルを入力してください"
      action={
        <button
          type="button"
          onClick={() => add(createEmptySkill)}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          + 追加
        </button>
      }
    >
      {value.length === 0 && (
        <p className="text-sm text-slate-400">スキルが登録されていません</p>
      )}
      <div className="space-y-3">
        {value.map((skill) => (
          <div
            key={skill.id}
            className="grid grid-cols-1 gap-3 rounded-md border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
          >
            <TextField
              label="カテゴリ"
              htmlFor={`category-${skill.id}`}
              value={skill.category}
              onChange={(e) => update(skill.id, { category: e.target.value })}
              placeholder="言語 / フレームワーク など"
            />
            <TextField
              label="スキル名"
              htmlFor={`skillName-${skill.id}`}
              value={skill.name}
              onChange={(e) => update(skill.id, { name: e.target.value })}
              placeholder="TypeScript"
            />
            <TextField
              label="レベル・経験年数"
              htmlFor={`level-${skill.id}`}
              value={skill.level}
              onChange={(e) => update(skill.id, { level: e.target.value })}
              placeholder="3年 / 上級 など"
            />
            <button
              type="button"
              onClick={() => remove(skill.id)}
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
