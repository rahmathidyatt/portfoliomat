import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  SlidersHorizontal,
  Clock,
  RefreshCw,
  Star,
  GitFork,
  Search,
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
import { getReadingTime } from '../utils/readingTime';
import {
  fetchGitHubData,
  fetchGitHubContributions,
  getLanguageColor,
  formatRelativeTime,
  GITHUB_FALLBACK_REPOS,
  GITHUB_FALLBACK_PROFILE,
  GITHUB_USERNAME,
} from '../services/githubService';
import { GitHubRepo, GitHubUserProfile, GitHubContributionData } from '../types';
import { GitHubContributionGraph } from './GitHubContributionGraph';
import { TechNetworkGraph } from './TechNetworkGraph';

export const Projects: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const INITIAL_REPO_COUNT = 6;

  // GitHub Live State
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>(GITHUB_FALLBACK_REPOS);
  const [githubProfile, setGithubProfile] = useState<GitHubUserProfile>(GITHUB_FALLBACK_PROFILE);
  const [contributionData, setContributionData] = useState<GitHubContributionData | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);
  const [justSyncedFeedback, setJustSyncedFeedback] = useState<boolean>(false);

  // Search & Filter for GitHub Repos
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const touchStartX = useRef<number | null>(null);

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
          setLastSynced(gitHubData.lastSyncedAt);
          setIsLiveConnected(gitHubData.isLive);
        }
      } catch (err) {
        console.error('Failed to load GitHub data:', err);
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
    setJustSyncedFeedback(false);

    try {
      const [gitHubData, contribsData] = await Promise.all([
        fetchGitHubData(true),
        fetchGitHubContributions(true),
      ]);
      setGithubRepos(gitHubData.repos);
      setGithubProfile(gitHubData.profile);
      setContributionData(contribsData);
      setLastSynced(gitHubData.lastSyncedAt);
      setIsLiveConnected(gitHubData.isLive);
      setJustSyncedFeedback(true);
      setTimeout(() => setJustSyncedFeedback(false), 3000);
    } catch (err) {
      console.error('Failed to sync with GitHub:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Distinct language list from repos
  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    githubRepos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, [githubRepos]);

  // Filtered live GitHub repositories
  const filteredGitHubRepos = useMemo(() => {
    return githubRepos.filter((repo) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.topics && repo.topics.some((tp) => tp.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesLang =
        selectedLanguage === 'all' ||
        (repo.language && repo.language.toLowerCase() === selectedLanguage.toLowerCase());

      return matchesSearch && matchesLang;
    });
  }, [githubRepos, searchQuery, selectedLanguage]);

  // Paginated/truncated repos list for minimalist view
  const displayedRepos = useMemo(() => {
    if (showAllRepos || searchQuery.trim() !== '' || selectedLanguage !== 'all') {
      return filteredGitHubRepos;
    }
    return filteredGitHubRepos.slice(0, INITIAL_REPO_COUNT);
  }, [filteredGitHubRepos, showAllRepos, searchQuery, selectedLanguage]);

  // Carousel navigation handlers
  const totalSlides = filteredGitHubRepos.length;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  // Reset slider index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [searchQuery, selectedLanguage]);

  // Keyboard navigation for carousel
  useEffect(() => {
    if (viewMode !== 'slider') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  // Live GitHub current slide
  const currentGitHubRepo = filteredGitHubRepos[currentIndex] || filteredGitHubRepos[0];
  const currentGitHubReadingTime = currentGitHubRepo
    ? getReadingTime(currentGitHubRepo.description || currentGitHubRepo.name, language)
    : null;

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
                  <span>{t.projects.githubSyncStatus}</span>
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
              {justSyncedFeedback ? (
                <>
                  <Check size={14} className="text-green" />
                  <span>{t.projects.githubSynced}</span>
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

        {/* Repositories Controls Bar */}
        <div className="projects-controls">
          <div />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="projects-mode-toggle" role="group" aria-label="Project view mode">
              <button
                type="button"
                className={`projects-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label={t.projects.viewModeGrid}
                title={t.projects.viewModeGrid}
              >
                <LayoutGrid size={14} />
                <span>{t.projects.viewModeGrid}</span>
              </button>

              <button
                type="button"
                className={`projects-mode-btn ${viewMode === 'slider' ? 'active' : ''}`}
                onClick={() => setViewMode('slider')}
                aria-label={t.projects.viewModeSlider}
                title={t.projects.viewModeSlider}
              >
                <SlidersHorizontal size={14} />
                <span>{t.projects.viewModeSlider}</span>
              </button>
            </div>

            <span className="projects-total-counter">
              {viewMode === 'slider'
                ? `${totalSlides > 0 ? currentIndex + 1 : 0} / ${totalSlides}`
                : `${totalSlides} ${totalSlides === 1 ? 'Repo' : 'Repos'}`}
            </span>
          </div>
        </div>

        {/* GitHub Filter & Search Toolbar */}
        <div className="github-filter-toolbar">
          <div className="github-search-wrap">
            <Search size={15} className="github-search-icon" />
            <input
              type="text"
              placeholder={t.projects.githubSearchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="github-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="github-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="github-language-chips">
            <button
              type="button"
              className={`github-lang-chip ${selectedLanguage === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('all')}
            >
              {t.projects.githubFilterAll}
            </button>
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`github-lang-chip ${selectedLanguage === lang ? 'active' : ''}`}
                onClick={() => setSelectedLanguage(lang)}
              >
                <span
                  className="lang-chip-dot"
                  style={{ backgroundColor: getLanguageColor(lang) }}
                />
                <span>{lang}</span>
              </button>
            ))}
          </div>
        </div>

        {/* REPOSITORIES CONTENT */}
        {filteredGitHubRepos.length === 0 ? (
          <div className="github-empty-state">
            <GithubIcon size={40} className="github-empty-icon" />
            <p className="github-empty-text">{t.projects.githubNoReposFound}</p>
            <button
              type="button"
              className="button button--secondary button--small"
              onClick={() => {
                setSearchQuery('');
                setSelectedLanguage('all');
              }}
            >
              {language === 'id' ? 'Reset Pencarian' : 'Reset Filters'}
            </button>
          </div>
        ) : viewMode === 'slider' && currentGitHubRepo ? (
          /* GitHub Repos Slider View */
          <div
            className="projects-carousel-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="carousel-slide-content">
              {/* Left Mock Preview Card */}
              <div className="github-repo-preview-card">
                <div className="repo-preview-header">
                  <div className="repo-preview-brand">
                    <GithubIcon size={28} />
                    <div>
                      <span className="repo-preview-owner">{GITHUB_USERNAME} /</span>
                      <h4 className="repo-preview-name">{currentGitHubRepo.name}</h4>
                    </div>
                  </div>
                  <span className="repo-live-pill">{t.projects.githubLiveBadge}</span>
                </div>

                <p className="repo-preview-desc">
                  {currentGitHubRepo.description ||
                    (language === 'id'
                      ? 'Repositori kode publik di akun GitHub resmi.'
                      : 'Public code repository on official GitHub account.')}
                </p>

                <div className="repo-preview-meta">
                  {currentGitHubRepo.language && (
                    <div className="repo-meta-item">
                      <span
                        className="repo-meta-dot"
                        style={{ backgroundColor: getLanguageColor(currentGitHubRepo.language) }}
                      />
                      <span>{currentGitHubRepo.language}</span>
                    </div>
                  )}
                  <div className="repo-meta-item">
                    <Star size={13} />
                    <span>{currentGitHubRepo.stargazers_count}</span>
                  </div>
                  <div className="repo-meta-item">
                    <GitFork size={13} />
                    <span>{currentGitHubRepo.forks_count}</span>
                  </div>
                </div>

                {currentGitHubRepo.topics && currentGitHubRepo.topics.length > 0 && (
                  <div className="repo-preview-topics">
                    {currentGitHubRepo.topics.slice(0, 4).map((topic, i) => (
                      <span key={i} className="repo-topic-tag">
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Details */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="project-tagline">
                  {currentGitHubRepo.language || 'GitHub Repository'} ·{' '}
                  {formatRelativeTime(currentGitHubRepo.updated_at, language)}
                </span>
                <h3 className="project-title" style={{ fontSize: 'var(--h2-font-size)' }}>
                  {currentGitHubRepo.name.replace(/[-_]/g, ' ')}
                </h3>
                <p className="project-desc">
                  {currentGitHubRepo.description ||
                    (language === 'id'
                      ? 'Proyek repositori publik aktif yang terhubung secara dinamis dari GitHub.'
                      : 'Active public repository project linked dynamically from GitHub.')}
                </p>

                {/* Carousel Card Bottom Footer with Reading Time & CTA */}
                <div className="carousel-card-footer">
                  {currentGitHubReadingTime && (
                    <div
                      className="project-reading-time"
                      title={`${t.projects.readingTimeLabel}: ${currentGitHubReadingTime.formattedTime}`}
                    >
                      <Clock size={13} aria-hidden="true" />
                      <span>{currentGitHubReadingTime.formattedTime}</span>
                      <span className="reading-time-sep" aria-hidden="true">·</span>
                      <span>{currentGitHubReadingTime.wordCount} {t.projects.wordsLabel}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    {currentGitHubRepo.homepage && (
                      <a
                        href={currentGitHubRepo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button--secondary button--flex"
                      >
                        <span>{t.projects.githubLiveDemo}</span>
                        <ExternalLink size={14} />
                      </a>
                    )}

                    <a
                      href={currentGitHubRepo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button--flex"
                    >
                      <GithubIcon size={15} />
                      <span>{t.projects.sourceCode}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              className="carousel-nav-btn prev"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              aria-label={t.projects.prevAria}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="carousel-nav-btn next"
              onClick={nextSlide}
              disabled={currentIndex === filteredGitHubRepos.length - 1}
              aria-label={t.projects.nextAria}
            >
              <ChevronRight size={20} />
            </button>

            {/* Dot bullets */}
            <div className="carousel-dots">
              {filteredGitHubRepos.slice(0, 8).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              {filteredGitHubRepos.length > 8 && (
                <span style={{ fontSize: 'var(--smaller-font-size)', color: 'var(--text-color-light)', marginLeft: '0.5rem' }}>
                  +{filteredGitHubRepos.length - 8}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* GitHub Repos Grid View */
          <>
            <div className="projects-grid-view">
              {displayedRepos.map((repo) => {
                const readingTime = getReadingTime(repo.description || repo.name, language);

                return (
                  <article key={repo.id} className="project-item-card github-repo-card">
                    <div className="github-repo-card__header">
                      <div className="github-repo-card__lang">
                        {repo.language ? (
                          <>
                            <span
                              className="repo-lang-dot"
                              style={{ backgroundColor: getLanguageColor(repo.language) }}
                            />
                            <span>{repo.language}</span>
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-color-light)' }}>Project</span>
                        )}
                      </div>

                      <div className="github-repo-card__stats">
                        <span title={`${repo.stargazers_count} ${t.projects.githubStars}`}>
                          <Star size={13} />
                          {repo.stargazers_count}
                        </span>
                        <span title={`${repo.forks_count} ${t.projects.githubForks}`}>
                          <GitFork size={13} />
                          {repo.forks_count}
                        </span>
                      </div>
                    </div>

                    <div className="project-item-card__body">
                      <div>
                        <h3 className="project-title github-repo-card__title">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="repo-title-link"
                          >
                            <GithubIcon size={18} className="repo-title-icon" />
                            <span>{repo.name}</span>
                          </a>
                        </h3>

                        <p className="project-desc github-repo-card__desc">
                          {repo.description ||
                            (language === 'id'
                              ? 'Repositori kode sumber terbuka yang dihosting di GitHub.'
                              : 'Open source code repository hosted on GitHub.')}
                        </p>

                        {repo.topics && repo.topics.length > 0 && (
                          <div className="github-repo-topics">
                            {repo.topics.slice(0, 3).map((topic, i) => (
                              <span key={i} className="repo-topic-pill">
                                #{topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid-card-footer">
                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' }}>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button--secondary button--small button--flex"
                            style={{ flexGrow: 1 }}
                          >
                            <GithubIcon size={13} />
                            <span>{t.projects.sourceCode}</span>
                            <ExternalLink size={13} />
                          </a>

                          {repo.homepage && (
                            <a
                              href={repo.homepage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="button button--small button--flex"
                              title="Open Live Demo"
                            >
                              <span>Demo</span>
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>

                        <div className="grid-card-footer__meta">
                          <div
                            className="project-reading-time"
                            title={`${t.projects.readingTimeLabel}: ${readingTime.formattedTime}`}
                          >
                            <Clock size={12} aria-hidden="true" />
                            <span>{readingTime.formattedTime}</span>
                            <span className="reading-time-sep" aria-hidden="true">·</span>
                            <span>{readingTime.wordCount} {t.projects.wordsLabel}</span>
                          </div>

                          <span className="repo-updated-time">
                            {t.projects.githubLastUpdated}{' '}
                            {formatRelativeTime(repo.updated_at, language)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* View All Repositories Toggle Button */}
            {!searchQuery.trim() && selectedLanguage === 'all' && filteredGitHubRepos.length > INITIAL_REPO_COUNT && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.25rem' }}>
                <button
                  type="button"
                  className="button button--secondary button--flex"
                  onClick={() => setShowAllRepos(!showAllRepos)}
                  style={{ padding: '0.65rem 1.85rem' }}
                >
                  <span>
                    {showAllRepos
                      ? (language === 'id' ? 'Tampilkan Lebih Sedikit' : 'Show Less')
                      : (language === 'id'
                          ? `Lihat Semua Repositori (${filteredGitHubRepos.length})`
                          : `View All Repositories (${filteredGitHubRepos.length})`)}
                  </span>
                  {showAllRepos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
