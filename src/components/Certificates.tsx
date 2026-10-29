import React, { useState, useEffect } from 'react';
import { ExternalLink, Download, X, Eye, ArrowRight, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { CERTIFICATES } from '../data/portfolioData';
import { CertificateItem } from '../types';

interface CertificatesProps {
  onViewAllCertificates: () => void;
}

export const Certificates: React.FC<CertificatesProps> = ({ onViewAllCertificates }) => {
  const { language } = useLanguage();
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<'all' | 'data' | 'web' | 'leadership'>('all');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCert]);

  const featuredCertificates = CERTIFICATES.filter((cert) => {
    if (activeFilter === 'all') return cert.isFeatured;
    return cert.category === activeFilter;
  });

  return (
    <section className="section" id="certificate">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">{t.certificates.title}</h2>
          <p className="section__subtitle">{t.certificates.subtitle}</p>
        </div>

        {/* Filter Tabs */}
        <div className="cert-filter-bar" role="tablist">
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
            role="tab"
            aria-selected={activeFilter === 'all'}
          >
            {t.certificates.filterAll}
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'data' ? 'active' : ''}`}
            onClick={() => setActiveFilter('data')}
            role="tab"
            aria-selected={activeFilter === 'data'}
          >
            {t.certificates.filterData}
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'web' ? 'active' : ''}`}
            onClick={() => setActiveFilter('web')}
            role="tab"
            aria-selected={activeFilter === 'web'}
          >
            {t.certificates.filterWeb}
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'leadership' ? 'active' : ''}`}
            onClick={() => setActiveFilter('leadership')}
            role="tab"
            aria-selected={activeFilter === 'leadership'}
          >
            {t.certificates.filterOrg}
          </button>
        </div>

        {/* Certificate Cards Grid */}
        <div className="certificate-card-grid">
          {featuredCertificates.map((cert) => (
            <article
              key={cert.id}
              className="cert-card"
              onClick={() => setSelectedCert(cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCert(cert);
                }
              }}
              aria-label={`View certificate ${cert.title}`}
            >
              <div className="cert-card__thumb">
                <img
                  src={cert.img}
                  alt={`${cert.title} certificate`}
                  loading="lazy"
                />
                <div className="cert-card__overlay">
                  <span className="cert-card__preview-badge">
                    <Eye size={14} />
                    <span>Quick Preview</span>
                  </span>
                </div>
              </div>

              <div className="cert-card__body">
                <h3 className="cert-card__title">{cert.title}</h3>
                <div className="cert-card__meta">
                  <span>{cert.issuer}</span>
                  <span aria-hidden="true">·</span>
                  <span>{cert.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="cert-view-more-wrap">
          <button
            type="button"
            onClick={onViewAllCertificates}
            className="button button--secondary button--flex"
          >
            <span>{t.certificates.viewAll}</span>
            <ArrowRight size={16} className="button__icon" />
          </button>
        </div>

        {/* Lightbox Modal */}
        {selectedCert && (
          <div
            className="cert-modal-backdrop"
            onClick={() => setSelectedCert(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
          >
            <div
              className="cert-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="cert-modal-close"
                onClick={() => setSelectedCert(null)}
                aria-label={t.certificates.closeModal}
                type="button"
              >
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--first-color)',
                  fontSize: 'var(--smaller-font-size)',
                  fontWeight: 600,
                  marginBottom: '0.35rem'
                }}>
                  <Award size={15} />
                  {t.certificates.verifiedBadge}
                </span>
                <h3
                  id="cert-modal-title"
                  style={{
                    fontSize: 'var(--h3-font-size)',
                    marginBottom: '0.35rem',
                    color: 'var(--title-color)',
                    lineHeight: 1.3
                  }}
                >
                  {selectedCert.title}
                </h3>
                <p style={{ color: 'var(--text-color-light)', fontSize: 'var(--small-font-size)' }}>
                  {selectedCert.issuer} &bull; {selectedCert.date}
                </p>
              </div>

              <div className="cert-modal-img-wrap">
                <img
                  src={selectedCert.img}
                  alt={selectedCert.title}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <a
                  href={selectedCert.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button--flex button--small"
                >
                  <ExternalLink size={15} />
                  <span>{t.certificates.openPdf}</span>
                </a>
                <a
                  href={selectedCert.pdf}
                  download
                  className="button button--secondary button--flex button--small"
                >
                  <Download size={15} />
                  <span>{t.certificates.downloadPdf}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
