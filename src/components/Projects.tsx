import React, { useState, useEffect, useRef } from 'react';
import { PROJECTS } from '../data/portfolioData';

export const Projects: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < PROJECTS.length - 1 ? prev + 1 : prev));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  return (
    <section className="portfolio section" id="portfolio">
      <h2 className="section__title">Project</h2>
      <span className="section__subtitle">My Website Application Project</span>

      <div className="portfolio__container container" style={{ position: 'relative' }}>
        <div
          className="portfolio-slider-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="portfolio-slider-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {PROJECTS.map((project) => (
              <div key={project.id} className="portfolio-slider-item">
                <div className="portfolio__content grid">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="portfolio__img"
                  />

                  <div className="portfolio__data">
                    <h3 className="portfolio__title">{project.title}</h3>
                    <ul className="category">
                      {project.techIcons.map((tech, idx) => (
                        <li key={idx}>
                          <img
                            src={tech.src}
                            alt={tech.alt}
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
                        </li>
                      ))}
                    </ul>
                    <p className="portfolio__description">{project.description}</p>
                    <a
                      href={project.sourceCodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button--flex button--small portfolio__button"
                    >
                      Source Code
                      <i className="uil uil-arrow-right button__icon"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <button
          className="portfolio-nav-btn prev"
          onClick={prevSlide}
          disabled={currentIndex === 0}
          aria-label="Previous Project"
        >
          <i className="uil uil-angle-left-b swiper-portfolio-icon"></i>
        </button>

        <button
          className="portfolio-nav-btn next"
          onClick={nextSlide}
          disabled={currentIndex === PROJECTS.length - 1}
          aria-label="Next Project"
        >
          <i className="uil uil-angle-right-b swiper-portfolio-icon"></i>
        </button>

        {/* Pagination Dots */}
        <div className="swiper-pagination-container">
          {PROJECTS.map((_, idx) => (
            <button
              key={idx}
              className={`swiper-pagination-bullet ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
