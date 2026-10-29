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
  category?: 'portfolio' | 'webapp' | 'data' | 'ai';
  techIcons: {
    src: string;
    alt: string;
  }[];
  sourceCodeUrl: string;
  repoName?: string;
  stars?: number;
  forks?: number;
  updatedAt?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  fork: boolean;
}

export interface GitHubUserProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionData {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  peakDay: {
    date: string;
    count: number;
  };
  contributions: GitHubContributionDay[];
  lastSyncedAt: Date;
}

export type TechCategory = 'language' | 'framework' | 'database' | 'ai' | 'tool';

export interface TechNode {
  id: string;
  name: string;
  category: TechCategory;
  color: string;
  projectCount: number;
  projectIds: number[];
  x: number;
  y: number;
}

export interface ProjectGraphNode {
  id: string;
  repoId: number;
  name: string;
  displayName: string;
  repo: GitHubRepo;
  techIds: string[];
  primaryLanguage: string | null;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  projectId: string;
  techId: string;
  techName: string;
  color: string;
}

export interface SimilarProject {
  projectNode: ProjectGraphNode;
  sharedTechs: string[];
  score: number;
}

