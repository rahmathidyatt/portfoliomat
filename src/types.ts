export interface TechSkill {
  name: string;
  level: string;
  logo: string;
  isHiddenByDefault?: boolean;
}

export interface SoftSkill {
  name: string;
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
}

export interface QualificationItem {
  title: string;
  subtitle: string;
  calendar: string;
  type: 'education' | 'work';
  isFirst?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  img: string;
  techIcons: {
    src: string;
    alt: string;
  }[];
  sourceCodeUrl: string;
}
