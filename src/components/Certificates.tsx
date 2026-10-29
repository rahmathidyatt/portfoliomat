import React, { useState } from 'react';
import { CERTIFICATES } from '../data/portfolioData';
import { CertificateItem } from '../types';

interface CertificatesProps {
  onViewAllCertificates: () => void;
}

export const Certificates: React.FC<CertificatesProps> = ({ onViewAllCertificates }) => {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const featuredCertificates = CERTIFICATES.filter((cert) => cert.isFeatured);

  return (
    <section className="qualification section" id="certificate">
      <h2 className="section__title">Certificate</h2>
      <span className="section__subtitle">Featured achievements and learning records</span>

      <div className="sertifikat__container container grid certificate-grid compact-certificate-grid">
        {featuredCertificates.map((cert) => (
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

      <div className="certificate-action">
        <button
          onClick={onViewAllCertificates}
          className="button button--flex"
          style={{ cursor: 'pointer', border: 'none', font: 'inherit' }}
        >
          View All Certificates<i className="uil uil-arrow-right button__icon"></i>
        </button>
      </div>

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
    </section>
  );
};
