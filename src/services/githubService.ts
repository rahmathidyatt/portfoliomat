import { GitHubRepo, GitHubUserProfile, GitHubContributionDay, GitHubContributionData, GitHubDataSource } from '../types';

export const GITHUB_USERNAME = 'rahmathidyatt';
const CACHE_KEY_REPOS = 'rahmathidyatt_github_repos_v3';
const CACHE_KEY_PROFILE = 'rahmathidyatt_github_profile_v3';
const CACHE_KEY_CONTRIBUTIONS = 'rahmathidyatt_github_contributions_v3';
const CACHE_KEY_REPOS_TIME = 'rahmathidyatt_github_repos_time_v3';
const CACHE_KEY_PROFILE_TIME = 'rahmathidyatt_github_profile_time_v3';
const CACHE_KEY_CONTRIBUTIONS_TIME = 'rahmathidyatt_github_contributions_time_v3';
const CACHE_DURATION_MS = 15 * 60 * 1000;

type ResourceResult<T> = {
  value: T;
  source: GitHubDataSource;
  lastSyncedAt: Date | null;
};

function readCache<T>(key: string, timeKey: string, isValid: (value: unknown) => value is T): { value: T; time: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    const rawTime = localStorage.getItem(timeKey);
    if (raw === null || rawTime === null) return null;
    const time = Number(rawTime);
    if (!Number.isFinite(time) || time <= 0 || time > Date.now() + 60_000) return null;
    const value: unknown = JSON.parse(raw);
    return isValid(value) ? { value, time } : null;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, timeKey: string, value: T, time: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(timeKey, String(time));
  } catch {
    // Browser storage can be disabled or full.
  }
}

async function requestJson(url: string, timeoutMs = 8000): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) throw new Error('GitHub data request failed with HTTP ' + response.status);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function loadResource<T>(
  url: string,
  key: string,
  timeKey: string,
  parse: (raw: unknown) => T,
  isValid: (raw: unknown) => raw is T,
  fallback: T,
  forceRefresh: boolean,
): Promise<ResourceResult<T>> {
  const cached = readCache(key, timeKey, isValid);
  if (!forceRefresh && cached && Date.now() - cached.time < CACHE_DURATION_MS) {
    return { value: cached.value, source: 'cached', lastSyncedAt: new Date(cached.time) };
  }

  try {
    const value = parse(await requestJson(url));
    const time = Date.now();
    writeCache(key, timeKey, value, time);
    return { value, source: 'live', lastSyncedAt: new Date(time) };
  } catch (error) {
    console.warn('GitHub resource unavailable:', error);
    if (cached) return { value: cached.value, source: 'cached', lastSyncedAt: new Date(cached.time) };
    return { value: fallback, source: 'fallback', lastSyncedAt: null };
  }
}

function isRepoList(value: unknown): value is GitHubRepo[] {
  return Array.isArray(value) && value.every((repo) =>
    repo && typeof repo.id === 'number' && typeof repo.name === 'string' &&
    typeof repo.html_url === 'string' && typeof repo.updated_at === 'string');
}

function isProfile(value: unknown): value is GitHubUserProfile {
  return !!value && typeof value === 'object' &&
    typeof (value as GitHubUserProfile).login === 'string' &&
    typeof (value as GitHubUserProfile).html_url === 'string';
}

function parseRepos(value: unknown): GitHubRepo[] {
  if (!Array.isArray(value)) throw new Error('Invalid GitHub repository response');
  const repos = value.map((entry: unknown) => {
    if (!entry || typeof entry !== 'object') throw new Error('Invalid repository entry');
    const r = entry as Record<string, unknown>;
    if (typeof r.id !== 'number' || typeof r.name !== 'string' ||
        typeof r.html_url !== 'string' || typeof r.updated_at !== 'string') {
      throw new Error('Invalid GitHub repository metadata');
    }
    return {
      id: r.id,
      name: r.name,
      full_name: typeof r.full_name === 'string' ? r.full_name : GITHUB_USERNAME + '/' + r.name,
      description: typeof r.description === 'string' ? r.description : null,
      html_url: r.html_url,
      homepage: typeof r.homepage === 'string' ? r.homepage : null,
      language: typeof r.language === 'string' ? r.language : null,
      stargazers_count: typeof r.stargazers_count === 'number' ? r.stargazers_count : 0,
      forks_count: typeof r.forks_count === 'number' ? r.forks_count : 0,
      updated_at: r.updated_at,
      pushed_at: typeof r.pushed_at === 'string' ? r.pushed_at : r.updated_at,
      topics: Array.isArray(r.topics) ? r.topics.filter((topic): topic is string => typeof topic === 'string') : [],
      fork: r.fork === true,
    };
  });
  return repos;
}

