import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Disc, ExternalLink } from 'lucide-react';
import {
  SempurnaAudioPlayer,
  BACKGROUND_TRACK_META,
  YOUTUBE_VIDEO_ID,
  YOUTUBE_TRACK_URL,
} from '../utils/sempurnaAudio';
import { useLanguage } from '../context/LanguageContext';

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: () => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState?: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const BackgroundMusic: React.FC = () => {
  const { language } = useLanguage();
  const synthPlayerRef = useRef<SempurnaAudioPlayer | null>(null);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const usingYouTubeRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const stopSynthFallback = useCallback(() => {
    if (synthPlayerRef.current && synthPlayerRef.current.getPlaying()) {
      synthPlayerRef.current.pause();
    }
  }, []);

  useEffect(() => {
    // Initialize acoustic instrumental synthesizer fallback
    const synthPlayer = new SempurnaAudioPlayer((playing, muted) => {
      if (!usingYouTubeRef.current) {
        setIsPlaying(playing);
        setIsMuted(muted);
      }
    });
    synthPlayerRef.current = synthPlayer;

    // Load YouTube IFrame API for https://youtu.be/PCS9DI7fsUY?si=kNZSdKJiO-XBTgmR
    let isMounted = true;

    const initYouTubePlayer = () => {
      if (!isMounted || !window.YT || !window.YT.Player || !ytContainerRef.current) return;
      if (ytPlayerRef.current) return;

      try {
        ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 1,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              event.target.setVolume(35);
              try {
                event.target.playVideo();
              } catch {
                // Autoplay may wait for user interaction
              }
            },
            onStateChange: (event) => {
              if (!isMounted) return;
              // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
              if (event.data === 1) {
                usingYouTubeRef.current = true;
                stopSynthFallback();
                setIsPlaying(true);
                setIsMuted(event.target.isMuted());
              } else if (event.data === 2) {
                if (usingYouTubeRef.current) {
                  setIsPlaying(false);
                }
              } else if (event.data === 0) {
                event.target.playVideo();
              }
            },
            onError: () => {
              if (!isMounted) return;
              usingYouTubeRef.current = false;
            },
          },
        });
      } catch {
        usingYouTubeRef.current = false;
      }
    };

    if (window.YT && window.YT.Player) {
      initYouTubePlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initYouTubePlayer();
      };
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }
    }

    // Attempt initial playback
    try {
      synthPlayer.play();
    } catch {
      // Autoplay blocked until gesture
    }

    // Retry playback after first user interaction
    const handleFirstGesture = () => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try {
          const state = ytPlayerRef.current.getPlayerState?.();
          if (state !== 1) {
            ytPlayerRef.current.playVideo();
          }
        } catch {
          // Ignore YT iframe error
        }
      }
      if (!usingYouTubeRef.current && synthPlayerRef.current && !synthPlayerRef.current.getPlaying()) {
        synthPlayerRef.current.play();
      }

      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true });

    return () => {
      isMounted = false;
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);

      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // Ignore cleanup errors
        }
      }
      ytPlayerRef.current = null;
      synthPlayerRef.current = null;
      synthPlayer.destroy();
    };
  }, [stopSynthFallback]);

  const handleTogglePlay = () => {
    if (usingYouTubeRef.current && ytPlayerRef.current) {
      try {
        const state = ytPlayerRef.current.getPlayerState();
        if (state === 1) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
        return;
      } catch {
        usingYouTubeRef.current = false;
      }
    }

    // Also try starting YT player if ready, while toggling synth for immediate responsiveness
    if (ytPlayerRef.current && !isPlaying) {
      try {
        ytPlayerRef.current.playVideo();
      } catch {
        // Fallback to synth
      }
    } else if (ytPlayerRef.current && isPlaying) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch {
        // Ignore
      }
    }

    if (synthPlayerRef.current) {
      synthPlayerRef.current.togglePlay();
    }
  };

  const handleToggleMute = () => {
    if (usingYouTubeRef.current && ytPlayerRef.current) {
      try {
        if (ytPlayerRef.current.isMuted()) {
          ytPlayerRef.current.unMute();
          setIsMuted(false);
        } else {
          ytPlayerRef.current.mute();
          setIsMuted(true);
        }
      } catch {
        // Ignore
      }
    }

    if (synthPlayerRef.current) {
      synthPlayerRef.current.toggleMute();
    }
  };

  return (
    <div
      className={`bg-music-player ${isPlaying ? 'is-playing' : ''} ${
        isExpanded ? 'is-expanded' : ''
      }`}
      role="region"
      aria-label={`Background Music: ${BACKGROUND_TRACK_META.title} by ${BACKGROUND_TRACK_META.artist}`}
    >
      {/* Hidden YouTube IFrame Audio Engine */}
      <div className="bg-music-yt-hidden" aria-hidden="true">
        <div ref={ytContainerRef} id="bg-youtube-audio-player" />
      </div>

      {/* Expanded Track Details Drawer */}
      {isExpanded && (
        <div className="bg-music-yt-drawer open">
          <div className="bg-music-card-preview">
            <img
              src={BACKGROUND_TRACK_META.thumbnailUrl}
              alt={BACKGROUND_TRACK_META.title}
              className="bg-music-card-thumb"
            />
            <div className="bg-music-card-meta">
              <span className="bg-music-card-title">{BACKGROUND_TRACK_META.title}</span>
              <span className="bg-music-card-artist">{BACKGROUND_TRACK_META.artist}</span>
              <a
                href={YOUTUBE_TRACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-music-yt-link"
                title={
                  language === 'id'
                    ? 'Dengarkan di YouTube'
                    : 'Listen on YouTube'
                }
              >
                <span>{language === 'id' ? 'Buka di YouTube' : 'Listen on YouTube'}</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="bg-music-inner">
        {/* Animated Disc */}
        <button
          type="button"
          className="bg-music-disc-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={
            language === 'id'
              ? `${BACKGROUND_TRACK_META.title} - ${BACKGROUND_TRACK_META.artist} (Klik untuk buka/tutup pemutar YouTube)`
              : `${BACKGROUND_TRACK_META.title} - ${BACKGROUND_TRACK_META.artist} (Click to toggle YouTube player)`
          }
          aria-label={
            language === 'id'
              ? 'Buka atau tutup detail musik latar'
              : 'Toggle background music details'
          }
          aria-expanded={isExpanded}
        >
          <div className={`music-disc-icon ${isPlaying ? 'spinning' : ''}`}>
            <Disc size={18} />
          </div>

          {isPlaying && (
            <div className="music-sound-bars" aria-hidden="true">
              <span className="bar bar-1" />
              <span className="bar bar-2" />
              <span className="bar bar-3" />
            </div>
          )}
        </button>

        {/* Track information */}
        <div className="bg-music-info">
          <div className="bg-music-title-wrap">
            <span className="bg-music-title">{BACKGROUND_TRACK_META.shortTitle}</span>
            <span className="bg-music-dot">·</span>
            <span className="bg-music-artist">{BACKGROUND_TRACK_META.artist}</span>
          </div>

          <span className="bg-music-tag">
            {language === 'id'
              ? BACKGROUND_TRACK_META.subtitleId
              : BACKGROUND_TRACK_META.subtitleEn}
          </span>
        </div>

        {/* Playback controls */}
        <div className="bg-music-actions">
          <button
            type="button"
            className="bg-music-ctrl-btn"
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            type="button"
            className="bg-music-ctrl-btn"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute Music' : 'Mute Music'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
