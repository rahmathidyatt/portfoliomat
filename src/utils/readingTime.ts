/**
 * Utility to calculate estimated reading time for text content.
 * Standard adult silent reading speed is ~200-250 words per minute (~3.3 words/sec).
 */

export interface ReadingTimeInfo {
  wordCount: number;
  seconds: number;
  minutes: number;
  formattedTime: string;
}

export function getReadingTime(text: string, language: 'en' | 'id' = 'en'): ReadingTimeInfo {
  if (!text || !text.trim()) {
    return {
      wordCount: 0,
      seconds: 0,
      minutes: 0,
      formattedTime: language === 'id' ? '< 1 mnt baca' : '< 1 min read',
    };
  }

  // Count words by splitting on whitespace
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Reading speed: 200 words per minute
  const totalSeconds = Math.max(3, Math.round((wordCount / 200) * 60));
  const minutes = Math.ceil(wordCount / 200);

  let formattedTime = '';
  if (language === 'id') {
    if (wordCount < 50) {
      formattedTime = `~${totalSeconds} dtk baca`;
    } else if (minutes <= 1) {
      formattedTime = '< 1 mnt baca';
    } else {
      formattedTime = `~${minutes} mnt baca`;
    }
  } else {
    if (wordCount < 50) {
      formattedTime = `~${totalSeconds} sec read`;
    } else if (minutes <= 1) {
      formattedTime = '< 1 min read';
    } else {
      formattedTime = `~${minutes} min read`;
    }
  }

  return {
    wordCount,
    seconds: totalSeconds,
    minutes,
    formattedTime,
  };
}