function parseProfile(value: unknown): GitHubUserProfile {
  if (!value || typeof value !== 'object') throw new Error('Invalid GitHub profile response');
  const p = value as Record<string, unknown>;
  if (typeof p.login !== 'string' || typeof p.html_url !== 'string') {
    throw new Error('Invalid GitHub profile metadata');
  }
  return {
    login: p.login,
    name: typeof p.name === 'string' ? p.name : GITHUB_USERNAME,
    avatar_url: typeof p.avatar_url === 'string' ? p.avatar_url : GITHUB_FALLBACK_PROFILE.avatar_url,
    html_url: p.html_url,
    public_repos: typeof p.public_repos === 'number' ? p.public_repos : 0,
    followers: typeof p.followers === 'number' ? p.followers : 0,
    following: typeof p.following === 'number' ? p.following : 0,
    bio: typeof p.bio === 'string' ? p.bio : null,
  };
}

// Static snapshot of rahmathidyatt's public repositories as immediate zero-lag baseline
export const GITHUB_FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 864500001,
    name: 'codematt-agent',
    full_name: 'rahmathidyatt/codematt-agent',
    description: 'AI-powered productivity and marketing platform for real estate agents by codematt.',
    html_url: 'https://github.com/rahmathidyatt/codematt-agent',
    homepage: null,
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-10-29T09:14:36Z',
    pushed_at: '2026-10-29T09:14:36Z',
    topics: ['real-estate', 'ai-agent', 'marketing-automation'],
    fork: false,
  },
  {
    id: 864500002,
    name: 'codematt-relay',
    full_name: 'rahmathidyatt/codematt-relay',
    description: 'A privacy-first communication workspace for managing contacts, message templates, campaigns, and WhatsApp-assisted outreach.',
    html_url: 'https://github.com/rahmathidyatt/codematt-relay',
    homepage: null,
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-10-29T06:12:51Z',
    pushed_at: '2026-10-29T06:12:51Z',
    topics: ['messaging', 'templates', 'outreach'],
    fork: false,
  },
  {
    id: 864500003,
    name: 'brighton-hub-cibubur',
    full_name: 'rahmathidyatt/brighton-hub-cibubur',
    description: 'Dashboard operasional Brighton HUB Cibubur untuk pemantauan listing dan administrasi properti.',
    html_url: 'https://github.com/rahmathidyatt/brighton-hub-cibubur',
    homepage: null,
    language: 'JavaScript',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-10-29T04:05:30Z',
    pushed_at: '2026-10-29T04:05:30Z',
    topics: ['dashboard', 'property-management'],
    fork: false,
  },
  {
    id: 864500004,
    name: 'form-smart-messenger',
    full_name: 'rahmathidyatt/form-smart-messenger',
    description: 'Smart messenger web intake form for automated messaging and lead qualification.',
    html_url: 'https://github.com/rahmathidyatt/form-smart-messenger',
    homepage: null,
    language: 'TypeScript',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-10-18T17:20:38Z',
    pushed_at: '2026-10-18T17:20:38Z',
    topics: ['form-handler', 'automation'],
    fork: false,
  },
  {
    id: 864500005,
    name: 'portfoliomat',
    full_name: 'rahmathidyatt/portfoliomat',
    description: 'Personal interactive portfolio showcasing developer projects, bilingual support, and GitHub integration.',
    html_url: 'https://github.com/rahmathidyatt/portfoliomat',
    homepage: null,
    language: 'TypeScript',
    stargazers_count: 1,
    forks_count: 0,
    updated_at: '2026-10-29T14:15:07Z',
    pushed_at: '2026-10-29T14:15:07Z',
    topics: ['portfolio', 'react', 'vite'],
    fork: false,
  },
  {
    id: 864500006,
    name: 'sipudes',
    full_name: 'rahmathidyatt/sipudes',
    description: 'A village information system modernization project focused on UI/UX, maintainability, and modern web development practices.',
    html_url: 'https://github.com/rahmathidyatt/sipudes',
    homepage: null,
    language: 'JavaScript',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-09-24T14:58:18Z',
    pushed_at: '2026-09-24T14:58:18Z',
    topics: ['public-service', 'village-system'],
    fork: false,
  },
  {
    id: 864500007,
    name: 'ai-tools-sentiment-analysis',
    full_name: 'rahmathidyatt/ai-tools-sentiment-analysis',
    description: 'Analisis sentimen diskusi AI tools di Reddit dan Hacker News menggunakan TF-IDF, Naive Bayes, Logistic Regression, dan Linear SVM.',
    html_url: 'https://github.com/rahmathidyatt/ai-tools-sentiment-analysis',
    homepage: null,
    language: 'Python',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-09-22T16:48:28Z',
    pushed_at: '2026-09-22T16:48:28Z',
    topics: ['machine-learning', 'nlp', 'sentiment-analysis', 'python'],
    fork: false,
  },
  {
    id: 864500008,
    name: 'code-reader',
    full_name: 'rahmathidyatt/code-reader',
    description: 'Aplikasi web gratis untuk membacakan dokumen PDF dan Word dengan deteksi bahasa otomatis, pilihan suara perangkat, serta pengaturan rentang dan kecepatan baca.',
    html_url: 'https://github.com/rahmathidyatt/code-reader',
    homepage: null,
    language: 'JavaScript',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2026-09-20T03:18:19Z',
    pushed_at: '2026-09-20T03:18:19Z',
    topics: ['text-to-speech', 'document-reader', 'accessibility'],
    fork: false,
  },
  {
    id: 864500009,
    name: 'Weighted_Product',
    full_name: 'rahmathidyatt/Weighted_Product',
    description: 'Decision Support System Application Using Weighted Product Method for multi-criteria analysis.',
    html_url: 'https://github.com/rahmathidyatt/Weighted_Product',
    homepage: null,
    language: 'PHP',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2024-09-06T08:21:19Z',
    pushed_at: '2024-09-06T08:21:19Z',
    topics: ['dss', 'weighted-product', 'algorithm'],
    fork: false,
  },
  {
    id: 864500010,
    name: 'E-Commerce_Website',
    full_name: 'rahmathidyatt/E-Commerce_Website',
    description: 'Project for Group Final Exam : Developing a Third-Party E-Commerce Website with catalog, checkout, and inventory.',
    html_url: 'https://github.com/rahmathidyatt/E-Commerce_Website',
    homepage: null,
    language: 'PHP',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2023-10-09T22:49:15Z',
    pushed_at: '2023-10-09T22:49:15Z',
    topics: ['ecommerce', 'codeigniter', 'php'],
    fork: false,
  },
  {
    id: 864500011,
    name: 'Pustaka_Booking',
    full_name: 'rahmathidyatt/Pustaka_Booking',
    description: 'Web Programming Course Project: Creating a Book Borrowing Application with user loan management.',
    html_url: 'https://github.com/rahmathidyatt/Pustaka_Booking',
    homepage: null,
    language: 'PHP',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2023-10-09T03:36:27Z',
    pushed_at: '2023-10-09T03:36:27Z',
    topics: ['library-management', 'codeigniter'],
    fork: false,
  },
  {
    id: 864500012,
    name: 'Portfolio_II',
    full_name: 'rahmathidyatt/Portfolio_II',
    description: 'Simple Portfolio Application Website II built with Bootstrap 5 and jQuery interactions.',
    html_url: 'https://github.com/rahmathidyatt/Portfolio_II',
    homepage: null,
    language: 'HTML',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2023-10-09T04:30:14Z',
    pushed_at: '2023-10-09T04:30:14Z',
    topics: ['bootstrap5', 'portfolio'],
    fork: false,
  },
  {
    id: 864500013,
    name: 'Portfolio_I',
    full_name: 'rahmathidyatt/Portfolio_I',
    description: 'Simple Portfolio Application Website I introducing developer skills and background.',
    html_url: 'https://github.com/rahmathidyatt/Portfolio_I',
    homepage: null,
    language: 'CSS',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2023-10-09T04:31:53Z',
    pushed_at: '2023-10-09T04:31:53Z',
    topics: ['portfolio', 'html-css'],
    fork: false,
  },
  {
    id: 864500014,
    name: 'Simple_Python_Calculator',
    full_name: 'rahmathidyatt/Simple_Python_Calculator',
    description: 'Simple Python command-line and GUI Calculator program for basic mathematical operations.',
    html_url: 'https://github.com/rahmathidyatt/Simple_Python_Calculator',
    homepage: null,
    language: 'Python',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2023-10-09T04:35:19Z',
    pushed_at: '2023-10-09T04:35:19Z',
    topics: ['python', 'calculator'],
    fork: false,
  },
  {
    id: 864500015,
    name: 'Analisis_E-Commerce_Public_Dataset',
    full_name: 'rahmathidyatt/Analisis_E-Commerce_Public_Dataset',
    description: 'Data analysis and visualization of public e-commerce transactions using Python, Pandas, and Matplotlib.',
    html_url: 'https://github.com/rahmathidyatt/Analisis_E-Commerce_Public_Dataset',
    homepage: null,
    language: 'Python',
    stargazers_count: 0,
    forks_count: 0,
    updated_at: '2023-09-13T21:32:29Z',
    pushed_at: '2023-09-13T21:32:29Z',
    topics: ['data-analysis', 'pandas', 'python'],
    fork: false,
  },
];

