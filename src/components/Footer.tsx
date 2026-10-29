import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__bg">
        <div className="footer__container container grid">
          <div>
            <h1 className="footer__title">Social Media</h1>
            <span className="footer__subtitle"></span>
          </div>
          <div className="footer__socials">
            <a
              href="https://www.instagram.com/rahmathidyatt_/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social"
              aria-label="Instagram"
            >
              <i className="uil uil-instagram footer__icon"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/rahmat-hidayat-13229a1a2/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social"
              aria-label="LinkedIn"
            >
              <i className="uil uil-linkedin footer__icon"></i>
            </a>
            <a
              href="https://github.com/rahmathidyatt"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social"
              aria-label="GitHub"
            >
              <i className="uil uil-github footer__icon"></i>
            </a>
          </div>
        </div>
        <p className="footer__copy">&#169; rahmathidyatt</p>
      </div>
    </footer>
  );
};
