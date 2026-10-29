import React, { useState, useEffect } from 'react';

interface HeaderProps {
  currentView: 'home' | 'certificates';
  onNavigateHome: (sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('selected-theme');
    return saved === 'dark';
  });

  // Apply dark mode to document body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('selected-theme', 'dark');
      localStorage.setItem('selected-icon', 'uil-sun');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('selected-theme', 'light');
      localStorage.setItem('selected-icon', 'uil-moon');
    }
  }, [isDarkMode]);

  // Handle scroll for header shadow and active link
  useEffect(() => {
    const handleScroll = () => {
      // Header shadow
      if (window.scrollY >= 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section scroll spy
      if (currentView === 'home') {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach((current) => {
          const sectionEl = current as HTMLElement;
          const sectionHeight = sectionEl.offsetHeight;
          const sectionTop = sectionEl.offsetTop - 100;
          const sectionId = sectionEl.getAttribute('id') || '';

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            setActiveSection(sectionId);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    if (currentView !== 'home') {
      onNavigateHome(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scroll-header' : ''}`} id="header">
      <nav className="nav container">
        <a
          href="#home"
          className="nav__logo"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
        >
          portfolio
        </a>

        {currentView === 'certificates' ? (
          <div className="nav__btns" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => onNavigateHome('certificate')}
              className="back-home button button--flex button--small"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: 'var(--small-font-size)',
                cursor: 'pointer',
              }}
            >
              <i className="uil uil-arrow-left"></i> Back to Portfolio
            </button>
            <i
              className={`uil ${isDarkMode ? 'uil-sun' : 'uil-moon'} dark-mode`}
              id="mode-button"
              onClick={toggleTheme}
              title="Toggle Theme"
              role="button"
              tabIndex={0}
              aria-label="Toggle Dark Mode"
            ></i>
          </div>
        ) : (
          <>
            <div className={`nav__menu ${isMenuOpen ? 'show-menu' : ''}`} id="nav-menu">
              <ul className="nav__list grid">
                <li className="nav__item">
                  <a
                    href="#home"
                    className={`nav__link ${activeSection === 'home' ? 'active-link' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('home');
                    }}
                  >
                    <i className="uil uil-estate nav__icon"></i> Home
                  </a>
                </li>
                <li className="nav__item">
                  <a
                    href="#about"
                    className={`nav__link ${activeSection === 'about' ? 'active-link' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('about');
                    }}
                  >
                    <i className="uil uil-user nav__icon"></i> About
                  </a>
                </li>
                <li className="nav__item">
                  <a
                    href="#skills"
                    className={`nav__link ${activeSection === 'skills' ? 'active-link' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('skills');
                    }}
                  >
                    <i className="uil uil-file-alt nav__icon"></i> Skills
                  </a>
                </li>
                <li className="nav__item">
                  <a
                    href="#certificate"
                    className={`nav__link ${activeSection === 'certificate' ? 'active-link' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('certificate');
                    }}
                  >
                    <i className="uil uil-briefcase-alt nav__icon"></i> Certificate
                  </a>
                </li>
                <li className="nav__item">
                  <a
                    href="#background"
                    className={`nav__link ${activeSection === 'background' ? 'active-link' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('background');
                    }}
                  >
                    <i className="uil uil-briefcase-alt nav__icon"></i> Background
                  </a>
                </li>
                <li className="nav__item">
                  <a
                    href="#portfolio"
                    className={`nav__link ${activeSection === 'portfolio' ? 'active-link' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('portfolio');
                    }}
                  >
                    <i className="uil uil-scenery nav__icon"></i> Project
                  </a>
                </li>
                <li className="nav__item">
                  <a
                    href="#contact"
                    className={`nav__link ${activeSection === 'contact' ? 'active-link' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('contact');
                    }}
                  >
                    <i className="uil uil-message nav__icon"></i> Contact Me
                  </a>
                </li>
              </ul>
              <i
                className="uil uil-times nav__close"
                id="nav-close"
                onClick={() => setIsMenuOpen(false)}
                role="button"
                tabIndex={0}
                aria-label="Close menu"
              ></i>
            </div>

            <div className="nav__btns">
              {/* DARK MODE */}
              <i
                className={`uil ${isDarkMode ? 'uil-sun' : 'uil-moon'} dark-mode`}
                id="mode-button"
                onClick={toggleTheme}
                title="Toggle Theme"
                role="button"
                tabIndex={0}
                aria-label="Toggle Dark Mode"
              ></i>

              <div
                className="nav__toggle"
                id="nav-toggle"
                onClick={() => setIsMenuOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Open menu"
              >
                <i className="uil uil-apps"></i>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};
