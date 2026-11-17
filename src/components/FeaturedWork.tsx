import React from 'react';
import { ArrowUpRight, Database, LayoutGrid, Search, type LucideIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { featuredWork, FeaturedIcon } from '../data/featuredWork';

const ICONS: Record<FeaturedIcon, LucideIcon> = {
  search: Search,
  database: Database,
  layout: LayoutGrid,
};

export const FeaturedWork: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].featured;

  return (
    <section className="section featured" id="featured">
      <div className="container">
        <div className="section__header">
          <span className="section__kicker">{t.kicker}</span>
          <h2 className="section__title">{t.title}</h2>
          <p className="section__subtitle">{t.subtitle}</p>
        </div>

        <div className="featured__list">
          {featuredWork.map((item, idx) => {
            const Icon = ICONS[item.icon];
            return (
              <article key={item.id} className="featured-card">
                <header className="featured-card__head">
                  <span className="featured-card__number" aria-hidden="true">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="featured-card__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <div className="featured-card__heading">
                    <h3 className="featured-card__title">{item.title}</h3>
                    <p className="featured-card__tagline">{item.tagline[language]}</p>
                  </div>
                  <span className="featured-card__status">{item.status[language]}</span>
                </header>

                <div className={`featured-card__story ${item.learned ? '' : 'featured-card__story--two'}`}>
                  <div className="featured-card__block">
                    <span className="featured-card__label">{t.labelQuestion}</span>
                    <p>{item.question[language]}</p>
                  </div>
                  <div className="featured-card__block">
                    <span className="featured-card__label">{t.labelBuilt}</span>
                    <p>{item.built[language]}</p>
                  </div>
                  {item.learned && (
                    <div className="featured-card__block">
                      <span className="featured-card__label">{t.labelLearned}</span>
                      <p>{item.learned[language]}</p>
                    </div>
                  )}
                </div>

                <footer className="featured-card__foot">
                  <ul className="featured-card__tags" aria-label={t.tagsAria}>
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <a
                    className="featured-card__link"
                    href={item.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.seeCode}
                    <ArrowUpRight size={16} />
                  </a>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
