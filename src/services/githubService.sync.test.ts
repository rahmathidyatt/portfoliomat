import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchGitHubData,
  fetchGitHubContributions,
  GITHUB_FALLBACK_REPOS,
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
const contributions = {
  contributions: [
    { date: '2026-10-30', count: 2, level: 2 },
    { date: '2026-10-31', count: 0, level: 0 },
  ],
};

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
  assert.equal(data.contributions.length, 2);
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
