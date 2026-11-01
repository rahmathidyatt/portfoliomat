import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchGitHubData,
  fetchGitHubContributions,
  GITHUB_FALLBACK_REPOS,
  calculateContributionStats,
  isValidContributionTimeline,
} from './githubService';

const profile = {
  login: 'rahmathidyatt',
  name: 'Test User',
  avatar_url: 'https://example.com/a.png',
  html_url: 'https://github.com/rahmathidyatt',
  public_repos: 1,
  followers: 0,
  following: 0,
  bio: null,
};
const repo = {
  id: 123,
  name: 'tested-repo',
  full_name: 'rahmathidyatt/tested-repo',
  description: null,
  html_url: 'https://github.com/rahmathidyatt/tested-repo',
  homepage: null,
  language: 'TypeScript',
  stargazers_count: 0,
  forks_count: 0,
  updated_at: '2026-10-31T00:00:00Z',
  pushed_at: '2026-10-31T00:00:00Z',
  topics: [],
  fork: false,
};
const dayOffset = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
const sampleContributions = (length = 365, endingOffset = 0) =>
  Array.from({ length }, (_, index) => ({
    date: dayOffset(endingOffset - length + index + 1),
    count: index === length - 2 ? 2 : 0,
    level: index === length - 2 ? 2 as const : 0 as const,
  }));
const contributions = { contributions: sampleContributions() };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('GitHub success is live and preserves zero counts', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (input) =>
    json(String(input).includes('/repos?') ? [repo] : profile);

  const data = await fetchGitHubData(true);
  assert.equal(data.reposSource, 'live');
  assert.equal(data.profileSource, 'live');
  assert.equal(data.isLive, true);
  assert.equal(data.repos.length, 1);
  assert.equal(data.profile.followers, 0);
  assert.ok(data.reposLastSyncedAt instanceof Date);
});

test('partial API failure is reported as mixed live and fallback', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (input) =>
    String(input).includes('/repos?') ? json({ message: 'Rate limited' }, 403) : json(profile);

  const data = await fetchGitHubData(true);
  assert.equal(data.profileSource, 'live');
  assert.equal(data.reposSource, 'fallback');
  assert.equal(data.isLive, false);
  assert.equal(data.repos.length, GITHUB_FALLBACK_REPOS.length);
  assert.equal(data.reposLastSyncedAt, null);
});

test('HTTP failure for both resources is not reported as live', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => json({ message: 'Forbidden' }, 403);
  const data = await fetchGitHubData(true);
  assert.equal(data.reposSource, 'fallback');
  assert.equal(data.profileSource, 'fallback');
  assert.equal(data.isLive, false);
  assert.equal(data.lastSyncedAt, null);
});

test('contribution data is live only on a valid fresh response', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => json(contributions);
  const data = await fetchGitHubContributions(true);
  assert.equal(data.source, 'live');
  assert.equal(data.contributions.length, 365);
  assert.equal(data.totalContributions, 2);
  assert.ok(data.lastSyncedAt instanceof Date);
});

test('unavailable contribution API never invents missing days', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => json({ message: 'Service unavailable' }, 503);
  const data = await fetchGitHubContributions(true);
  assert.equal(data.source, 'unavailable');
  assert.deepEqual(data.contributions, []);
  assert.equal(data.lastSyncedAt, null);
});

test('cache is per resource and retains the original sync time on fallback', async (t) => {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const map = new Map<string, string>();
  const storage = {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value); },
    removeItem: (key: string) => { map.delete(key); },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  });

  globalThis.fetch = async (input) =>
    json(String(input).includes('/repos?') ? [repo] : profile);
  const first = await fetchGitHubData(true);
  assert.equal(first.reposSource, 'live');
  assert.equal(first.profileSource, 'live');

  globalThis.fetch = async () => { throw new Error('Offline'); };
  const cached = await fetchGitHubData();
  assert.equal(cached.reposSource, 'cached');
  assert.equal(cached.profileSource, 'cached');
  assert.equal(cached.lastSyncedAt?.getTime(), first.lastSyncedAt?.getTime());

  // Force-refresh failure still uses verified prior cache without changing its timestamp.
  const stale = await fetchGitHubData(true);
  assert.equal(stale.reposSource, 'cached');
  assert.equal(stale.profileSource, 'cached');
  assert.equal(stale.lastSyncedAt?.getTime(), first.lastSyncedAt?.getTime());

  const freshContributions = await fetchGitHubContributions(true);
  assert.equal(freshContributions.source, 'unavailable');
  assert.deepEqual(freshContributions.contributions, []);
});