export const GITHUB_FALLBACK_PROFILE: GitHubUserProfile = {
  login: 'rahmathidyatt',
  name: 'codematt',
  avatar_url: 'https://avatars.githubusercontent.com/u/90608676?v=4',
  html_url: 'https://github.com/rahmathidyatt',
  public_repos: 26,
  followers: 0,
  following: 0,
  bio: 'data, code & digital experiments.',
};

/**
 * Fetch repositories and profile independently. Cache is never advertised as live.
 * A failed endpoint uses the last successful cache (even stale) before static fallback.
 */
export async function fetchGitHubData(forceRefresh = false): Promise<{
  repos: GitHubRepo[];
  profile: GitHubUserProfile;
  reposSource: GitHubDataSource;
  profileSource: GitHubDataSource;
  reposLastSyncedAt: Date | null;
  profileLastSyncedAt: Date | null;
  lastSyncedAt: Date | null;
  isLive: boolean;
}> {
  const [repos, profile] = await Promise.all([
    loadResource(
      'https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=100',
      CACHE_KEY_REPOS, CACHE_KEY_REPOS_TIME, parseRepos, isRepoList,
      GITHUB_FALLBACK_REPOS, forceRefresh,
    ),
    loadResource(
      'https://api.github.com/users/' + GITHUB_USERNAME,
      CACHE_KEY_PROFILE, CACHE_KEY_PROFILE_TIME, parseProfile, isProfile,
      GITHUB_FALLBACK_PROFILE, forceRefresh,
    ),
  ]);

  return {
    repos: repos.value,
    profile: profile.value,
    reposSource: repos.source,
    profileSource: profile.source,
    reposLastSyncedAt: repos.lastSyncedAt,
    profileLastSyncedAt: profile.lastSyncedAt,
    lastSyncedAt: repos.lastSyncedAt,
    isLive: repos.source === 'live' && profile.source === 'live',
  };
}

