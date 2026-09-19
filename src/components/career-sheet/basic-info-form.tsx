import { Section } from "@/components/ui/section";
import { TextField } from "@/components/ui/field";
import { BasicInfo } from "@/types/career-sheet";

interface BasicInfoFormProps {
  value: BasicInfo;
  onChange: (value: BasicInfo) => void;
}

export function BasicInfoForm({ value, onChange }: BasicInfoFormProps) {
  const update = (patch: Partial<BasicInfo>) => onChange({ ...value, ...patch });

  return (
    <Section title="基本情報" description="氏名や連絡先などの基本情報を入力してください">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="氏名"
          htmlFor="name"
          required
          value={value.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="山田 太郎"
        />
        <TextField
          label="フリガナ"
          htmlFor="nameKana"
          value={value.nameKana}
          onChange={(e) => update({ nameKana: e.target.value })}
          placeholder="ヤマダ タロウ"
        />
        <TextField
          label="生年月日"
          htmlFor="birthDate"
          type="date"
          value={value.birthDate}
          onChange={(e) => update({ birthDate: e.target.value })}
        />
        <TextField
          label="メールアドレス"
          htmlFor="email"
          type="email"
          value={value.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="taro.yamada@example.com"
        />
        <TextField
          label="電話番号"
          htmlFor="phone"
          type="tel"
          value={value.phone}
          onChange={(e) => update({ phone: e.target.value })}
          placeholder="090-1234-5678"
        />
        <TextField
          label="現住所"
          htmlFor="address"
          value={value.address}
          onChange={(e) => update({ address: e.target.value })}
          placeholder="東京都渋谷区..."
          className="sm:col-span-2"
        />
      </div>
    </Section>
  );
}
