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
  generateFallbackContributions,
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
  assert.equal(
    extractYouTubeVideoId('https://youtu.be/PCS9DI7fsUY?si=kNZSdKJiO-XBTgmR'),
    'PCS9DI7fsUY'
  );
  assert.equal(
    extractYouTubeVideoId('https://www.youtube.com/watch?v=PCS9DI7fsUY'),
    'PCS9DI7fsUY'
  );
  assert.equal(
    extractYouTubeVideoId('https://www.youtube.com/embed/PCS9DI7fsUY'),
    'PCS9DI7fsUY'
  );
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

test('GitHub contribution stats and peak day date formatting work accurately', () => {
  const days = generateFallbackContributions();
  const stats = calculateContributionStats(days);
  assert.ok(stats.totalContributions > 0);
  assert.equal(stats.peakDay.date, '2025-12-02');
  assert.equal(stats.peakDay.count, 19);
  assert.equal(formatContributionDate('2025-12-02', 'en'), 'Tuesday, Dec 2, 2025');
});
