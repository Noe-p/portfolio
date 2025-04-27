export interface EducationItem {
  school: string;
  location: string;
  diploma: string;
  year: string;
  url?: string;
}

export interface ExperienceItem {
  company: string;
  location: string;
  description: string;
  year: string;
  url?: string;
}

export interface EducationData {
  title: string;
  [key: `item${number}`]: EducationItem;
}

export interface ExperienceData {
  title: string;
  [key: `item${number}`]: ExperienceItem;
}
