import React from 'react';
import { Download, GraduationCap, Compass, Briefcase, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const About: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const getFactIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Sparkles size={18} style={{ color: 'var(--first-color)' }} />;
      case 1:
        return <GraduationCap size={18} style={{ color: 'var(--first-color)' }} />;
      case 2:
        return <Compass size={18} style={{ color: 'var(--first-color)' }} />;
      default:
        return <Briefcase size={18} style={{ color: 'var(--first-color)' }} />;
    }
  };

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section__header">
          <span className="section__kicker">{t.about.kicker}</span>
          <h2 className="section__title">{t.about.title}</h2>
          <p className="section__subtitle">{t.about.subtitle}</p>
        </div>

        <div className="about-grid">
          {/* Photo Frame */}
          <div className="about-photo-wrapper">
            <img
              src="/assets/img/about.jpg"
              alt="Rahmat Hidayat in professional setting"
              loading="lazy"
            />
          </div>

          {/* Bio & Highlights */}
          <div className="about-content">
            <p className="about-bio-text">{t.about.bioP1}</p>
            <p className="about-bio-text">{t.about.bioP2}</p>

            {/* Quick highlights */}
            <div className="highlights-grid">
              {t.about.facts.map((fact, idx) => (
                <div key={idx} className="highlight-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                    {getFactIcon(idx)}
                    <span className="highlight-box__title">{fact.label}</span>
                  </div>
                  <div className="highlight-box__value">{fact.value}</div>
                </div>
              ))}
            </div>

            <div>
              <a
                download="CV_RahmatHidayat.pdf"
                href="/assets/cv/CV_RahmatHidayat.pdf"
                className="button button--flex"
              >
                <Download size={16} />
                <span>{t.about.downloadCV}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
