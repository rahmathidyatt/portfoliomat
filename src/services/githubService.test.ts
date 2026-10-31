import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateContributionStats, getLanguageColor } from './githubService';

test('service tests are discovered outside src/utils', () => {
  assert.equal(getLanguageColor('TypeScript'), '#3178c6');
  assert.equal(getLanguageColor('Unknown-Language'), 'var(--first-color)');
});

test('contribution stats handle days without activity', () => {
  const result = calculateContributionStats([
    { date: '2026-10-01', count: 0, level: 0 },
    { date: '2026-10-02', count: 0, level: 0 },
  ]);
  assert.equal(result.totalContributions, 0);
  assert.equal(result.currentStreak, 0);
  assert.equal(result.longestStreak, 0);
});
