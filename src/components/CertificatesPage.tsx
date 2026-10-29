import React, { useState } from 'react';
import { CERTIFICATES } from '../data/portfolioData';
import { CertificateItem } from '../types';

interface CertificatesPageProps {
  onBackToPortfolio: () => void;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ onBackToPortfolio }) => {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <div className="certificates-page">
      <main className="main" style={{ paddingTop: '5rem', minHeight: '80vh' }}>
        <section className="section">
          <div className="container">
            <div className="page-heading">
              <span className="page-heading__eyebrow">Certificate Gallery</span>
              <h1 className="section__title">All Certificates</h1>
              <p className="page-heading__text">
                A complete certificate gallery displayed directly inside the portfolio website, so visitors can review achievements without opening an external Drive folder.
              </p>
              <div style={{ marginTop: '1.25rem', marginBottom: '2rem' }}>
                <button
                  onClick={onBackToPortfolio}
                  className="button button--flex button--small"
                  style={{ cursor: 'pointer', border: 'none', font: 'inherit' }}
                >
                  <i className="uil uil-arrow-left button__icon"></i> Back to Portfolio
                </button>
              </div>
            </div>
          </div>

          <div className="sertifikat__container container grid certificate-grid">
            {CERTIFICATES.map((cert) => (
              <article key={cert.id} className="blog-item certificate-card">
                <div className="inner">
                  <a
                    className="thumb"
                    href={cert.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCert(cert);
                    }}
                  >
                    <img src={cert.img} alt={`${cert.title} certificate`} />
                  </a>
                  <div className="details">
                    <h3 className="title">
                      <a
                        href={cert.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCert(cert);
                        }}
                      >
                        {cert.title}
                      </a>
                    </h3>
                    <ul className="meta">
                      <li>{cert.date}</li>
                      <li>{cert.issuer}</li>
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Preview Modal */}
      {selectedCert && (
        <div className="cert-modal-backdrop" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="cert-modal-close"
              onClick={() => setSelectedCert(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'var(--h3-font-size)', marginBottom: '0.25rem', color: 'var(--title-color)' }}>
                {selectedCert.title}
              </h3>
              <p style={{ color: 'var(--text-color-light)', fontSize: 'var(--small-font-size)' }}>
                {selectedCert.issuer} &bull; {selectedCert.date}
              </p>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <img
                src={selectedCert.img}
                alt={selectedCert.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  margin: '0 auto',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <a
                href={selectedCert.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="button button--flex button--small"
              >
                Open Original PDF <i className="uil uil-external-link-alt button__icon"></i>
              </a>
              <a
                href={selectedCert.pdf}
                download
                className="button button--flex button--small"
                style={{ background: 'var(--text-color-light)' }}
              >
                Download PDF <i className="uil uil-arrow-to-bottom button__icon"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
