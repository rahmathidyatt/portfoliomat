import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrap">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>Rahmat Hidayat<span style={{ color: 'var(--first-color)' }}>.</span></h2>
            <p>{t.footer.tagline}</p>
          </div>

          <div className="footer-social-links">
            <a
              href="https://github.com/rahmathidyatt"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="GitHub Profile"
              title="GitHub"
            >
              <i className="uil uil-github"></i>
            </a>

            <a
              href="https://www.linkedin.com/in/rahmat-hidayat-13229a1a2/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="LinkedIn Profile"
              title="LinkedIn"
            >
              <i className="uil uil-linkedin"></i>
            </a>

            <a
              href="https://www.instagram.com/rahmathidyatt_/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Instagram Profile"
              title="Instagram"
            >
              <i className="uil uil-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t.footer.copy}</p>

          <button
            type="button"
            onClick={scrollToTop}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-color)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: 'var(--smaller-font-size)',
              fontWeight: 500,
              transition: 'color 0.2s ease',
            }}
          >
            <span>{t.footer.backToTop}</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
