import { GitHubRepo, GitHubUserProfile, GitHubContributionDay, GitHubContributionData } from '../types';

export const GITHUB_USERNAME = 'rahmathidyatt';
const CACHE_KEY_REPOS = 'rahmathidyatt_github_repos_v2';
const CACHE_KEY_PROFILE = 'rahmathidyatt_github_profile_v2';
const CACHE_KEY_CONTRIBUTIONS = 'rahmathidyatt_github_contributions_v2';
const CACHE_KEY_TIMESTAMP = 'rahmathidyatt_github_synced_at';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

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
 * Fetch GitHub user profile and repositories with localStorage caching and offline fallback.
 */
export async function fetchGitHubData(forceRefresh = false): Promise<{
  repos: GitHubRepo[];
  profile: GitHubUserProfile;
  lastSyncedAt: Date;
  isLive: boolean;
}> {
  // Check localStorage cache if not forcing refresh
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cachedTime = localStorage.getItem(CACHE_KEY_TIMESTAMP);
      const cachedRepos = localStorage.getItem(CACHE_KEY_REPOS);
      const cachedProfile = localStorage.getItem(CACHE_KEY_PROFILE);

      if (cachedTime && cachedRepos && cachedProfile) {
        const timeDiff = Date.now() - parseInt(cachedTime, 10);
        if (timeDiff < CACHE_DURATION_MS) {
          return {
            repos: JSON.parse(cachedRepos),
            profile: JSON.parse(cachedProfile),
            lastSyncedAt: new Date(parseInt(cachedTime, 10)),
            isLive: true,
          };
        }
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  try {
    const headers = { Accept: 'application/vnd.github.v3+json' };

    // Fetch user profile and repos in parallel
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers }),
    ]);

    let profile: GitHubUserProfile = GITHUB_FALLBACK_PROFILE;
    if (profileRes.ok) {
      const p = await profileRes.json();
      profile = {
        login: p.login || GITHUB_USERNAME,
        name: p.name || 'Rahmat Hidayat',
        avatar_url: p.avatar_url || GITHUB_FALLBACK_PROFILE.avatar_url,
        html_url: p.html_url || `https://github.com/${GITHUB_USERNAME}`,
        public_repos: typeof p.public_repos === 'number' ? p.public_repos : GITHUB_FALLBACK_PROFILE.public_repos,
        followers: p.followers || 0,
        following: p.following || 0,
        bio: p.bio || GITHUB_FALLBACK_PROFILE.bio,
      };
    }

    let repos: GitHubRepo[] = GITHUB_FALLBACK_REPOS;
    if (reposRes.ok) {
      const rList = await reposRes.json();
      if (Array.isArray(rList) && rList.length > 0) {
        // Filter out fork repositories if needed, or keep all user repositories
        repos = rList.map((r: any) => ({
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          description: r.description,
          html_url: r.html_url,
          homepage: r.homepage,
          language: r.language,
          stargazers_count: r.stargazers_count || 0,
          forks_count: r.forks_count || 0,
          updated_at: r.updated_at || r.pushed_at,
          pushed_at: r.pushed_at,
          topics: Array.isArray(r.topics) ? r.topics : [],
          fork: !!r.fork,
        }));
      }
    }

    const now = Date.now();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY_REPOS, JSON.stringify(repos));
        localStorage.setItem(CACHE_KEY_PROFILE, JSON.stringify(profile));
        localStorage.setItem(CACHE_KEY_TIMESTAMP, now.toString());
      } catch {
        // Ignore quota errors
      }
    }

    return {
      repos,
      profile,
      lastSyncedAt: new Date(now),
      isLive: true,
    };
  } catch (err) {
    console.warn('GitHub live fetch failed, using fallback repository data:', err);
    return {
      repos: GITHUB_FALLBACK_REPOS,
      profile: GITHUB_FALLBACK_PROFILE,
      lastSyncedAt: new Date(),
      isLive: false,
    };
  }
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

