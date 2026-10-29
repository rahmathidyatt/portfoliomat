import React, { useState } from 'react';
import { SOFT_SKILLS, TECH_SKILLS } from '../data/portfolioData';

export const Skills: React.FC = () => {
  const [softSkillsExpanded, setSoftSkillsExpanded] = useState(false);
  const [techSkillsExpanded, setTechSkillsExpanded] = useState(false);

  return (
    <section className="skills section" id="skills">
      <h2 className="section__title">Skills</h2>
      <span className="section__subtitle">Soft Skills & Technical Skills</span>

      <div className="skills__container container skills-grid-pro">
        {/* Soft Skills Card */}
        <article className={`skills-card ${softSkillsExpanded ? 'is-expanded' : ''}`} data-skill-card>
          <div className="skills-card__header">
            <div className="skills-card__icon">
              <i className="uil uil-brackets-curly"></i>
            </div>
            <div>
              <h3 className="skills-card__title">Soft Skills</h3>
              <p className="skills-card__subtitle">Personal strengths for collaboration and problem solving.</p>
            </div>
          </div>

          <div className="skills-card__list">
            {SOFT_SKILLS.map((skill, index) => (
              <span
                key={index}
                className={`skill-pill ${skill.isHiddenByDefault ? 'skill-item is-hidden' : ''}`}
              >
                {skill.name}
              </span>
            ))}
          </div>

          <button
            className="skill-toggle"
            type="button"
            onClick={() => setSoftSkillsExpanded((prev) => !prev)}
            aria-expanded={softSkillsExpanded}
          >
            <span>{softSkillsExpanded ? 'Tampilkan lebih sedikit' : 'Lihat semua'}</span>
            <i className={`uil ${softSkillsExpanded ? 'uil-angle-up' : 'uil-angle-down'}`}></i>
          </button>
        </article>

        {/* Technical Skills Card */}
        <article className={`skills-card ${techSkillsExpanded ? 'is-expanded' : ''}`} data-skill-card>
          <div className="skills-card__header">
            <div className="skills-card__icon">
              <i className="uil uil-server-network"></i>
            </div>
            <div>
              <h3 className="skills-card__title">Technical Skills</h3>
              <p className="skills-card__subtitle">Tools and technologies used for development, data, and office work.</p>
            </div>
          </div>

          <div className="tech-stack">
            {TECH_SKILLS.map((tech, index) => (
              <div
                key={index}
                className={`tech-item ${tech.isHiddenByDefault ? 'skill-item is-hidden' : ''}`}
              >
                <div className="tech-item__logo">
                  <img
                    src={tech.logo}
                    alt={`${tech.name} logo`}
                    width="24"
                    height="24"
                    style={{
                      width: '24px',
                      height: '24px',
                      maxWidth: '24px',
                      maxHeight: '24px',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
                <div>
                  <h4>{tech.name}</h4>
                  <span>{tech.level}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="skill-toggle"
            type="button"
            onClick={() => setTechSkillsExpanded((prev) => !prev)}
            aria-expanded={techSkillsExpanded}
          >
            <span>{techSkillsExpanded ? 'Tampilkan lebih sedikit' : 'Lihat semua'}</span>
            <i className={`uil ${techSkillsExpanded ? 'uil-angle-up' : 'uil-angle-down'}`}></i>
          </button>
        </article>
      </div>
    </section>
  );
};
