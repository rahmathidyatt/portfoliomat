import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { PROJECTS } from '../data/portfolioData';
import { getReadingTime } from '../utils/readingTime';

export const Projects: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const touchStartX = useRef<number | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < PROJECTS.length - 1 ? prev + 1 : prev));
  };

  // Keyboard navigation for carousel
  useEffect(() => {
    if (viewMode !== 'slider') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  const currentProject = PROJECTS[currentIndex];
  const translatedCurrent = t.projects.items.find((item) => item.id === currentProject.id);
  const currentTitle = translatedCurrent ? translatedCurrent.title : currentProject.title;
  const currentTagline = translatedCurrent ? translatedCurrent.tagline : currentProject.tagline;
  const currentDescription = translatedCurrent ? translatedCurrent.description : currentProject.description;
  const currentReadingTime = getReadingTime(currentDescription, language);

  return (
    <section className="section" id="portfolio">
      <div className="container">
        <div className="section__header">
          <span className="section__kicker">{t.projects.kicker}</span>
          <h2 className="section__title">{t.projects.title}</h2>
          <p className="section__subtitle">{t.projects.subtitle}</p>
        </div>

        {/* View Controls */}
        <div className="projects-controls">
          <div className="projects-mode-toggle" role="group" aria-label="Project view mode">
            <button
              type="button"
              className={`projects-mode-btn ${viewMode === 'slider' ? 'active' : ''}`}
              onClick={() => setViewMode('slider')}
            >
              <SlidersHorizontal size={14} />
              <span>{t.projects.viewModeSlider}</span>
            </button>
            <button
              type="button"
              className={`projects-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={14} />
              <span>{t.projects.viewModeGrid}</span>
            </button>
          </div>

          <span style={{ fontSize: 'var(--smaller-font-size)', color: 'var(--text-color-light)' }}>
            {viewMode === 'slider' ? `${currentIndex + 1} / ${PROJECTS.length}` : `${PROJECTS.length} Projects`}
          </span>
        </div>

        {/* Carousel Mode */}
        {viewMode === 'slider' ? (
          <div
            className="projects-carousel-container"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="carousel-slide-content">
              {/* Left Image View */}
              <div className="carousel-img-wrap">
                <img
                  src={currentProject.img}
                  alt={currentTitle}
                />
              </div>

              {/* Right Content */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {currentTagline && (
                  <span className="project-tagline">{currentTagline}</span>
                )}
                <h3 className="project-title" style={{ fontSize: 'var(--h2-font-size)' }}>
                  {currentTitle}
                </h3>
                <p className="project-desc">{currentDescription}</p>

                {/* Tech stack */}
                <div className="project-tech-icons">
                  {currentProject.techIcons.map((tech, idx) => (
                    <div key={idx} className="project-tech-icon" title={tech.alt}>
                      <img src={tech.src} alt={tech.alt} />
                    </div>
                  ))}
                </div>

                {/* Carousel Card Bottom Footer with Reading Time & CTA */}
                <div className="carousel-card-footer">
                  <div
                    className="project-reading-time"
                    title={`${t.projects.readingTimeLabel}: ${currentReadingTime.formattedTime} (${currentReadingTime.wordCount} ${t.projects.wordsLabel})`}
                    aria-label={`${t.projects.readingTimeLabel}: ${currentReadingTime.formattedTime}`}
                  >
                    <Clock size={13} aria-hidden="true" />
                    <span>{currentReadingTime.formattedTime}</span>
                    <span className="reading-time-sep" aria-hidden="true">·</span>
                    <span>{currentReadingTime.wordCount} {t.projects.wordsLabel}</span>
                  </div>

                  <a
                    href={currentProject.sourceCodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--flex"
                  >
                    <span>{t.projects.sourceCode}</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              className="carousel-nav-btn prev"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              aria-label={t.projects.prevAria}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="carousel-nav-btn next"
              onClick={nextSlide}
              disabled={currentIndex === PROJECTS.length - 1}
              aria-label={t.projects.nextAria}
            >
              <ChevronRight size={20} />
            </button>

            {/* Dot bullets */}
            <div className="carousel-dots">
              {PROJECTS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Grid Mode */
          <div className="projects-grid-view">
            {PROJECTS.map((project) => {
              const trans = t.projects.items.find((item) => item.id === project.id);
              const title = trans ? trans.title : project.title;
              const tagline = trans ? trans.tagline : project.tagline;
              const desc = trans ? trans.description : project.description;
              const readingTime = getReadingTime(desc, language);

              return (
                <article key={project.id} className="project-item-card">
                  <div className="project-item-card__img-wrap">
                    <img src={project.img} alt={title} loading="lazy" />
                  </div>

                  <div className="project-item-card__body">
                    <div>
                      {tagline && <span className="project-tagline">{tagline}</span>}
                      <h3 className="project-title">{title}</h3>
                      <p className="project-desc">{desc}</p>
                    </div>

                    <div>
                      <div className="project-tech-icons">
                        {project.techIcons.map((tech, idx) => (
                          <div key={idx} className="project-tech-icon" title={tech.alt}>
                            <img src={tech.src} alt={tech.alt} />
                          </div>
                        ))}
                      </div>

                      {/* Grid Card Footer with Action and Reading Time */}
                      <div className="grid-card-footer">
                        <a
                          href={project.sourceCodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button button--secondary button--small button--flex"
                          style={{ width: '100%' }}
                        >
                          <span>{t.projects.sourceCode}</span>
                          <ExternalLink size={14} />
                        </a>

                        <div
                          className="project-reading-time"
                          title={`${t.projects.readingTimeLabel}: ${readingTime.formattedTime} (${readingTime.wordCount} ${t.projects.wordsLabel})`}
                          aria-label={`${t.projects.readingTimeLabel}: ${readingTime.formattedTime}`}
                        >
                          <Clock size={12} aria-hidden="true" />
                          <span>{readingTime.formattedTime}</span>
                          <span className="reading-time-sep" aria-hidden="true">·</span>
                          <span>{readingTime.wordCount} {t.projects.wordsLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
