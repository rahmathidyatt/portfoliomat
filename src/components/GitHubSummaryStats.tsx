import React from 'react';
import { FolderGit2, Star, GitFork, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

interface GitHubSummaryStatsProps {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  isSyncing?: boolean;
  profileUrl?: string;
}

export const GitHubSummaryStats: React.FC<GitHubSummaryStatsProps> = ({
  totalRepos,
  totalStars,
  totalForks,
  isSyncing = false,
  profileUrl = 'https://github.com/rahmathidyatt',
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  const stats = [
    {
      id: 'repos',
      title: (t.projects as any).summaryReposTitle || (language === 'id' ? 'Repositori Publik' : 'Public Repositories'),
      value: totalRepos,
      subtitle: (t.projects as any).summaryReposSubtitle || (language === 'id' ? 'Proyek kode terbuka' : 'Open source projects'),
      icon: FolderGit2,
      accentClass: 'gh-stat-card--repos',
      badgeText: language === 'id' ? 'Publik' : 'Public',
      link: `${profileUrl}?tab=repositories`,
    },
    {
      id: 'stars',
      title: (t.projects as any).summaryStarsTitle || (language === 'id' ? 'Bintang GitHub' : 'GitHub Stars'),
      value: totalStars,
      subtitle: (t.projects as any).summaryStarsSubtitle || (language === 'id' ? 'Dukungan komunitas' : 'Community stars'),
      icon: Star,
      accentClass: 'gh-stat-card--stars',
      badgeText: language === 'id' ? 'Apresiasi' : 'Stars',
      link: `${profileUrl}?tab=stars`,
    },
    {
      id: 'forks',
      title: (t.projects as any).summaryForksTitle || (language === 'id' ? 'Forks Repositori' : 'Repository Forks'),
      value: totalForks,
      subtitle: (t.projects as any).summaryForksSubtitle || (language === 'id' ? 'Percabangan proyek' : 'Forked projects'),
      icon: GitFork,
      accentClass: 'gh-stat-card--forks',
      badgeText: language === 'id' ? 'Kolaborasi' : 'Network',
      link: `${profileUrl}?tab=repositories`,
    },
  ];

  return (
    <div
      className="github-summary-stats"
      role="region"
      aria-label={(t.projects as any).summaryLiveMetric || 'GitHub Metrics'}
    >
      <div className="github-summary-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.id}
              href={stat.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`gh-stat-card ${stat.accentClass} ${isSyncing ? 'syncing-pulse' : ''}`}
              title={`${stat.title}: ${stat.value}`}
            >
              <div className="gh-stat-card__top">
                <div className="gh-stat-card__icon-wrap">
                  <Icon size={20} className="gh-stat-card__icon" />
                </div>
                <div className="gh-stat-card__meta">
                  <span className="gh-stat-card__badge">{stat.badgeText}</span>
                  <ArrowUpRight size={15} className="gh-stat-card__arrow" aria-hidden="true" />
                </div>
              </div>

              <div className="gh-stat-card__body">
                <div className="gh-stat-card__value-wrap">
                  <span className="gh-stat-card__value">
                    {stat.value.toLocaleString()}
                  </span>
                  {isSyncing && <span className="gh-stat-card__sync-dot" />}
                </div>
                <h3 className="gh-stat-card__title">{stat.title}</h3>
                <p className="gh-stat-card__subtitle">{stat.subtitle}</p>
              </div>

              <div className="gh-stat-card__glow-bar" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </div>
  );
};
