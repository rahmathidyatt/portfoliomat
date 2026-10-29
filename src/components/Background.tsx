import React, { useState } from 'react';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

export const Background: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'education' | 'organization'>('education');

  const items = activeTab === 'education' ? t.background.education : t.background.work;

  return (
    <section className="section" id="background">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">{t.background.title}</h2>
          <p className="section__subtitle">{t.background.subtitle}</p>
        </div>

        {/* Tab Controls */}
        <div className="timeline-tabs-wrap" role="tablist">
          <button
            type="button"
            className={`timeline-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
            role="tab"
            aria-selected={activeTab === 'education'}
          >
            <GraduationCap size={18} />
            <span>{t.background.tabEducation}</span>
          </button>

          <button
            type="button"
            className={`timeline-tab-btn ${activeTab === 'organization' ? 'active' : ''}`}
            onClick={() => setActiveTab('organization')}
            role="tab"
            aria-selected={activeTab === 'organization'}
          >
            <Award size={18} />
            <span>{t.background.tabOrganization}</span>
          </button>
        </div>

        {/* Timeline Track */}
        <div className="timeline-track">
          {items.map((item, idx) => (
            <div key={idx} className="timeline-node">
              <div className="timeline-node__dot" aria-hidden="true" />
              <div className="timeline-card">
                <span className="timeline-card__date">
                  <Calendar size={13} />
                  {item.calendar}
                </span>
                <h3 className="timeline-card__title">{item.title}</h3>
                <h4 className="timeline-card__subtitle">{item.subtitle}</h4>
                {item.description && (
                  <p className="timeline-card__desc">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
