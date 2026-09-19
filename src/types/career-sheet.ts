export interface BasicInfo {
  name: string;
  nameKana: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  position: string;
  description: string;
  technologies: string;
}

export interface SkillItem {
  id: string;
  category: string;
  name: string;
  level: string;
}

export interface Education {
  id: string;
  schoolName: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  acquiredDate: string;
}

export interface CareerSheet {
  basicInfo: BasicInfo;
  summary: string;
  workExperiences: WorkExperience[];
  skills: SkillItem[];
  educations: Education[];
  certifications: Certification[];
  selfPromotion: string;
}

export const createEmptyCareerSheet = (): CareerSheet => ({
  basicInfo: {
    name: "",
    nameKana: "",
    birthDate: "",
    email: "",
    phone: "",
    address: "",
  },
  summary: "",
  workExperiences: [],
  skills: [],
  educations: [],
  certifications: [],
  selfPromotion: "",
});
