import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowRight, Download, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const typedStrings = t.hero.typedStrings;

  const [currentText, setCurrentText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset indices on language change
  useEffect(() => {
    setStringIndex(0);
    setCharIndex(0);
    setCurrentText('');
    setIsDeleting(false);
  }, [language]);

  useEffect(() => {
    const fullText = typedStrings[stringIndex % typedStrings.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 85);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, 40);
      } else {
        setIsDeleting(false);
        setStringIndex((prev) => (prev + 1) % typedStrings.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, stringIndex, typedStrings]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-ambient-glow" aria-hidden="true" />

      <div className="container">
        <div className="hero-grid">
          {/* Hero Content */}
          <div className="hero-content">
            <div className="hero-badge-wrap">
              <span className="status-badge">
                <span className="status-indicator-dot" />
                {t.hero.badge}
              </span>
              <span className="location-indicator">
                <MapPin size={14} />
                {t.hero.location}
              </span>
            </div>

            <div className="hero-title-group">
              <p className="hero-greeting">{t.hero.greeting}</p>
              <h1 className="hero-name">{t.hero.name}</h1>
              <div className="hero-role-wrapper">
                <span className="hero-role-text">{currentText}</span>
                <span className="typed-cursor">|</span>
              </div>
            </div>

            <p className="hero-description">{t.hero.description}</p>

            <div className="hero-actions">
              <button
                type="button"
                onClick={() => scrollToSection('portfolio')}
                className="button button--flex"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight size={16} className="button__icon" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="button button--secondary button--flex"
              >
                <Mail size={16} />
                <span>{t.hero.ctaSecondary}</span>
              </button>

              <a
                download="CV_RahmatHidayat.pdf"
                href="/assets/cv/CV_RahmatHidayat.pdf"
                className="button button--outline button--flex"
              >
                <Download size={16} />
                <span>{t.hero.ctaCV}</span>
              </a>
            </div>

            {/* Quick Stats Strip */}
            <div className="hero-stats-strip">
              {t.hero.stats.map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual Avatar Card */}
          <div className="hero-visual">
            <div className="profile-card-wrapper">
              <div className="profile-glow-ring" aria-hidden="true" />
              <div className="profile-card-main">
                <img
                  src="/assets/img/foto.png"
                  alt="Rahmat Hidayat"
                  className="profile-img-fill"
                  loading="eager"
                />
              </div>

              {/* Floating Tech Badges */}
              <div className="floating-chip chip-1">
                <img src="/assets/img/logo/Python-logo.png" alt="Python" />
                <span>Python</span>
              </div>

              <div className="floating-chip chip-2">
                <img src="/assets/img/logo/git-icon.svg" alt="Git" />
                <span>Git & SQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-color-light)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: 'var(--smaller-font-size)',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              transition: 'all 0.2s ease',
            }}
            aria-label={t.hero.scrollCaption}
          >
            <span>{t.hero.scrollCaption}</span>
            <ArrowDown size={14} style={{ animation: 'floatGentle 2s infinite ease-in-out' }} />
          </button>
        </div>
      </div>
    </section>
  );
};