/**
 * Returns distinct programming language color matching GitHub's color scheme
 */
export function getLanguageColor(lang: string | null): string {
  if (!lang) return '#8b949e';
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    PHP: '#4F5D95',
    'Jupyter Notebook': '#DA5B0B',
    Shell: '#89e051',
    Vue: '#41b883',
    Go: '#00ADD8',
    Rust: '#dea584',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
  };
  return colors[lang] || 'var(--first-color)';
}


/**
 * Formats relative time (e.g. "Updated 2 days ago" or "Diperbarui 2 hari lalu")
 */
export function formatRelativeTime(dateString: string, lang: 'en' | 'id'): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return lang === 'id' ? 'baru saja' : 'just now';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return lang === 'id' ? `${diffMinutes} mnt lalu` : `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return lang === 'id' ? `${diffHours} jam lalu` : `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
      return lang === 'id' ? `${diffDays} hari lalu` : `${diffDays}d ago`;
    }

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return lang === 'id' ? `${diffMonths} bln lalu` : `${diffMonths}mo ago`;
    }

    const diffYears = Math.floor(diffDays / 365);
    return lang === 'id' ? `${diffYears} thn lalu` : `${diffYears}y ago`;
  } catch {
    return dateString.split('T')[0];
  }
}

/**
 * Calculates metrics from a list of contribution days
 */