test('rejects out-of-order, duplicate, missing, invalid and stale contribution days', () => {
  const valid = sampleContributions();
  assert.equal(isValidContributionTimeline(valid), true);

  const outOfOrder = [...valid];
  [outOfOrder[60], outOfOrder[61]] = [outOfOrder[61], outOfOrder[60]];
  assert.equal(isValidContributionTimeline(outOfOrder), false);

  const duplicate = [...valid];
  duplicate[60] = duplicate[59];
  assert.equal(isValidContributionTimeline(duplicate), false);

  const missing = [...valid];
  missing.splice(60, 1);
  assert.equal(isValidContributionTimeline(missing), false);

  const invalidDate = [...valid];
  invalidDate[60] = { ...invalidDate[60], date: '2026-02-30' };
  assert.equal(isValidContributionTimeline(invalidDate), false);
  assert.equal(isValidContributionTimeline(sampleContributions(365, -10)), false);
  assert.equal(isValidContributionTimeline(sampleContributions(365, 2)), false);
});

test('outdated remote history is unavailable rather than shown as up to date', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => json({ contributions: sampleContributions(365, -45) });
  const data = await fetchGitHubContributions(true);
  assert.equal(data.source, 'unavailable');
  assert.equal(data.currentStreak, 0);
  assert.deepEqual(data.contributions, []);
});

test('historical values do not masquerade as current streaks', () => {
  const stats = calculateContributionStats([
    { date: dayOffset(-11), count: 2, level: 1 },
    { date: dayOffset(-10), count: 3, level: 2 },
  ]);
  assert.equal(stats.currentStreak, 0);
  assert.equal(stats.totalContributions, 5);
  assert.equal(stats.longestStreak, 2);
});

test('old local history is not reused indefinitely after remote failure', async (t) => {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const map = new Map<string, string>();
  const values = contributions.contributions;
  const stats = calculateContributionStats(values);
  map.set('rahmathidyatt_github_contributions_v3', JSON.stringify({
    ...stats, contributions: values, source: 'live', lastSyncedAt: null,
  }));
  map.set('rahmathidyatt_github_contributions_time_v3', String(Date.now() - 48 * 60 * 60 * 1000));
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value); },
    removeItem: (key: string) => { map.delete(key); },
  } });
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  });
  globalThis.fetch = async () => { throw new Error('Offline'); };
  const data = await fetchGitHubContributions(true);
  assert.equal(data.source, 'unavailable');
  assert.deepEqual(data.contributions, []);
});

test('aborted contribution fetch is treated as unavailable, not as zero contributions', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => { throw new DOMException('Aborted', 'AbortError'); };
  const data = await fetchGitHubContributions(true);
  assert.equal(data.source, 'unavailable');
  assert.deepEqual(data.contributions, []);
});


test('requires near-year coverage and rejects a short response even if its last date is today', () => {
  assert.equal(isValidContributionTimeline(sampleContributions(365)), true);
  assert.equal(isValidContributionTimeline(sampleContributions(366)), true);
  assert.equal(isValidContributionTimeline(sampleContributions(360)), true);
  assert.equal(isValidContributionTimeline(sampleContributions(359)), false);
  assert.equal(isValidContributionTimeline(sampleContributions(90)), false);
  assert.equal(isValidContributionTimeline(sampleContributions(368)), false);
});

test('partial contribution API result does not appear as a complete past year', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => json({ contributions: sampleContributions(91) });
  const data = await fetchGitHubContributions(true);
  assert.equal(data.source, 'unavailable');
  assert.deepEqual(data.contributions, []);
  assert.equal(data.totalContributions, 0);
});

test('at Jakarta midnight, a stale yesterday-zero timeline must not claim an active streak', () => {
  const now = new Date('2026-11-01T18:30:00.000Z'); // 02 Nov, 01:30 WIB
  const days = [
    { date: '2026-10-31', count: 4, level: 2 as const },
    { date: '2026-11-01', count: 0, level: 0 as const },
  ];
  assert.equal(calculateContributionStats(days, now, 420).currentStreak, 0);
  assert.equal(calculateContributionStats(days, now, 0).currentStreak, 1);
});

test('local day ahead of UTC correctly accepts the current-day contribution', () => {
  const now = new Date('2026-11-01T18:30:00.000Z'); // 02 Nov, 01:30 WIB
  const days = [
    { date: '2026-11-01', count: 0, level: 0 as const },
    { date: '2026-11-02', count: 3, level: 2 as const },
  ];
  assert.equal(calculateContributionStats(days, now, 420).currentStreak, 1);
  assert.equal(calculateContributionStats(days, now, 0).currentStreak, 0);
});

test('western timezone trailing UTC uses the visitor calendar day, not UTC', () => {
  const now = new Date('2026-11-02T02:00:00.000Z'); // 01 Nov, 18:00 UTC-8
  const days = [
    { date: '2026-10-31', count: 4, level: 2 as const },
    { date: '2026-11-01', count: 0, level: 0 as const },
  ];
  assert.equal(calculateContributionStats(days, now, -480).currentStreak, 1);
  assert.equal(calculateContributionStats(days, now, 0).currentStreak, 0);
});
