import { Section } from "@/components/ui/section";
import { TextAreaField } from "@/components/ui/field";

interface TextSectionFormProps {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextSectionForm({
  id,
  title,
  description,
  placeholder,
  value,
  onChange,
}: TextSectionFormProps) {
  return (
    <Section title={title} description={description}>
      <TextAreaField
        label=""
        htmlFor={id}
        rows={5}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="[&>label]:hidden"
      />
    </Section>
  );
}
