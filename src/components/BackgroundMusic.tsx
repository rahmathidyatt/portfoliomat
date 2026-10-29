import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Disc } from 'lucide-react';
import { SempurnaAudioPlayer } from '../utils/sempurnaAudio';
import { useLanguage } from '../context/LanguageContext';

export const BackgroundMusic: React.FC = () => {
  const { language } = useLanguage();
  const playerRef = useRef<SempurnaAudioPlayer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const player = new SempurnaAudioPlayer((playing, muted) => {
      setIsPlaying(playing);
      setIsMuted(muted);
    });
    playerRef.current = player;

    // Attempt automatic autoplay upon opening
    try {
      player.play();
    } catch (e) {
      // Browser blocked autoplay
    }

    // Modern browsers require user gesture to unblock audio
    const handleFirstGesture = () => {
      if (playerRef.current && !playerRef.current.getPlaying()) {
        playerRef.current.play();
      }
      setHasInteracted(true);
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
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      player.destroy();
    };
  }, []);

  const handleTogglePlay = () => {
    if (playerRef.current) {
      playerRef.current.togglePlay();
    }
  };

  const handleToggleMute = () => {
    if (playerRef.current) {
      playerRef.current.toggleMute();
    }
  };

  return (
    <div
      className={`bg-music-player ${isPlaying ? 'is-playing' : ''} ${
        isExpanded ? 'is-expanded' : ''
      }`}
      role="region"
      aria-label="Background Music: Sempurna by Andra and The Backbone"
    >
      <div className="bg-music-inner">
        {/* Animated Disc / Music Icon */}
        <button
          type="button"
          className="bg-music-disc-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={
            language === 'id'
              ? 'Aransemen Musik Sempurna (Klik untuk buka/tutup info)'
              : 'Sempurna Acoustic Arrangement (Click to toggle details)'
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

        {/* Track details (visible when expanded or on hover) */}
        <div className="bg-music-info">
          <div className="bg-music-title-wrap">
            <span className="bg-music-title">Sempurna</span>
            <span className="bg-music-dot">·</span>
            <span className="bg-music-artist">Andra & The Backbone</span>
          </div>
          <span className="bg-music-tag">
            {language === 'id' ? 'Aransemen Akustik' : 'Acoustic Arrangement'}
          </span>
        </div>

        {/* Controls */}
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
