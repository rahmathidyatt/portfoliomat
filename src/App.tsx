import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Certificates } from './components/Certificates';
import { CertificatesPage } from './components/CertificatesPage';
import { Background } from './components/Background';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ScrollUp } from './components/ScrollUp';

export const PortfolioApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'certificates'>('home');

  // Handle URL hash or back button
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#all-certificates') {
        setCurrentView('certificates');
        window.scrollTo(0, 0);
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigateHome = (sectionId?: string) => {
    setCurrentView('home');
    window.location.hash = sectionId ? `#${sectionId}` : '#home';
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateCertificates = () => {
    setCurrentView('certificates');
    window.location.hash = '#all-certificates';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Header
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
      />

      {currentView === 'home' ? (
        <main className="main">
          <Hero />
          <About />
          <Skills />
          <Certificates onViewAllCertificates={handleNavigateCertificates} />
          <Background />
          <Projects />
          <Contact />
        </main>
      ) : (
        <CertificatesPage onBackToPortfolio={() => handleNavigateHome('certificate')} />
      )}

      <Footer />
      <ScrollUp />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <PortfolioApp />
    </LanguageProvider>
  );
};

export default App;
