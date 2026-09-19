import { CareerSheet } from "@/types/career-sheet";
import { formatDate, formatMonth } from "@/lib/format";

interface CareerSheetPreviewProps {
  sheet: CareerSheet;
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 break-inside-avoid">
      <h2 className="mb-2 border-b-2 border-slate-800 pb-1 text-sm font-bold tracking-wide text-slate-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CareerSheetPreview({ sheet }: CareerSheetPreviewProps) {
  const { basicInfo, summary, workExperiences, skills, educations, certifications, selfPromotion } =
    sheet;

  const hasAnyContent =
    basicInfo.name ||
    summary ||
    workExperiences.length > 0 ||
    skills.length > 0 ||
    educations.length > 0 ||
    certifications.length > 0 ||
    selfPromotion;

  if (!hasAnyContent) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400">
        フォームに入力すると、ここにプレビューが表示されます
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[210mm] rounded-lg border border-slate-200 bg-white p-8 text-slate-900 shadow-sm print:border-none print:shadow-none">
      <header className="mb-6 border-b border-slate-300 pb-4">
        <h1 className="text-xl font-bold">職務経歴書</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          {basicInfo.name && (
            <span className="text-lg font-semibold">{basicInfo.name}</span>
          )}
          {basicInfo.nameKana && (
            <span className="text-slate-500">（{basicInfo.nameKana}）</span>
          )}
        </div>
        <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-2">
          {basicInfo.birthDate && (
            <div className="flex gap-2">
              <dt className="text-slate-400">生年月日</dt>
              <dd>{formatDate(basicInfo.birthDate)}</dd>
            </div>
          )}
          {basicInfo.email && (
            <div className="flex gap-2">
              <dt className="text-slate-400">メール</dt>
              <dd>{basicInfo.email}</dd>
            </div>
          )}
          {basicInfo.phone && (
            <div className="flex gap-2">
              <dt className="text-slate-400">電話番号</dt>
              <dd>{basicInfo.phone}</dd>
            </div>
          )}
          {basicInfo.address && (
            <div className="flex gap-2">
              <dt className="text-slate-400">住所</dt>
              <dd>{basicInfo.address}</dd>
            </div>
          )}
        </dl>
      </header>

      {summary && (
        <PreviewSection title="職務要約">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {summary}
          </p>
        </PreviewSection>
      )}

      {workExperiences.length > 0 && (
        <PreviewSection title="職務経歴">
          <div className="space-y-4">
            {workExperiences.map((experience) => (
              <div key={experience.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-semibold">{experience.companyName}</span>
                  <span className="text-xs text-slate-500">
                    {formatMonth(experience.startDate)} 〜{" "}
                    {experience.isCurrent ? "現在" : formatMonth(experience.endDate)}
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  {[experience.employmentType, experience.position]
                    .filter(Boolean)
                    .join(" / ")}
                </div>
                {experience.description && (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {experience.description}
                  </p>
                )}
                {experience.technologies && (
                  <p className="mt-1 text-xs text-slate-500">
                    使用技術: {experience.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {skills.length > 0 && (
        <PreviewSection title="スキル">
          <table className="w-full text-sm">
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-slate-100 last:border-0">
                  <td className="w-1/4 py-1 pr-2 text-slate-500">{skill.category}</td>
                  <td className="py-1 pr-2 font-medium">{skill.name}</td>
                  <td className="py-1 text-slate-600">{skill.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </PreviewSection>
      )}

      {educations.length > 0 && (
        <PreviewSection title="学歴">
          <div className="space-y-1">
            {educations.map((education) => (
              <div
                key={education.id}
                className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm"
              >
                <span>
                  {education.schoolName}
                  {education.major && ` ${education.major}`}
                </span>
                <span className="text-xs text-slate-500">
                  {formatMonth(education.startDate)} 〜 {formatMonth(education.endDate)}
                </span>
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {certifications.length > 0 && (
        <PreviewSection title="資格">
          <div className="space-y-1">
            {certifications.map((certification) => (
              <div
                key={certification.id}
                className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm"
              >
                <span>{certification.name}</span>
                <span className="text-xs text-slate-500">
                  {formatMonth(certification.acquiredDate)}
                </span>
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {selfPromotion && (
        <PreviewSection title="自己PR">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {selfPromotion}
          </p>
        </PreviewSection>
      )}
    </div>
  );
}