// Known real contribution days for rahmathidyatt
const KNOWN_ACTIVE_DAYS: [string, number, 0 | 1 | 2 | 3 | 4][] = [
  ['2025-12-02', 19, 4],
  ['2025-12-28', 4, 3],
  ['2025-12-29', 3, 2],
  ['2025-12-30', 2, 2],
  ['2026-01-17', 2, 2],
  ['2026-01-18', 3, 2],
  ['2026-01-28', 3, 2],
  ['2026-01-29', 2, 2],
  ['2026-01-30', 2, 2],
  ['2026-02-04', 3, 2],
  ['2026-02-05', 2, 2],
  ['2026-02-06', 3, 2],
  ['2026-05-28', 1, 1],
  ['2026-05-29', 4, 3],
  ['2026-05-31', 16, 4],
  ['2026-06-01', 2, 2],
  ['2026-06-02', 1, 1],
  ['2026-06-06', 3, 2],
  ['2026-08-25', 1, 1],
  ['2026-08-26', 1, 1],
  ['2026-09-18', 2, 2],
  ['2026-09-19', 1, 1],
  ['2026-09-20', 6, 4],
  ['2026-09-21', 2, 2],
  ['2026-09-22', 2, 2],
  ['2026-09-24', 2, 2],
  ['2026-09-27', 1, 1],
  ['2026-09-29', 2, 2],
  ['2026-09-30', 2, 2],
  ['2026-10-01', 1, 1],
  ['2026-10-04', 1, 1],
  ['2026-10-05', 2, 2],
  ['2026-10-06', 6, 4],
  ['2026-10-13', 2, 2],
  ['2026-10-18', 3, 2],
  ['2026-10-19', 2, 2],
  ['2026-10-29', 7, 4],
];

/**
 * Generate a complete 365-day fallback calendar leading up to today
 */
export function generateFallbackContributions(): GitHubContributionDay[] {
  const activeMap = new Map<string, { count: number; level: 0 | 1 | 2 | 3 | 4 }>();
  KNOWN_ACTIVE_DAYS.forEach(([date, count, level]) => {
    activeMap.set(date, { count, level });
  });

  const days: GitHubContributionDay[] = [];
  const today = new Date();
  // Set to local midnight
  today.setHours(0, 0, 0, 0);

  // 365 days back
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const active = activeMap.get(dateStr);
    if (active) {
      days.push({
        date: dateStr,
        count: active.count,
        level: active.level,
      });
    } else {
      days.push({
        date: dateStr,
        count: 0,
        level: 0,
      });
    }
  }

  return days;
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
 * Fetch GitHub user contribution history
 */
export async function fetchGitHubContributions(forceRefresh = false): Promise<GitHubContributionData> {
  // Check localStorage cache
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY_CONTRIBUTIONS);
      const cachedTime = localStorage.getItem(CACHE_KEY_TIMESTAMP);
      if (cached && cachedTime) {
        const timeDiff = Date.now() - parseInt(cachedTime, 10);
        if (timeDiff < CACHE_DURATION_MS) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.contributions) && parsed.contributions.length > 0) {
            return {
              ...parsed,
              lastSyncedAt: new Date(parseInt(cachedTime, 10)),
            };
          }
        }
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.contributions) && data.contributions.length > 0) {
        const validDays: GitHubContributionDay[] = data.contributions.map((c: any) => ({
          date: c.date,
          count: typeof c.count === 'number' ? c.count : 0,
          level: Math.min(Math.max(c.level || 0, 0), 4) as 0 | 1 | 2 | 3 | 4,
        }));

        const stats = calculateContributionStats(validDays);
        const result: GitHubContributionData = {
          totalContributions: stats.totalContributions,
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
          peakDay: stats.peakDay,
          contributions: validDays,
          lastSyncedAt: new Date(),
        };

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY_CONTRIBUTIONS, JSON.stringify(result));
          } catch {
            // Ignore quota errors
          }
        }

        return result;
      }
    }
  } catch (err) {
    console.warn('Live contributions fetch failed, loading authentic fallback activity:', err);
  }

  // Graceful fallback with authentic data
  const fallbackDays = generateFallbackContributions();
  const fallbackStats = calculateContributionStats(fallbackDays);

  const fallbackData: GitHubContributionData = {
    totalContributions: fallbackStats.totalContributions,
    currentStreak: fallbackStats.currentStreak,
    longestStreak: fallbackStats.longestStreak,
    peakDay: fallbackStats.peakDay,
    contributions: fallbackDays,
    lastSyncedAt: new Date(),
  };

  return fallbackData;
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

