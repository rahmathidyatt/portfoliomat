import React, { useState } from 'react';
import { Code, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { TECH_SKILLS } from '../data/portfolioData';

export const Skills: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<'all' | 'tech' | 'soft'>('all');
  const [softSkillsExpanded, setSoftSkillsExpanded] = useState(false);
  const [techSkillsExpanded, setTechSkillsExpanded] = useState(false);

  const visibleSoftSkills = softSkillsExpanded
    ? t.skills.softSkillsList
    : t.skills.softSkillsList.filter((s) => !s.isHiddenByDefault);

  const visibleTechSkills = techSkillsExpanded
    ? TECH_SKILLS
    : TECH_SKILLS.filter((s) => !s.isHiddenByDefault);

  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section__header">
          <span className="section__kicker">{t.skills.kicker}</span>
          <h2 className="section__title">{t.skills.title}</h2>
          <p className="section__subtitle">{t.skills.subtitle}</p>
        </div>

        {/* Filter Bar */}
        <div className="skills-filter-bar" role="tablist">
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
            role="tab"
            aria-selected={activeFilter === 'all'}
          >
            {t.skills.filterAll}
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveFilter('tech')}
            role="tab"
            aria-selected={activeFilter === 'tech'}
          >
            {t.skills.filterTech}
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'soft' ? 'active' : ''}`}
            onClick={() => setActiveFilter('soft')}
            role="tab"
            aria-selected={activeFilter === 'soft'}
          >
            {t.skills.filterSoft}
          </button>
        </div>

        <div className="skills-layout-grid">
          {/* Technical Stack Panel */}
          {(activeFilter === 'all' || activeFilter === 'tech') && (
            <div className="skills-panel">
              <div className="skills-panel__header">
                <div className="skills-panel__icon">
                  <Code size={22} />
                </div>
                <div>
                  <h3 className="skills-panel__title">{t.skills.techSkillsTitle}</h3>
                  <p className="skills-panel__desc">{t.skills.techSkillsSubtitle}</p>
                </div>
              </div>

              <div className="tech-grid-list">
                {visibleTechSkills.map((tech, index) => {
                  const levelLabel =
                    t.skills.levels[tech.level as keyof typeof t.skills.levels] || tech.level;

                  return (
                    <div key={index} className="tech-card-item">
                      <div className="tech-card-item__logo">
                        <img
                          src={tech.logo}
                          alt={`${tech.name} logo`}
                          loading="lazy"
                        />
                      </div>
                      <div className="tech-card-item__info">
                        <h4>{tech.name}</h4>
                        <span>{levelLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="skills-toggle-btn"
                onClick={() => setTechSkillsExpanded((prev) => !prev)}
                aria-expanded={techSkillsExpanded}
              >
                <span>{techSkillsExpanded ? t.skills.showLess : t.skills.showAll}</span>
                {techSkillsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          )}

          {/* Soft Skills Panel */}
          {(activeFilter === 'all' || activeFilter === 'soft') && (
            <div className="skills-panel">
              <div className="skills-panel__header">
                <div className="skills-panel__icon">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="skills-panel__title">{t.skills.softSkillsTitle}</h3>
                  <p className="skills-panel__desc">{t.skills.softSkillsSubtitle}</p>
                </div>
              </div>

              <div className="soft-skills-flow">
                {visibleSoftSkills.map((skill, index) => (
                  <div key={index} className="soft-skill-row">
                    <div className="soft-skill-row__header">
                      <span className="soft-skill-row__name">{skill.name}</span>
                    </div>
                    {skill.desc && (
                      <p className="soft-skill-row__desc">{skill.desc}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="skills-toggle-btn"
                onClick={() => setSoftSkillsExpanded((prev) => !prev)}
                aria-expanded={softSkillsExpanded}
              >
                <span>{softSkillsExpanded ? t.skills.showLess : t.skills.showAll}</span>
                {softSkillsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
