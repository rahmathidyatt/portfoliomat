import React from 'react';

export const About: React.FC = () => {
  return (
    <section className="about section" id="about">
      <h2 className="section__title">About Me</h2>
      <span className="section__subtitle">My Introduction</span>

      <div className="about__container container grid">
        <img src="/assets/img/about.jpg" alt="Rahmat Hidayat" className="about__img" />

        <div className="about__data">
          <p className="about__description">
            A graduate of the Information Systems program with internship experience in a government institution and professional experience 
            as an Administrative Staff at STMIK Bina Bangsa Kendari. Proficient in using Microsoft Office, managing documents, and possessing 
            basic knowledge of data analysis using Python. Highly motivated, quick to adapt, and capable of working independently as well as 
            collaboratively within a team.
          </p>

          <div className="about__buttons">
            <a download="CV_RahmatHidayat.pdf" href="/assets/cv/CV_RahmatHidayat.pdf" className="button button--flex">
              Download CV<i className="uil uil-arrow-to-bottom button__icon"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
