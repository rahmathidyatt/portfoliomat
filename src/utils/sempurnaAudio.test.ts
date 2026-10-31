import test from 'node:test';
import assert from 'node:assert/strict';
import {
  YOUTUBE_TRACK_URL,
  YOUTUBE_VIDEO_ID,
  BACKGROUND_TRACK_META,
  extractYouTubeVideoId,
  buildYouTubeEmbedUrl,
  generateSempurnaScore,
} from './sempurnaAudio';
import { translations } from '../data/translations';
import {
  calculateContributionStats,
  formatContributionDate,
} from '../services/githubService';

test('YouTube background music configuration matches requested track', () => {
  assert.equal(YOUTUBE_TRACK_URL, 'https://youtu.be/PCS9DI7fsUY?si=kNZSdKJiO-XBTgmR');
  assert.equal(YOUTUBE_VIDEO_ID, 'PCS9DI7fsUY');
  assert.equal(extractYouTubeVideoId(YOUTUBE_TRACK_URL), 'PCS9DI7fsUY');
  assert.equal(BACKGROUND_TRACK_META.title, 'Sempurna (Acoustic Instrumental)');
  assert.equal(BACKGROUND_TRACK_META.artist, 'Killercats');
});

test('extractYouTubeVideoId parses standard and short URLs', () => {
  assert.equal(extractYouTubeVideoId('https://youtu.be/PCS9DI7fsUY?si=kNZSdKJiO-XBTgmR'), 'PCS9DI7fsUY');
  assert.equal(extractYouTubeVideoId('https://www.youtube.com/watch?v=PCS9DI7fsUY'), 'PCS9DI7fsUY');
  assert.equal(extractYouTubeVideoId('https://www.youtube.com/embed/PCS9DI7fsUY'), 'PCS9DI7fsUY');
});

test('buildYouTubeEmbedUrl generates valid looping embed URL', () => {
  const url = buildYouTubeEmbedUrl('PCS9DI7fsUY', true, false);
  assert.ok(url.startsWith('https://www.youtube.com/embed/PCS9DI7fsUY?'));
  assert.ok(url.includes('playlist=PCS9DI7fsUY'));
  assert.ok(url.includes('loop=1'));
});

test('hero translations no longer include the removed quick stats metrics', () => {
  assert.equal('stats' in translations.en.hero, false);
  assert.equal('stats' in translations.id.hero, false);
});

test('generateSempurnaScore returns non-empty note sequence', () => {
  const score = generateSempurnaScore();
  assert.ok(score.length > 50);
});

test('GitHub contribution statistics use deterministic sample data', () => {
  const days = [
    { date: '2026-10-01', count: 0, level: 0 as const },
    { date: '2026-10-02', count: 2, level: 2 as const },
    { date: '2026-10-03', count: 4, level: 3 as const },
    { date: '2026-10-04', count: 0, level: 0 as const },
    { date: '2026-10-05', count: 3, level: 2 as const },
  ];

  const stats = calculateContributionStats(days);
  assert.equal(stats.totalContributions, 9);
  assert.equal(stats.currentStreak, 1);
  assert.equal(stats.longestStreak, 2);
  assert.deepEqual(stats.peakDay, { date: '2026-10-03', count: 4 });
  assert.equal(formatContributionDate('2025-12-02', 'en'), 'Tuesday, Dec 2, 2025');
});

