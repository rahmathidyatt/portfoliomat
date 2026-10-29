import React from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const About: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">{t.about.title}</h2>
          <p className="section__subtitle">{t.about.subtitle}</p>
        </div>

        <div className="about-grid">
          {/* Photo Frame */}
          <div className="about-photo-wrapper">
            <img
              src="/assets/img/about.jpg"
              alt="Professional setting"
              loading="lazy"
            />
          </div>

          {/* Bio Content */}
          <div className="about-content">
            <p className="about-bio-text">{t.about.bioP1}</p>
            <p className="about-bio-text">{t.about.bioP2}</p>

            <div className="about-cta-wrap">
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
