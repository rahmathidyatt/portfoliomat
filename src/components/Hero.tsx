import React, { useState, useEffect } from 'react';

const TYPED_STRINGS = ['Open to Work', 'Information System', 'Data Analyst'];

export const Hero: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = TYPED_STRINGS[stringIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 90);
      } else {
        // Pause at full word before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, 45);
      } else {
        setIsDeleting(false);
        setStringIndex((prev) => (prev + 1) % TYPED_STRINGS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, stringIndex]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="home section" id="home">
      <div className="home__container container grid">
        <div className="home__content grid">
          <div className="home__img">
            <svg
              className="home__blob"
              viewBox="0 0 200 187"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <mask id="mask0" mask-type="alpha">
                <path
                  d="M190.312 36.4879C206.582 62.1187 201.309 102.826 182.328 134.186C163.346 165.547 
                  130.807 187.559 100.226 186.353C69.6454 185.297 41.0228 161.023 21.7403 129.362C2.45775 
                  97.8511 -7.48481 59.1033 6.67581 34.5279C20.9871 10.1032 59.7028 -0.149132 97.9666 
                  0.00163737C136.23 0.303176 174.193 10.857 190.312 36.4879Z"
                />
              </mask>
              <g mask="url(#mask0)">
                <path
                  d="M190.312 36.4879C206.582 62.1187 201.309 102.826 182.328 134.186C163.346 
                  165.547 130.807 187.559 100.226 186.353C69.6454 185.297 41.0228 161.023 21.7403 
                  129.362C2.45775 97.8511 -7.48481 59.1033 6.67581 34.5279C20.9871 10.1032 59.7028 
                  -0.149132 97.9666 0.00163737C136.23 0.303176 174.193 10.857 190.312 36.4879Z"
                />
                <image className="home__blob-img" href="/assets/img/foto.png" />
              </g>
            </svg>
          </div>

          <div className="home__data">
            <h3 className="home__title">Rahmat Hidayat</h3>
            <h3 className="home__subtitle">
              <span className="multiple-text">
                {currentText}
                <span className="typed-cursor" style={{ opacity: 0.8, marginLeft: '2px' }}>
                  |
                </span>
              </span>
            </h3>
            <p className="home__description"></p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className="button button--flex"
            >
              Contact Me<i className="uil uil-message button__icon"></i>
            </a>
          </div>
        </div>

        <div className="home__scroll">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('about');
            }}
            className="home__scroll-button button--flex"
          >
            <i className="uil uil-arrow-down home__scroll-arrow"></i>
            <span className="home__scroll-name">Showcasing My Journey and Achievements</span>
            <i className="uil uil-arrow-down home__scroll-arrow"></i>
          </a>
        </div>
      </div>
    </section>
  );
};
