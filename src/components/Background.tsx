import React, { useState } from 'react';
import { EDUCATION_QUALIFICATIONS, WORK_QUALIFICATIONS } from '../data/portfolioData';

export const Background: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'education' | 'organization'>('education');

  return (
    <section className="qualification section" id="background">
      <h2 className="section__title">Background</h2>
      <span className="section__subtitle">My Personal Journey</span>

      <div className="qualification__container container">
        <div className="qualification__tabs">
          <div
            className={`qualification__button button--flex ${activeTab === 'education' ? 'qualification__active' : ''}`}
            onClick={() => setActiveTab('education')}
            role="button"
            tabIndex={0}
          >
            <i className="uil uil-graduation-cap qualification__icon"></i>
            Education
          </div>

          <div
            className={`qualification__button button--flex ${activeTab === 'organization' ? 'qualification__active' : ''}`}
            onClick={() => setActiveTab('organization')}
            role="button"
            tabIndex={0}
          >
            <i className="uil uil-bag qualification__icon"></i>
            Organization
          </div>
        </div>

        <div className="qualification__sections">
          {/* Education Content */}
          <div
            className={`qualification__content ${activeTab === 'education' ? 'qualification__active' : ''}`}
            id="education"
          >
            {EDUCATION_QUALIFICATIONS.map((item, idx) => (
              <div key={idx} className="qualification__data">
                {item.isFirst ? (
                  <>
                    <div>
                      <h3 className="qualification__title">{item.title}</h3>
                      <span className="qualification__subtitle">{item.subtitle}</span>
                      <div className="qualification__calendar">
                        <i className="uil uil-schedule"> {item.calendar}</i>
                      </div>
                    </div>
                    <div>
                      <span className="qualification__rounder"></span>
                      <span className="qualification__line"></span>
                    </div>
                  </>
                ) : (
                  <>
                    <div></div>
                    <div>
                      <span className="qualification__rounder"></span>
                    </div>
                    <div>
                      <h3 className="qualification__title">{item.title}</h3>
                      <span className="qualification__subtitle">{item.subtitle}</span>
                      <div className="qualification__calendar">
                        <i className="uil uil-schedule"> {item.calendar}</i>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Organization Content */}
          <div
            className={`qualification__content ${activeTab === 'organization' ? 'qualification__active' : ''}`}
            id="work"
          >
            {WORK_QUALIFICATIONS.map((item, idx) => (
              <div key={idx} className="qualification__data">
                {item.isFirst ? (
                  <>
                    <div>
                      <h3 className="qualification__title">{item.title}</h3>
                      <span className="qualification__subtitle">{item.subtitle}</span>
                      <div className="qualification__calendar">
                        <i className="uil uil-schedule"> {item.calendar}</i>
                      </div>
                    </div>
                    <div>
                      <span className="qualification__rounder"></span>
                      <span className="qualification__line"></span>
                    </div>
                  </>
                ) : (
                  <>
                    <div></div>
                    <div>
                      <span className="qualification__rounder"></span>
                    </div>
                    <div>
                      <h3 className="qualification__title">{item.title}</h3>
                      <span className="qualification__subtitle">{item.subtitle}</span>
                      <div className="qualification__calendar">
                        <i className="uil uil-schedule"> {item.calendar}</i>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
