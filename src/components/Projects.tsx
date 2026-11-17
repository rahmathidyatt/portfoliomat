import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  RefreshCw,
  CircleDot,
  Check,
} from 'lucide-react';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import {
  fetchGitHubData,
  fetchGitHubContributions,
  formatRelativeTime,
  GITHUB_FALLBACK_REPOS,
  GITHUB_FALLBACK_PROFILE,
  GITHUB_USERNAME,
} from '../services/githubService';
import { GitHubRepo, GitHubUserProfile, GitHubContributionData, GitHubDataSource } from '../types';
import { GitHubContributionGraph } from './GitHubContributionGraph';
import { TechNetworkGraph } from './TechNetworkGraph';

export const Projects: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  // GitHub Live State
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>(GITHUB_FALLBACK_REPOS);
  const [githubProfile, setGithubProfile] = useState<GitHubUserProfile>(GITHUB_FALLBACK_PROFILE);
  const [contributionData, setContributionData] = useState<GitHubContributionData | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [reposSource, setReposSource] = useState<GitHubDataSource>('fallback');
  const [profileSource, setProfileSource] = useState<GitHubDataSource>('fallback');
  const [syncOutcome, setSyncOutcome] = useState<'success' | 'partial' | 'notUpdated' | null>(null);
  const isLiveConnected = reposSource === 'live' && profileSource === 'live';
  const sourceLabels: Record<GitHubDataSource, string> = language === 'id'
    ? { live: 'Live', cached: 'Cache', fallback: 'Cadangan', unavailable: 'Tidak tersedia' }
    : { live: 'Live', cached: 'Cached', fallback: 'Fallback', unavailable: 'Unavailable' };

  // Fetch GitHub repos and contributions on mount
  useEffect(() => {
    let isMounted = true;

    async function loadGitHub() {
      try {
        const [gitHubData, contribsData] = await Promise.all([
          fetchGitHubData(false),
          fetchGitHubContributions(false),
        ]);
        if (isMounted) {
          setGithubRepos(gitHubData.repos);
          setGithubProfile(gitHubData.profile);
          setContributionData(contribsData);
          setLastSynced(gitHubData.reposLastSyncedAt);
          setReposSource(gitHubData.reposSource);
          setProfileSource(gitHubData.profileSource);
        }
      } catch (err) {
        console.error('Failed to load GitHub data:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    loadGitHub();

    return () => {
      isMounted = false;
    };
  }, []);

  // Manual Refresh / Sync trigger
  const handleSyncWithGitHub = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncOutcome(null);

    try {
      const [gitHubData, contribsData] = await Promise.all([
        fetchGitHubData(true),
        fetchGitHubContributions(true),
      ]);
      setGithubRepos(gitHubData.repos);
      setGithubProfile(gitHubData.profile);
      setContributionData(contribsData);
      setLastSynced(gitHubData.reposLastSyncedAt);
      setReposSource(gitHubData.reposSource);
      setProfileSource(gitHubData.profileSource);
      const liveCount = [gitHubData.reposSource, gitHubData.profileSource, contribsData.source]
        .filter((source) => source === 'live').length;
      setSyncOutcome(liveCount === 3 ? 'success' : liveCount > 0 ? 'partial' : 'notUpdated');
      setTimeout(() => setSyncOutcome(null), 3000);
    } catch (err) {
      console.error('Failed to sync with GitHub:', err);
      setSyncOutcome('notUpdated');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">{t.projects.title}</h2>
          <p className="section__subtitle">{t.projects.subtitle}</p>
        </div>

        {/* GitHub Live Connection Banner */}
        <div className="github-sync-banner">
          <div className="github-sync-banner__left">
            <div className="github-sync-avatar-wrap">
              <img
                src={githubProfile.avatar_url}
                alt={githubProfile.name}
                className="github-sync-avatar"
              />
              <span className={`github-status-pulse ${isLiveConnected ? 'active' : ''}`} />
            </div>

            <div className="github-sync-info">
              <div className="github-sync-headline">
                <a
                  href={githubProfile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-sync-username"
                  title="Open GitHub Profile"
                >
                  <GithubIcon size={16} />
                  <span>@{githubProfile.login}</span>
                </a>

                <span className="github-sync-tag">
                  <CircleDot size={11} className={isLiveConnected ? 'text-green' : ''} />
                  <span>{language === 'id' ? 'Repo' : 'Repos'}: {sourceLabels[reposSource]} · {language === 'id' ? 'Profil' : 'Profile'}: {sourceLabels[profileSource]}</span>
                </span>

                {lastSynced && (
                  <span className="github-sync-time">
                    {t.projects.githubLastUpdated}: {formatRelativeTime(lastSynced.toISOString(), language)}
                  </span>
                )}
              </div>

              <p className="github-sync-bio">
                {githubProfile.public_repos} {t.projects.githubReposCount}
                {githubProfile.bio ? ` · ${githubProfile.bio}` : ''}
              </p>
            </div>
          </div>

          <div className="github-sync-banner__actions">
            <button
              type="button"
              className={`button button--secondary button--small github-sync-btn ${
                isSyncing ? 'syncing' : ''
              }`}
              onClick={handleSyncWithGitHub}
              disabled={isSyncing}
              title={t.projects.githubSyncBtn}
            >
              {syncOutcome ? (
                <>
                  {syncOutcome === 'success' ? <Check size={14} className="text-green" /> : <RefreshCw size={14} />}
                  <span>{syncOutcome === 'success'
                    ? t.projects.githubSynced
                    : syncOutcome === 'partial'
                      ? (language === 'id' ? 'Sebagian diperbarui' : 'Partially updated')
                      : (language === 'id' ? 'Belum diperbarui' : 'Not updated')}</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} className={isSyncing ? 'spin-icon' : ''} />
                  <span>{isSyncing ? t.projects.githubSyncing : t.projects.githubSyncBtn}</span>
                </>
              )}
            </button>

            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--small button--flex"
            >
              <GithubIcon size={14} />
              <span>{t.projects.githubProfileBtn}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* GitHub User Contribution Activity Graph */}
        <GitHubContributionGraph data={contributionData} isLoading={isSyncing} />

        {/* Visual Interactive Skills & Tools Network Graph */}
        <TechNetworkGraph repos={githubRepos} />
      </div>
    </section>
  );
};