export function calculateContributionStats(contributions: GitHubContributionDay[]) {
  let totalContributions = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let peakDay = { date: '', count: 0 };

  contributions.forEach((day) => {
    totalContributions += day.count;
    if (day.count > peakDay.count) {
      peakDay = { date: day.date, count: day.count };
    }

    if (day.count > 0) {
      tempStreak += 1;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  // Calculate current streak counting backwards from the latest day
  let currentStreak = 0;
  const n = contributions.length;
  let startIndex = n - 1;

  // If latest day has 0 commits, check if yesterday had commits (streak still active for today)
  if (startIndex >= 0 && contributions[startIndex].count === 0 && startIndex - 1 >= 0 && contributions[startIndex - 1].count > 0) {
    startIndex = startIndex - 1;
  }

  for (let i = startIndex; i >= 0; i--) {
    if (contributions[i].count > 0) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    peakDay: peakDay.date ? peakDay : { date: contributions[contributions.length - 1]?.date || '', count: 0 },
  };
}

/**
 * Fetch contributions through the public third-party contributions endpoint.
 * Unknown days must never be synthesized as zero-activity days.
 */
export async function fetchGitHubContributions(forceRefresh = false): Promise<GitHubContributionData> {
  const isValid = (raw: unknown): raw is GitHubContributionData => {
    if (!raw || typeof raw !== 'object') return false;
    const data = raw as GitHubContributionData;
    return Array.isArray(data.contributions) && data.contributions.every((day) =>
      typeof day.date === 'string' && Number.isFinite(day.count) &&
      day.count >= 0 && Number.isInteger(day.level) && day.level >= 0 && day.level <= 4);
  };
  const cached = readCache(CACHE_KEY_CONTRIBUTIONS, CACHE_KEY_CONTRIBUTIONS_TIME, isValid);
  const asCached = (value: GitHubContributionData, time: number): GitHubContributionData => ({
    ...value, source: 'cached', lastSyncedAt: new Date(time),
  });
  if (!forceRefresh && cached && Date.now() - cached.time < CACHE_DURATION_MS) {
    return asCached(cached.value, cached.time);
  }

  try {
    const json = await requestJson('https://github-contributions-api.jogruber.de/v4/' + GITHUB_USERNAME + '?y=last', 8000);
    if (!json || typeof json !== 'object' || !Array.isArray((json as { contributions?: unknown }).contributions)) {
      throw new Error('Invalid contributions response');
    }
    const raw = (json as { contributions: unknown[] }).contributions;
    if (raw.length === 0) throw new Error('Empty contributions response');
    const days: GitHubContributionDay[] = raw.map((entry) => {
      if (!entry || typeof entry !== 'object') throw new Error('Invalid contribution entry');
      const item = entry as Record<string, unknown>;
      if (typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
          typeof item.count !== 'number' || !Number.isInteger(item.count) || item.count < 0 ||
          typeof item.level !== 'number' || !Number.isInteger(item.level) || item.level < 0 || item.level > 4) {
        throw new Error('Invalid contribution day');
      }
      return { date: item.date, count: item.count, level: item.level as 0 | 1 | 2 | 3 | 4 };
    });
    const stats = calculateContributionStats(days);
    const time = Date.now();
    const result: GitHubContributionData = {
      ...stats, contributions: days, source: 'live', lastSyncedAt: new Date(time),
    };
    writeCache(CACHE_KEY_CONTRIBUTIONS, CACHE_KEY_CONTRIBUTIONS_TIME, result, time);
    return result;
  } catch (error) {
    console.warn('GitHub contributions unavailable:', error);
    if (cached) return asCached(cached.value, cached.time);
    return {
      totalContributions: 0,
      currentStreak: 0,
      longestStreak: 0,
      peakDay: { date: '', count: 0 },
      contributions: [],
      source: 'unavailable',
      lastSyncedAt: null,
    };
  }
}

/**
 * Format date for contribution tooltip
 * e.g. "Sunday, Oct 18, 2026" or "Minggu, 18 Okt 2026"
 */
export function formatContributionDate(dateString: string, lang: 'en' | 'id'): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

