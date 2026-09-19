import { CareerSheet } from "@/types/career-sheet";
import { generateId } from "@/hooks/use-entry-list";

export function createSampleCareerSheet(): CareerSheet {
  return {
    basicInfo: {
      name: "山田 太郎",
      nameKana: "ヤマダ タロウ",
      birthDate: "1995-04-12",
      email: "taro.yamada@example.com",
      phone: "090-1234-5678",
      address: "東京都渋谷区渋谷1-2-3",
    },
    summary:
      "Webアプリケーションのバックエンド開発を中心に5年間従事。要件定義からリリース・運用まで一貫して担当し、チームリーダーとしての経験もあります。",
    workExperiences: [
      {
        id: generateId(),
        companyName: "株式会社サンプルテック",
        employmentType: "正社員",
        startDate: "2021-04",
        endDate: "",
        isCurrent: true,
        position: "バックエンドエンジニア / チームリーダー",
        description:
          "・ECサイトのAPI基盤の設計・開発・運用\n・チームメンバー4名のマネジメント\n・パフォーマンス改善によりレスポンスタイムを40%短縮",
        technologies: "TypeScript, Node.js, PostgreSQL, AWS",
      },
      {
        id: generateId(),
        companyName: "株式会社ファーストキャリア",
        employmentType: "正社員",
        startDate: "2019-04",
        endDate: "2021-03",
        isCurrent: false,
        position: "エンジニア",
        description: "・社内向け業務システムの開発・保守\n・要件定義から結合テストまで担当",
        technologies: "Java, Spring Boot, MySQL",
      },
    ],
    skills: [
      { id: generateId(), category: "言語", name: "TypeScript", level: "4年" },
      { id: generateId(), category: "言語", name: "Java", level: "2年" },
      { id: generateId(), category: "フレームワーク", name: "Next.js", level: "2年" },
      { id: generateId(), category: "インフラ", name: "AWS", level: "3年" },
    ],
    educations: [
      {
        id: generateId(),
        schoolName: "サンプル大学",
        major: "情報工学部 情報工学科",
        startDate: "2015-04",
        endDate: "2019-03",
      },
    ],
    certifications: [
      { id: generateId(), name: "基本情報技術者試験", acquiredDate: "2018-10" },
      { id: generateId(), name: "AWS認定ソリューションアーキテクト – アソシエイト", acquiredDate: "2022-06" },
    ],
    selfPromotion:
      "チームをリードしながら、技術的な課題に対して主体的に改善提案を行うことを得意としています。新しい技術のキャッチアップにも積極的に取り組んでいます。",
  };
}
