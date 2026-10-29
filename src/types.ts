export interface TechSkill {
  name: string;
  level: string;
  logo: string;
  isHiddenByDefault?: boolean;
  category?: 'programming' | 'database' | 'tools' | 'office';
  proficiency?: number;
}

export interface SoftSkill {
  name: string;
  desc?: string;
  isHiddenByDefault?: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  date: string;
  issuer: string;
  img: string;
  pdf: string;
  isFeatured?: boolean;
  category?: 'data' | 'web' | 'leadership';
}

export interface QualificationItem {
  title: string;
  subtitle: string;
  calendar: string;
  description?: string;
  type: 'education' | 'work';
  isFirst?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tagline?: string;
  img: string;
  category?: 'portfolio' | 'webapp';
  techIcons: {
    src: string;
    alt: string;
  }[];
  sourceCodeUrl: string;
}
