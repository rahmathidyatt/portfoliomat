import React, { useState, useMemo, useRef } from 'react';
import { Activity, Flame, Trophy, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { GitHubContributionData, GitHubContributionDay } from '../types';
import { formatContributionDate } from '../services/githubService';

interface GitHubContributionGraphProps {
  data: GitHubContributionData | null;
  isLoading?: boolean;
}

type TimeframeOption = '12m' | '6m' | '3m';

export const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({
  data,
  isLoading = false,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  const [timeframe, setTimeframe] = useState<TimeframeOption>('12m');
  const [hoveredDay, setHoveredDay] = useState<{
    day: GitHubContributionDay;
    clientX: number;
    clientY: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter contributions by timeframe
  const filteredContributions = useMemo(() => {
    if (!data || !data.contributions || data.contributions.length === 0) {
      return [];
    }

    const allDays = data.contributions;
    if (timeframe === '3m') {
      return allDays.slice(-91); // ~13 weeks
    }
    if (timeframe === '6m') {
      return allDays.slice(-182); // ~26 weeks
    }
    return allDays; // full year (~52-53 weeks)
  }, [data, timeframe]);

  // Metric stats for the selected timeframe
  const activeStats = useMemo(() => {
    if (!data) {
      return {
        total: 0,
        currentStreak: 0,
        longestStreak: 0,
        peakDay: { date: '', count: 0 },
      };
    }

    if (timeframe === '12m') {
      return {
        total: data.totalContributions,
        currentStreak: data.currentStreak,
        longestStreak: data.longestStreak,
        peakDay: data.peakDay,
      };
    }

    // Recalculate for filtered range
    let total = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let peakDay = { date: '', count: 0 };

    filteredContributions.forEach((day) => {
      total += day.count;
      if (day.count > peakDay.count) {
        peakDay = { date: day.date, count: day.count };
      }
      if (day.count > 0) {
        tempStreak += 1;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    return {
      total,
      currentStreak: data.currentStreak,
      longestStreak,
      peakDay,
    };
  }, [data, filteredContributions, timeframe]);

  // Group into calendar weeks (Sunday=0 to Saturday=6)
  const { weeks, monthLabels } = useMemo(() => {
    if (filteredContributions.length === 0) {
      return { weeks: [], monthLabels: [] };
    }

    const resultWeeks: (GitHubContributionDay | null)[][] = [];
    const labels: { index: number; label: string }[] = [];

    let currentWeek: (GitHubContributionDay | null)[] = [];
    let lastMonth = -1;

    // Pad beginning of first week to align with correct day of week
    const firstDayDate = new Date(`${filteredContributions[0].date}T00:00:00`);
    const firstDayOfWeek = firstDayDate.getDay(); // 0 is Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    filteredContributions.forEach((day) => {
      const d = new Date(`${day.date}T00:00:00`);
      const month = d.getMonth();

      // Check if we entered a new month and haven't labeled it yet
      if (month !== lastMonth && currentWeek.length < 4) {
        const monthName = d.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
          month: 'short',
        });
        labels.push({
          index: resultWeeks.length,
          label: monthName,
        });
        lastMonth = month;
      }

      currentWeek.push(day);

      if (currentWeek.length === 7) {
        resultWeeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      resultWeeks.push(currentWeek);
    }

    return { weeks: resultWeeks, monthLabels: labels };
  }, [filteredContributions, language]);

  const handleCellMouseEnter = (
    day: GitHubContributionDay,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay({
      day,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top,
    });
  };

  const handleCellMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div className="github-contribution-card" ref={containerRef}>
      {/* Header bar: Title, badge, and timeframe selector */}
      <div className="github-contribution-header">
        <div className="github-contribution-title-wrap">
          <div className="github-contribution-badge">
            <Activity size={14} className="activity-pulse-icon" />
            <span>{t.projects.contributionsTitle}</span>
          </div>
          <p className="github-contribution-subtitle">
            {t.projects.contributionsSubtitle}
          </p>
        </div>

        <div className="github-contribution-timeframe-tabs" role="group" aria-label="Timeframe">
          <button
            type="button"
            className={`github-timeframe-btn ${timeframe === '12m' ? 'active' : ''}`}
            onClick={() => setTimeframe('12m')}
          >
            {t.projects.contributionsRange12M}
          </button>
          <button
            type="button"
            className={`github-timeframe-btn ${timeframe === '6m' ? 'active' : ''}`}
            onClick={() => setTimeframe('6m')}
          >
            {t.projects.contributionsRange6M}
          </button>
          <button
            type="button"
            className={`github-timeframe-btn ${timeframe === '3m' ? 'active' : ''}`}
            onClick={() => setTimeframe('3m')}
          >
            {t.projects.contributionsRange3M}
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="github-contribution-stats-grid">
        <div className="contribution-stat-card">
          <div className="contribution-stat-icon contribution-stat-icon--primary">
            <Zap size={16} />
          </div>
          <div className="contribution-stat-content">
            <div className="contribution-stat-number">{activeStats.total}</div>
            <div className="contribution-stat-label">
              {t.projects.contributionsTotal}
            </div>
            <div className="contribution-stat-sublabel">
              {timeframe === '12m'
                ? t.projects.contributionsPastYear
                : timeframe === '6m'
                ? t.projects.contributionsRange6M
                : t.projects.contributionsRange3M}
            </div>
          </div>
        </div>

        <div className="contribution-stat-card">
          <div className="contribution-stat-icon contribution-stat-icon--streak">
            <Flame size={16} />
          </div>
          <div className="contribution-stat-content">
            <div className="contribution-stat-number">
              {activeStats.currentStreak}{' '}
              <span className="unit">
                {activeStats.currentStreak === 1
                  ? t.projects.contributionsDay
                  : t.projects.contributionsDays}
              </span>
            </div>
            <div className="contribution-stat-label">
              {t.projects.contributionsCurrentStreak}
            </div>
            <div className="contribution-stat-sublabel">
              {language === 'id' ? 'Konsistensi aktif' : 'Active consistency'}
            </div>
          </div>
        </div>

        <div className="contribution-stat-card">
          <div className="contribution-stat-icon contribution-stat-icon--trophy">
            <Trophy size={16} />
          </div>
          <div className="contribution-stat-content">
            <div className="contribution-stat-number">
              {activeStats.longestStreak}{' '}
              <span className="unit">
                {activeStats.longestStreak === 1
                  ? t.projects.contributionsDay
                  : t.projects.contributionsDays}
              </span>
            </div>
            <div className="contribution-stat-label">
              {t.projects.contributionsLongestStreak}
            </div>
            <div className="contribution-stat-sublabel">
              {language === 'id' ? 'Rekor rentetan' : 'Record streak'}
            </div>
          </div>
        </div>

        <div className="contribution-stat-card">
          <div className="contribution-stat-icon contribution-stat-icon--peak">
            <Sparkles size={16} />
          </div>
          <div className="contribution-stat-content">
            <div className="contribution-stat-number">
              {activeStats.peakDay.count > 0 ? activeStats.peakDay.count : 0}{' '}
              <span className="unit">
                {activeStats.peakDay.count === 1
                  ? t.projects.contributionsCommit
                  : t.projects.contributionsCommits}
              </span>
            </div>
            <div className="contribution-stat-label">
              {t.projects.contributionsPeakDay}
            </div>
            <div className="contribution-stat-sublabel">
              {activeStats.peakDay.date
                ? formatContributionDate(activeStats.peakDay.date, language)
                : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Heatmap Grid Container */}
      <div className="github-heatmap-container">
        {isLoading ? (
          <div className="github-heatmap-loading">
            <div className="heatmap-skeleton-bar" />
          </div>
        ) : (
          <div className="github-heatmap-scroll">
            <div className="github-heatmap-inner">
              {/* Month row across the top */}
              <div className="heatmap-months-row">
                <div className="heatmap-days-spacer" />
                <div className="heatmap-months-track">
                  {monthLabels.map((m, idx) => (
                    <span
                      key={`${m.label}-${idx}`}
                      className="heatmap-month-label"
                      style={{
                        gridColumnStart: m.index + 1,
                      }}
                    >
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main matrix: Day labels on left + week columns */}
              <div className="heatmap-grid-body">
                {/* Day Labels column (Mon, Wed, Fri) */}
                <div className="heatmap-day-labels" aria-hidden="true">
                  <span className="heatmap-day-label" />
                  <span className="heatmap-day-label">{t.projects.contributionsDayMon}</span>
                  <span className="heatmap-day-label" />
                  <span className="heatmap-day-label">{t.projects.contributionsDayWed}</span>
                  <span className="heatmap-day-label" />
                  <span className="heatmap-day-label">{t.projects.contributionsDayFri}</span>
                  <span className="heatmap-day-label" />
                </div>

                {/* Week Columns */}
                <div
                  className="heatmap-weeks-container"
                  style={{
                    gridTemplateColumns: `repeat(${weeks.length}, minmax(11px, 1fr))`,
                  }}
                >
                  {weeks.map((week, wIdx) => (
                    <div key={`week-${wIdx}`} className="heatmap-week-col">
                      {week.map((day, dIdx) => {
                        if (!day) {
                          return (
                            <div
                              key={`empty-${wIdx}-${dIdx}`}
                              className="heatmap-cell heatmap-cell--empty"
                            />
                          );
                        }

                        return (
                          <div
                            key={day.date}
                            className={`heatmap-cell heatmap-cell--level-${day.level}`}
                            data-date={day.date}
                            data-count={day.count}
                            onMouseEnter={(e) => handleCellMouseEnter(day, e)}
                            onMouseLeave={handleCellMouseLeave}
                            tabIndex={0}
                            role="button"
                            aria-label={`${day.count} contributions on ${day.date}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend bar */}
        <div className="github-heatmap-footer">
          <div className="github-heatmap-live-indicator">
            <span className="pulse-dot" />
            <span>
              {language === 'id'
                ? 'Sinkronisasi riwayat komit @rahmathidyatt'
                : 'Synced commit patterns for @rahmathidyatt'}
            </span>
          </div>

          <div className="github-heatmap-legend">
            <span className="legend-text">{t.projects.contributionsLess}</span>
            <div className="legend-swatches">
              <span className="legend-swatch heatmap-cell--level-0" title="0" />
              <span className="legend-swatch heatmap-cell--level-1" title="1-2" />
              <span className="legend-swatch heatmap-cell--level-2" title="3-4" />
              <span className="legend-swatch heatmap-cell--level-3" title="5-6" />
              <span className="legend-swatch heatmap-cell--level-4" title="7+" />
            </div>
            <span className="legend-text">{t.projects.contributionsMore}</span>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && (
        <div
          className="heatmap-floating-tooltip"
          style={{
            left: `${hoveredDay.clientX}px`,
            top: `${hoveredDay.clientY - 10}px`,
          }}
        >
          <div className="tooltip-title">
            <strong>
              {hoveredDay.day.count > 0
                ? `${hoveredDay.day.count} ${
                    hoveredDay.day.count === 1
                      ? t.projects.contributionsCommit
                      : t.projects.contributionsCommits
                  }`
                : t.projects.contributionsNoActivity}
            </strong>{' '}
            {hoveredDay.day.count > 0 && `${t.projects.contributionsOn} `}
            <span>{formatContributionDate(hoveredDay.day.date, language)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
