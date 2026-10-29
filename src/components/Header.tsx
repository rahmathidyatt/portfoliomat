import React, { useState, useEffect } from 'react';
import {
  Home,
  User,
  Code,
  Award,
  Briefcase,
  FolderGit2,
  Mail,
  Sun,
  Moon,
  Menu as MenuIcon,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  currentView: 'home' | 'certificates';
  onNavigateHome: (sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

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
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('selected-theme', 'light');
    }
  }, [isDarkMode]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Handle scroll for header shadow and active link
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentView === 'home') {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach((current) => {
          const sectionEl = current as HTMLElement;
          const sectionHeight = sectionEl.offsetHeight;
          const sectionTop = sectionEl.offsetTop - 140;
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
        const yOffset = -75;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'about', label: t.nav.about, icon: User },
    { id: 'skills', label: t.nav.skills, icon: Code },
    { id: 'certificate', label: t.nav.certificate, icon: Award },
    { id: 'background', label: t.nav.background, icon: Briefcase },
    { id: 'portfolio', label: t.nav.project, icon: FolderGit2 },
    { id: 'contact', label: t.nav.contact, icon: Mail },
  ];

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
          aria-label="Home"
        >
          Rahmat<span className="nav__logo-dot">.</span>
        </a>

        {currentView === 'certificates' ? (
          <div className="nav__btns">
            <button
              onClick={() => onNavigateHome('certificate')}
              className="button button--secondary button--small"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ArrowLeft size={16} />
              <span>{t.nav.backToPortfolio}</span>
            </button>
            <LanguageToggle />
            <button
              className="theme-btn"
              onClick={toggleTheme}
              title={t.nav.toggleTheme}
              aria-label={t.nav.toggleTheme}
              type="button"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Navigation Links (>= 1024px) */}
            <div className="nav__menu-desktop">
              <ul className="nav__list">
                {navItems.map((item) => (
                  <li key={item.id} className="nav__item">
                    <a
                      href={`#${item.id}`}
                      className={`nav__link ${activeSection === item.id ? 'active-link' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile / Tablet Compact Navigation Dropdown (< 1024px) */}
            {isMenuOpen && (
              <div
                className="nav__backdrop"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
            )}

            <div
              className={`nav__menu-mobile ${isMenuOpen ? 'show-menu' : ''}`}
              id="nav-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              <div className="nav__menu-mobile-header">
                <span className="nav__menu-mobile-title">{t.nav.menu}</span>
                <button
                  className="nav__close"
                  onClick={() => setIsMenuOpen(false)}
                  type="button"
                  aria-label={t.nav.closeMenu}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Compact 2-column grid of sub-menus */}
              <div className="nav__mobile-grid">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const isContact = item.id === 'contact';

                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`nav__mobile-item ${isActive ? 'active' : ''} ${isContact && index % 2 === 0 ? 'span-full' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }}
                    >
                      <Icon size={16} className="nav__mobile-icon" />
                      <span className="nav__mobile-label">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="nav__btns">
              <LanguageToggle />

              <button
                className="theme-btn"
                onClick={toggleTheme}
                title={t.nav.toggleTheme}
                aria-label={t.nav.toggleTheme}
                type="button"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                className="nav__toggle"
                id="nav-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.menu}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};
